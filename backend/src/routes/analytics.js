const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

// Protected routes (admin only)
router.get('/dashboard', auth, analyticsController.getDashboard);

module.exports = router;
