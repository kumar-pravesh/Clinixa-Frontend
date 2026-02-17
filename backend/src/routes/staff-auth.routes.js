const express = require('express');
const router = express.Router();
const staffAuthController = require('../controllers/staff-auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/login', staffAuthController.login);
router.post('/logout', staffAuthController.logout);
router.post('/refresh', staffAuthController.refreshToken);

// Check auth status (used by frontend to verify session)
router.get('/login', authenticateToken, staffAuthController.checkAuth);

module.exports = router;
