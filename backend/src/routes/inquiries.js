const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const auth = require('../middleware/auth');
const honeypot = require('../middleware/honeypot');
const captcha = require('../middleware/captcha');
const { validateInquiry } = require('../middleware/validator');

// Public route — security stack: honeypot → CAPTCHA → server-side validation → handler
router.post('/', honeypot, captcha, validateInquiry, inquiryController.createInquiry);

// Protected routes (admin only)
router.get('/', auth, inquiryController.getAllInquiries);
router.patch('/:id/status', auth, inquiryController.updateStatus);
router.delete('/:id', auth, inquiryController.deleteInquiry);

module.exports = router;
