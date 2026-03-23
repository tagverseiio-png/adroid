const express = require('express');
const router = express.Router();
const odooJobsController = require('../controllers/odooJobsController');

const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

// Public route for submitting applications with optional resume upload
router.post('/apply', upload.single('resume'), odooJobsController.applyJob);

// Admin route for deleting resume files to save storage
router.delete('/resume/:id', auth, odooJobsController.deleteApplicantFile);

module.exports = router;
