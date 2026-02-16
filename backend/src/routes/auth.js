const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateLogin } = require('../middleware/validator');

// Public routes
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);

module.exports = router;
