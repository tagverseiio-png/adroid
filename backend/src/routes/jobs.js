const express = require('express');
const router = express.Router();
const odooJobsController = require('../controllers/odooJobsController');

// Public route for submitting applications directly to Odoo
router.post('/apply', odooJobsController.applyJob);

module.exports = router;
