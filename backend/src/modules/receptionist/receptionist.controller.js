/**
 * Receptionist Controller
 * Handles HTTP requests for receptionist operations
 */
const receptionistService = require('./receptionist.service');

const receptionistController = {
  /**
   * Search patient by phone
   * GET /receptionist/patients/search?phone=xxx
   */
  async searchPatient(req, res) {
    try {
      const { phone } = req.query;
      if (!phone) {
        return res.status(400).json({ message: 'Phone number is required' });
      }
      const patients = await receptionistService.searchPatientByPhone(phone);
      res.json(patients);
    } catch (error) {
      console.error('Error searching patient:', error);
      res.status(500).json({ message: 'Failed to search patient', error: error.message });
    }
  },

  /**
   * Register walk-in patient
   * POST /receptionist/patients
   */
  async registerWalkIn(req, res) {
    try {
      const result = await receptionistService.registerWalkIn(req.body, req.user.id);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error registering patient:', error);
      res.status(500).json({ message: 'Failed to register patient', error: error.message });
    }
  },

  /**
   * Get all tokens for today
   * GET /receptionist/tokens
   */
  async getTokens(req, res) {
    try {
      const tokens = await receptionistService.getTokens();
      res.json(tokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      res.status(500).json({ message: 'Failed to fetch tokens', error: error.message });
    }
  },

  /**
   * Generate new token
   * POST /receptionist/tokens
   */
  async generateToken(req, res) {
    try {
      const token = await receptionistService.generateToken(req.body, req.user.id);
      res.status(201).json(token);
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({ message: 'Failed to generate token', error: error.message });
    }
  },

  /**
   * Update token status
   * PUT /receptionist/tokens/:id
   */
  async updateTokenStatus(req, res) {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }
      await receptionistService.updateTokenStatus(req.params.id, status);
      res.json({ message: 'Token updated successfully' });
    } catch (error) {
      console.error('Error updating token:', error);
      res.status(500).json({ message: 'Failed to update token', error: error.message });
    }
  },

  /**
   * Delete/Cancel token
   * DELETE /receptionist/tokens/:id
   */
  async deleteToken(req, res) {
    try {
      await receptionistService.deleteToken(req.params.id);
      res.json({ message: 'Token deleted successfully' });
    } catch (error) {
      console.error('Error deleting token:', error);
      res.status(500).json({ message: 'Failed to delete token', error: error.message });
    }
  },

  /**
   * Get recent invoices
   * GET /receptionist/invoices
   */
  async getInvoices(req, res) {
    try {
      const invoices = await receptionistService.getRecentInvoices();
      res.json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
    }
  },

  /**
   * Create invoice
   * POST /receptionist/invoices
   */
  async createInvoice(req, res) {
    try {
      const invoice = await receptionistService.createInvoice(req.body, req.user.id);
      res.status(201).json(invoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      res.status(500).json({ message: 'Failed to create invoice', error: error.message });
    }
  },

  /**
   * Get invoice by ID
   * GET /receptionist/invoices/:id
   */
  async getInvoiceById(req, res) {
    try {
      const invoice = await receptionistService.getInvoiceById(req.params.id);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
      res.json(invoice);
    } catch (error) {
      console.error('Error fetching invoice:', error);
      res.status(500).json({ message: 'Failed to fetch invoice', error: error.message });
    }
  }
};

module.exports = receptionistController;
