const { pool } = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to generate tokens
const generateTokens = (user, doctorId) => {
    const accessToken = jwt.sign(
        { id: user.id, role: 'doctor', name: user.name, doctorId: doctorId },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return { accessToken };
};

const authenticateDoctor = async (email, password, ip) => {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND role = "doctor"', [email]);
    const user = users[0];

    if (!user) throw new Error('Invalid credentials');

    // Check Status
    if (user.status === 'Inactive') throw new Error('Account is inactive. Please contact admin.');

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid credentials');

    const [doctors] = await pool.query('SELECT id FROM doctors WHERE user_id = ?', [user.id]);
    const doctor = doctors[0];

    if (!doctor) throw new Error('Doctor profile not found');

    // Log login
    await pool.query('INSERT INTO login_history (doctor_id, ip_address) VALUES (?, ?)', [doctor.id, ip]);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'doctor',
            status: user.status,
            doctorId: doctor.id
        },
        ...generateTokens(user, doctor.id)
    };
};

const getDoctorProfile = async (userId) => {
    const [rows] = await pool.query(`
        SELECT u.name, u.email, u.phone, u.status, d.specialization, d.experience_years, d.consultation_fee
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        WHERE u.id = ?
    `, [userId]);
    return rows[0];
};

const getAppointments = async (doctorId) => {
    const [rows] = await pool.query(`
        SELECT a.id, u.name as patient_name, a.patient_id, a.date, a.time, a.type, a.status, a.reason
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.date DESC, a.time ASC
    `, [doctorId]);
    return rows;
};

const getPatients = async (doctorId) => {
    // Logic: Patients who have at least one appointment with this doctor
    const [rows] = await pool.query(`
        SELECT DISTINCT p.id, u.name, TIMESTAMPDIFF(YEAR, p.dob, CURDATE()) as age, p.gender, p.phone,
               (SELECT reason FROM appointments WHERE patient_id = p.id AND doctor_id = ? ORDER BY date DESC LIMIT 1) as diagnosis,
               (SELECT date FROM appointments WHERE patient_id = p.id AND doctor_id = ? ORDER BY date DESC LIMIT 1) as lastVisit
        FROM patients p
        JOIN users u ON p.user_id = u.id
        JOIN appointments a ON p.id = a.patient_id
        WHERE a.doctor_id = ?
    `, [doctorId, doctorId, doctorId]);
    return rows;
};

const getPrescriptions = async (doctorId, appointmentId) => {
    let query = `
        SELECT pr.id, u.name as patient_name, pr.date, pr.status,
               (SELECT JSON_ARRAYAGG(JSON_OBJECT('name', pi.medicine_name, 'dosage', pi.dosage, 'frequency', pi.frequency, 'duration', pi.duration))
                FROM prescription_items pi WHERE pi.prescription_id = pr.id) as medications
        FROM prescriptions pr
        JOIN patients p ON pr.patient_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE pr.doctor_id = ?
    `;

    // Note: If we had appointment_id in prescriptions table, we'd filter by it. 
    // Current schema doesn't have it, so returning all for now or filtering by date/patient if logic required.
    // For now, returning all prescriptions for the doctor.

    query += ' ORDER BY pr.date DESC';
    const [rows] = await pool.query(query, [doctorId]);
    return rows;
};

const createPrescription = async (doctorId, data) => {
    const { patientId, medications } = data; // medications: [{name, dosage, frequency, duration}]

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Create Prescription
        const [presResult] = await connection.query(
            'INSERT INTO prescriptions (doctor_id, patient_id, date, status) VALUES (?, ?, CURDATE(), "Active")',
            [doctorId, patientId]
        );
        const prescriptionId = presResult.insertId;

        // 2. Add Medications
        if (medications && medications.length > 0) {
            const values = medications.map(m => [prescriptionId, m.name, m.dosage, m.frequency, m.duration]);
            await connection.query(
                'INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration) VALUES ?',
                [values]
            );
        }

        await connection.commit();
        return { id: prescriptionId, message: 'Prescription created successfully' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

const addMedicines = async (doctorId, data) => {
    // Endpoint: /api/doctor/medicines
    // Assumption: Checks if prescription exists or creates new? 
    // Frontend likely calls this to Add to existing, OR it's just a subset of createPrescription.
    // Implemented as adding items to an existing prescription.
    const { prescriptionId, medications } = data;

    // Verify ownership
    const [pres] = await pool.query('SELECT id FROM prescriptions WHERE id = ? AND doctor_id = ?', [prescriptionId, doctorId]);
    if (pres.length === 0) throw new Error('Prescription not found or unauthorized');

    if (medications && medications.length > 0) {
        const values = medications.map(m => [prescriptionId, m.name, m.dosage, m.frequency, m.duration]);
        await pool.query(
            'INSERT INTO prescription_items (prescription_id, medicine_name, dosage, frequency, duration) VALUES ?',
            [values]
        );
    }
    return { message: 'Medicines added successfully' };
};

const uploadLabReport = async (doctorId, data) => {
    const { patientId, testName, filePath } = data;
    const [result] = await pool.query(
        'INSERT INTO lab_reports (doctor_id, patient_id, test_name, file_path, date) VALUES (?, ?, ?, ?, CURDATE())',
        [doctorId, patientId, testName, filePath]
    );
    return { id: result.insertId, message: 'Report uploaded successfully' };
};

const setFollowUp = async (doctorId, data) => {
    // Creates a new appointment with type 'Follow-up'
    const { patientId, date, time } = data;
    const [result] = await pool.query(
        'INSERT INTO appointments (doctor_id, patient_id, date, time, type, status) VALUES (?, ?, ?, ?, "Follow-up", "Scheduled")',
        [doctorId, patientId, date, time]
    );
    return { id: result.insertId, message: 'Follow-up appointment set' };
};

const getPublicDoctors = async () => {
    const [rows] = await pool.query(`
        SELECT 
            CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
            u.name,
            u.email,
            u.phone,
            u.status,
            d.specialization as dept,
            d.experience_years,
            d.consultation_fee,
            d.qualification,
            dep.name as department_name
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN departments dep ON d.department_id = dep.id
        WHERE u.role = 'doctor'
        ORDER BY u.name
    `);
    return rows;
};

const getDoctorById = async (doctorId) => {
    const cleanId = String(doctorId).replace('DOC-', '');
    const [rows] = await pool.query(`
        SELECT 
            CONCAT('DOC-', LPAD(d.id, 4, '0')) as id,
            u.name,
            u.email,
            u.phone,
            u.status,
            d.specialization as dept,
            d.experience_years,
            d.consultation_fee,
            d.qualification,
            dep.name as department_name
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN departments dep ON d.department_id = dep.id
        WHERE d.id = ?
    `, [cleanId]);
    return rows[0];
};

module.exports = {
    authenticateDoctor,
    getDoctorProfile,
    getAppointments,
    getPatients,
    getPrescriptions,
    createPrescription,
    addMedicines,
    uploadLabReport,
    setFollowUp,
    getPublicDoctors,
    getDoctorById
};
