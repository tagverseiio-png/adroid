const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// All upload routes require authentication
router.post('/', auth, upload.single('image'), uploadController.uploadImage);
router.post('/multiple', auth, upload.array('images', 10), uploadController.uploadMultiple);
router.delete('/', auth, uploadController.deleteFile);

module.exports = router;
