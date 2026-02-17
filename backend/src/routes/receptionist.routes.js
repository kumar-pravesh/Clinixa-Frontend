const express = require('express');
const router = express.Router();
const receptionistController = require('../controllers/receptionist.controller');
const { authenticateToken, authorizeRoles } = require('../middlewares/auth.middleware');

// Middleware for all routes: Authenticated Receptionist
router.use(authenticateToken);
router.use(authorizeRoles('receptionist'));

// Dashboard Stats
router.get('/dashboard/stats', receptionistController.getDashboardStats);

// Token Management
router.get('/tokens', receptionistController.getTokens);
router.post('/tokens/generate', receptionistController.generateToken);
router.put('/tokens/:id/status', receptionistController.updateTokenStatus);
router.delete('/tokens/:id', receptionistController.deleteToken);

// Patient Management
router.get('/patients/search', receptionistController.searchPatients);
router.post('/patients/register', receptionistController.registerWalkIn);

// Invoice Management
router.get('/invoices', receptionistController.getInvoices);
router.post('/invoices/create', receptionistController.createInvoice);
router.get('/invoices/:id', receptionistController.getInvoiceById);

module.exports = router;
