const { pool } = require('../config/db');
const PatientModel = require('../models/patient.model');
const TokenModel = require('../models/token.model');
const InvoiceModel = require('../models/invoice.model');
const DoctorModel = require('../models/doctor.model'); // If needed

const receptionistService = {
    /**
     * Search patient by phone number
     */
    async searchPatients(query) {
        return PatientModel.findAll(query);
    },

    /**
     * Register walk-in patient
     */
    async registerWalkIn(patientData, registeredBy) {
        const id = await PatientModel.registerWalkIn(patientData, registeredBy);
        return {
            id,
            patientId: `PID-${String(id).padStart(4, '0')}`
        };
    },

    /**
     * Get all tokens for today
     */
    async getTokens() {
        return TokenModel.findAllToday();
    },

    /**
     * Generate new token
     */
    async generateToken(data, generatedBy) {
        const { patient_id, doctor_id, department } = data;

        // Get next token number for today
        const count = await TokenModel.countToday();
        const nextNumber = 1000 + count + 1;
        const tokenNumber = `TK-${nextNumber}`;

        const id = await TokenModel.create({
            tokenNumber,
            patientId: patient_id,
            doctorId: doctor_id,
            department,
            generatedBy
        });

        // Fetch details
        return TokenModel.findById(id);
    },

    /**
     * Update token status
     */
    async updateTokenStatus(tokenId, status) {
        let calledAt = null;
        let completedAt = null;
        if (status === 'In Progress') {
            calledAt = new Date();
        } else if (status === 'Completed') {
            completedAt = new Date();
        }

        await TokenModel.updateStatus(tokenId, status, calledAt, completedAt);
        return { success: true };
    },

    /**
     * Delete/Cancel token
     */
    async deleteToken(tokenId) {
        await TokenModel.delete(tokenId);
        return { success: true };
    },

    /**
     * Get recent invoices
     */
    async getRecentInvoices() {
        return InvoiceModel.getRecent();
    },

    /**
     * Create invoice
     */
    async createInvoice(data, createdBy) {
        const {
            patient_id, appointment_id,
            consultation_fee = 0, lab_charges = 0, medicine_charges = 0, other_charges = 0,
            items = [], discount_percent = 0, payment_mode = 'Cash'
        } = data;

        const subtotal = parseFloat(consultation_fee) + parseFloat(lab_charges) +
            parseFloat(medicine_charges) + parseFloat(other_charges) +
            items.reduce((sum, item) => sum + parseFloat(item.charge || 0), 0);

        const discountAmount = (subtotal * parseFloat(discount_percent)) / 100;
        const taxableAmount = subtotal - discountAmount;
        const taxAmount = taxableAmount * 0.18;
        const total = taxableAmount + taxAmount;

        // Generate invoice number
        const count = await InvoiceModel.countThisYear();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

        const invoiceId = await InvoiceModel.create({
            invoiceNumber,
            appointment_id,
            patient_id,
            createdBy,
            consultation_fee,
            lab_charges,
            medicine_charges,
            other_charges,
            items,
            subtotal,
            discount_percent,
            discountAmount, // renamed from discount_amount in service usually camelCase internal
            taxAmount,
            total,
            payment_mode,
            discount_amount: discountAmount // Pass explicit snake_case keys if model expects them or simple destructuring
            // My Model destructures: discount_amount. So I should pass it.
        });

        return {
            id: invoiceId,
            invoice_number: invoiceNumber,
            total,
            payment_status: 'Paid'
        };
    },

    /**
     * Get invoice by ID
     */
    async getInvoiceById(invoiceId) {
        const invoice = await InvoiceModel.findById(invoiceId);
        if (!invoice) return null;

        if (typeof invoice.items === 'string') {
            try {
                invoice.items = JSON.parse(invoice.items);
            } catch (e) {
                invoice.items = [];
            }
        }
        return invoice;
    },

    /**
     * Get dashboard stats for receptionist
     */
    async getDashboardStats() {
        const [
            newRegistrations,
            activeQueue,
            avgWait,
            revenueToday
        ] = await Promise.all([
            PatientModel.countToday(),
            TokenModel.countActiveToday(),
            TokenModel.getAvgWaitingTimeToday(),
            InvoiceModel.getTodayRevenue()
        ]);

        return {
            newRegistrations,
            activeQueue,
            avgWaitingTime: Math.round(avgWait),
            revenueToday
        };
    }
};

module.exports = receptionistService;
