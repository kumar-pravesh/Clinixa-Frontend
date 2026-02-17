const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');

// Public API Routes (No Auth)
router.get('/departments', publicController.getDepartments);
router.get('/doctors', publicController.getDoctors);
router.get('/stats', publicController.getStats);

module.exports = router;
