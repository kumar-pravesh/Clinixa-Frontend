const receptionistService = require('../services/receptionist.service');

// Patient Management
const searchPatients = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);
        const result = await receptionistService.searchPatients(query);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const registerWalkIn = async (req, res) => {
    try {
        const result = await receptionistService.registerWalkIn(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Token Management
const getTokens = async (req, res) => {
    try {
        const result = await receptionistService.getTokens();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const generateToken = async (req, res) => {
    try {
        const result = await receptionistService.generateToken(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateTokenStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await receptionistService.updateTokenStatus(req.params.id, status);
        res.json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteToken = async (req, res) => {
    try {
        await receptionistService.deleteToken(req.params.id);
        res.json({ message: 'Token deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Invoice Management
const getInvoices = async (req, res) => {
    try {
        const result = await receptionistService.getRecentInvoices();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createInvoice = async (req, res) => {
    try {
        console.log('[Receptionist] createInvoice called with:', req.body);
        console.log('[Receptionist] User ID:', req.user.id);
        const result = await receptionistService.createInvoice(req.body, req.user.id);
        res.status(201).json(result);
    } catch (error) {
        console.error('[Receptionist] Invoice creation error:', error.message, error.stack);
        res.status(400).json({ message: error.message, details: error.stack });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const result = await receptionistService.getInvoiceById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Invoice not found' });
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const result = await receptionistService.getDashboardStats();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    searchPatients,
    registerWalkIn,
    getTokens,
    generateToken,
    updateTokenStatus,
    deleteToken,
    getInvoices,
    createInvoice,
    getInvoiceById,
    getDashboardStats
};
