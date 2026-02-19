const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model'); // If needed for direct user ops
const DoctorModel = require('../models/doctor.model');
const DepartmentModel = require('../models/department.model');
const PatientModel = require('../models/patient.model');
const AppointmentModel = require('../models/appointment.model');
const InvoiceModel = require('../models/invoice.model');
const eventBus = require('../lib/event-bus');

// Note: TokenModel for dashboard summary (migrated later or raw SQL now)
// I'll use raw SQL for TokenModel queries in getDashboardSummary for now as per original service resilience

const adminService = {
    /**
     * Create a new doctor
     */
    async createDoctor(doctorData) {
        const { name, email, phone, password, dept, experience_years, consultation_fee, status, qualification, image_url } = doctorData;
        const finalPassword = password || 'Doctor@123';

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Check if user exists
            const existing = await UserModel.findByEmail(email); // Uses generic findByEmail which returns user obj, not [rows]
            if (existing) {
                throw new Error('User with this email already exists');
            }

            // Create User
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(finalPassword, salt);

            // UserModel.create returns ID
            const userId = await UserModel.create({
                name,
                email,
                phone,
                password_hash: passwordHash,
                role: 'doctor',
                status: status || 'Active'
            }, connection);

            // Get or Create Department
            let deptId = null;
            if (dept) {
                const existingDept = await DepartmentModel.findByName(dept, connection);
                if (existingDept) {
                    deptId = existingDept.id;
                } else {
                    deptId = await DepartmentModel.create({ name: dept }, connection);
                }
            }

            // Create Doctor Profile
            const doctorId = await DoctorModel.create({
                userId,
                departmentId: deptId,
                departmentName: dept,
                experience_years,
                consultation_fee,
                qualification,
                image_url
            }, connection);

            await connection.commit();

            // Return full doctor data for frontend sync
            return {
                id: `DOC-${String(doctorId).padStart(4, '0')}`,
                name,
                email,
                phone,
                role: 'doctor',
                status: status || 'Active',
                dept: dept,
                specialization: dept,
                experience_years: experience_years || 0,
                consultation_fee: consultation_fee || 500,
                qualification: qualification || '',
                image_url: image_url || null
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Get all doctors
     */
    async getAllDoctors() {
        return DoctorModel.findAll();
    },

    /**
     * Update doctor information
     */
    async updateDoctor(doctorId, updateData) {
        const numericId = doctorId.toString().replace('DOC-', '');
        const { name, email, phone, dept, consultation_fee, status, experience_years, qualification, image_url } = updateData;

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const doctor = await DoctorModel.findById(numericId);
            if (!doctor) {
                throw new Error('Doctor not found');
            }
            const userId = doctor.user_id;

            // Update user information (Need a method in UserModel or raw SQL via BaseModel)
            // UserModel doesn't have explicit update method for admin properties yet.
            // I'll use BaseModel.query with connection here or add to UserModel?
            // Adding to UserModel is cleaner but for speed I'll use query here since it's admin specific
            await UserModel.query(
                'UPDATE users SET name = ?, email = ?, phone = ?, status = ? WHERE id = ?',
                [name, email, phone, status || 'Active', userId],
                connection
            );

            // Handle department update
            let deptId = doctor.department_id;
            if (dept) {
                const existingDept = await DepartmentModel.findByName(dept, connection);
                if (existingDept) {
                    deptId = existingDept.id;
                } else {
                    deptId = await DepartmentModel.create({ name: dept }, connection);
                }
            }

            // Update doctor profile
            await DoctorModel.update(numericId, {
                departmentId: deptId,
                departmentName: dept,
                consultation_fee,
                experience_years,
                qualification,
                image_url
            }, connection);

            await connection.commit();

            return {
                id: doctorId,
                name,
                email,
                phone,
                status,
                dept,
                specialization: dept,
                consultation_fee,
                experience_years,
                qualification,
                image_url: image_url || null
            };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Delete doctor
     */
    async deleteDoctor(doctorId) {
        const numericId = doctorId.toString().replace('DOC-', '');

        // We need to delete user, constraint will likely cascade delete doctor
        // But verifying logic: original code gets user_id then deletes user.
        const doctor = await DoctorModel.findById(numericId);
        if (!doctor) {
            throw new Error('Doctor not found');
        }

        // Delete User (Cascade should handle doctor table)
        await UserModel.query('DELETE FROM users WHERE id = ?', [doctor.user_id]);
        return { success: true };
    },

    /**
     * Get all departments
     */
    async getDepartments() {
        return DepartmentModel.findAll();
    },

    /**
     * Create department
     */
    async createDepartment(data) {
        const id = await DepartmentModel.create(data);
        return { id, ...data };
    },

    /**
     * Update department
     */
    async updateDepartment(id, data) {
        const numericId = id.toString().replace('DEPT-', '');
        await DepartmentModel.update(numericId, data);
        return { id, ...data };
    },

    /**
     * Delete department
     */
    async deleteDepartment(id) {
        const numericId = id.toString().replace('DEPT-', '');
        await DepartmentModel.delete(numericId);
        return { success: true };
    },

    /**
     * Get all patients
     */
    async getPatients(search = '', limit = 100) {
        return PatientModel.findAll(search, limit);
    },

    /**
     * Delete a patient and all linked data
     */
    async deletePatient(patientId) {
        const numericId = patientId.toString().replace('PID-', '');
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            await connection.query('SET FOREIGN_KEY_CHECKS = 0');

            // Delete linked data first
            await connection.query('DELETE FROM appointments WHERE patient_id = ?', [numericId]);
            await connection.query('DELETE FROM prescriptions WHERE patient_id = ?', [numericId]);
            await connection.query('DELETE FROM lab_reports WHERE patient_id = ?', [numericId]);

            // Get user_id before deleting patient
            const [[patient]] = await connection.query('SELECT user_id FROM patients WHERE id = ?', [numericId]);
            if (!patient) throw new Error('Patient not found');

            // Delete patient profile and user account
            await connection.query('DELETE FROM patients WHERE id = ?', [numericId]);
            await connection.query('DELETE FROM users WHERE id = ?', [patient.user_id]);

            await connection.query('SET FOREIGN_KEY_CHECKS = 1');
            await connection.commit();
            return { success: true };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Get all appointments
     */
    async getAppointments(filters = {}) {
        return AppointmentModel.findAll(filters);
    },

    /**
     * Update appointment status
     */
    async updateAppointmentStatus(id, status) {
        await AppointmentModel.updateStatus(id, status);
        return { success: true, status };
    },

    /**
     * Get invoices
     */
    async getInvoices(limit = 100) {
        return InvoiceModel.findAll(limit);
    },

    /**
     * Update invoice status
     */
    async updateInvoiceStatus(id, status) {
        await InvoiceModel.updateStatus(id, status);
        return { success: true, status };
    },

    /**
     * Approve appointment
     */
    async approveAppointment(id) {
        await AppointmentModel.updateStatus(id, 'Scheduled');
        return { success: true, status: 'Scheduled' };
    },

    /**
     * Reject appointment
     */
    async rejectAppointment(id) {
        await AppointmentModel.updateStatus(id, 'Cancelled');

        // ─── Post-Update Event Emission (additive) ────────────
        try {
            const [rows] = await pool.query(`
                SELECT 
                    u.email, u.name as patientName,
                    doc_u.name as doctorName,
                    DATE_FORMAT(a.date, '%Y-%m-%d') as date,
                    a.time
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                JOIN users u ON p.user_id = u.id
                JOIN doctors d ON a.doctor_id = d.id
                JOIN users doc_u ON d.user_id = doc_u.id
                WHERE a.id = ?
            `, [id]);

            if (rows.length > 0) {
                eventBus.safeEmit('appointment.rejected', {
                    email: rows[0].email,
                    patientName: rows[0].patientName,
                    doctorName: rows[0].doctorName,
                    date: rows[0].date,
                    time: rows[0].time,
                    reason: 'Appointment cancelled by the clinic'
                });
            }
        } catch (eventError) {
            console.error('[AdminService] Event emission error (non-fatal):', eventError.message);
        }
        // ─── End Post-Update Event ────────────────────────────

        return { success: true, status: 'Cancelled' };
    },

    /**
     * Get dashboard summary
     */
    async getDashboardSummary() {
        try {
            const doctorCount = await DoctorModel.countTotal();
            const patientCount = await PatientModel.countTotal();
            const todayAppointments = await AppointmentModel.countToday();

            // Resilient query for Tokens (not migrated model yet)
            let pendingTokensValue = 0;
            try {
                const [pendingTokens] = await pool.query(
                    `SELECT COUNT(*) as count FROM tokens WHERE status IN ('Waiting', 'In Progress') AND DATE(created_at) = CURDATE()`
                );
                pendingTokensValue = pendingTokens[0].count;
            } catch (e) {
                console.warn('[AdminService] tokens table missing or inaccessible, defaulting to 0');
            }

            const todayRevenueValue = await InvoiceModel.getTodayRevenue();

            return {
                doctors: doctorCount,
                patients: patientCount,
                todayAppointments: todayAppointments,
                pendingTokens: pendingTokensValue,
                todayRevenue: todayRevenueValue
            };
        } catch (error) {
            console.error('[AdminService] getDashboardSummary critical failure:', error);
            throw error;
        }
    },
    /**
     * Create admin notification (Placeholder)
     */
    async createAdminNotification(type, title, message, detailsId, link) {
        // TODO: Implement persistent admin notifications if needed.
        // Currently admin dashboard polls real-time data.
        console.log(`[AdminNotification] ${type}: ${title} - ${message}`);
        return true;
    }
};

module.exports = adminService;
