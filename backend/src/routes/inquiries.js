const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const auth = require('../middleware/auth');
const { validateInquiry } = require('../middleware/validator');

// Public route
router.post('/', validateInquiry, inquiryController.createInquiry);

// Protected routes (admin only)
router.get('/', auth, inquiryController.getAllInquiries);
router.patch('/:id/status', auth, inquiryController.updateStatus);
router.delete('/:id', auth, inquiryController.deleteInquiry);

module.exports = router;
