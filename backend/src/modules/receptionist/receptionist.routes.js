/**
 * Receptionist Routes
 * All routes require authentication with receptionist or admin role
 */
const express = require('express');
const router = express.Router();
const receptionistController = require('./receptionist.controller');
const { authenticateToken, authorizeRoles } = require('../../middlewares/auth.middleware');

// Apply auth middleware to all routes
router.use(authenticateToken);
router.use(authorizeRoles('receptionist', 'admin'));

// Patient management
router.get('/patients/search', receptionistController.searchPatient);
router.post('/patients', receptionistController.registerWalkIn);

// Token/Queue management
router.get('/tokens', receptionistController.getTokens);
router.post('/tokens', receptionistController.generateToken);
router.put('/tokens/:id', receptionistController.updateTokenStatus);
router.delete('/tokens/:id', receptionistController.deleteToken);

// Billing/Invoice management
router.get('/invoices', receptionistController.getInvoices);
router.post('/invoices', receptionistController.createInvoice);
router.get('/invoices/:id', receptionistController.getInvoiceById);

module.exports = router;
