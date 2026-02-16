const express = require('express');
const router = express.Router();
const odooController = require('../controllers/odooController');
const auth = require('../middleware/auth');

/**
 * Odoo Integration Routes
 * All routes require admin authentication
 */

// Test Odoo connection
router.get('/test', auth, odooController.testConnection);

// Get sync status dashboard
router.get('/status', auth, odooController.getSyncStatus);

// Get Odoo leads
router.get('/leads', auth, odooController.getOdooLeads);

// Sync specific inquiry to Odoo
router.post('/inquiry/:inquiryId/sync', auth, odooController.syncInquiryToOdoo);

// Sync inquiry status to Odoo
router.patch('/inquiry/:inquiryId/status', auth, odooController.syncInquiryStatus);

// Sync all pending inquiries
router.post('/sync-all', auth, odooController.syncAllInquiries);

// Sync project to Odoo
router.post('/project/:projectId/sync', auth, odooController.syncProjectToOdoo);

// Create customer in Odoo
router.post('/customer', auth, odooController.createCustomer);

module.exports = router;
