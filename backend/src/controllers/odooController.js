// Odoo Integration Controller
// Handles Odoo sync endpoints

const OdooService = require('../services/odooService');
const { successResponse, errorResponse } = require('../utils/response');
const { query } = require('../config/database');

/**
 * Test Odoo connection
 */
exports.testConnection = async (req, res) => {
  try {
    const result = await OdooService.testConnection();
    if (result.success) {
      return successResponse(res, result, result.message);
    } else {
      return errorResponse(res, result.message, 500);
    }
  } catch (error) {
    console.error('Test connection error:', error);
    errorResponse(res, 'Failed to test Odoo connection', 500);
  }
};

/**
 * Sync inquiry to Odoo as Lead
 */
exports.syncInquiryToOdoo = async (req, res) => {
  try {
    const { inquiryId } = req.params;

    // Get inquiry from database
    const inquiryResult = await query(
      'SELECT * FROM inquiries WHERE id = $1',
      [inquiryId]
    );

    if (inquiryResult.rows.length === 0) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    const inquiry = inquiryResult.rows[0];

    // Create lead in Odoo
    const odooLeadId = await OdooService.createLeadFromInquiry(inquiry);

    successResponse(res, { odooLeadId, inquiryId }, 'Inquiry synced to Odoo successfully', 201);
  } catch (error) {
    console.error('Sync inquiry error:', error);
    errorResponse(res, 'Failed to sync inquiry to Odoo', 500);
  }
};

/**
 * Sync inquiry status to Odoo
 */
exports.syncInquiryStatus = async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, 'Status is required', 400);
    }

    await OdooService.updateLeadStatus(inquiryId, status);

    successResponse(res, { inquiryId, status }, 'Inquiry status synced to Odoo');
  } catch (error) {
    console.error('Sync status error:', error);
    errorResponse(res, 'Failed to sync status to Odoo', 500);
  }
};

/**
 * Sync all pending inquiries to Odoo
 */
exports.syncAllInquiries = async (req, res) => {
  try {
    const inquiriesResult = await query(
      'SELECT * FROM inquiries WHERE odoo_lead_id IS NULL AND created_at > NOW() - INTERVAL \'7 days\''
    );

    const inquiries = inquiriesResult.rows;
    const syncResults = [];
    const errors = [];

    for (const inquiry of inquiries) {
      try {
        const odooLeadId = await OdooService.createLeadFromInquiry(inquiry);
        syncResults.push({
          inquiryId: inquiry.id,
          odooLeadId,
          status: 'success'
        });
      } catch (error) {
        errors.push({
          inquiryId: inquiry.id,
          error: error.message
        });
      }
    }

    successResponse(res, {
      synced: syncResults.length,
      failed: errors.length,
      results: syncResults,
      errors: errors.length > 0 ? errors : undefined
    }, `Synced ${syncResults.length} inquiries to Odoo`);
  } catch (error) {
    console.error('Sync all inquiries error:', error);
    errorResponse(res, 'Failed to sync inquiries to Odoo', 500);
  }
};

/**
 * Sync project to Odoo
 */
exports.syncProjectToOdoo = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Get project from database
    const projectResult = await query(
      'SELECT * FROM projects WHERE id = $1',
      [projectId]
    );

    if (projectResult.rows.length === 0) {
      return errorResponse(res, 'Project not found', 404);
    }

    const project = projectResult.rows[0];

    // Create project in Odoo
    const odooProjectId = await OdooService.createProjectInOdoo(project);

    successResponse(res, { odooProjectId, projectId }, 'Project synced to Odoo successfully', 201);
  } catch (error) {
    console.error('Sync project error:', error);
    errorResponse(res, 'Failed to sync project to Odoo', 500);
  }
};

/**
 * Get Odoo leads and display them
 */
exports.getOdooLeads = async (req, res) => {
  try {
    const { name, stage, limit } = req.query;

    const filters = {};
    if (name) filters.name = name;
    if (stage) filters.stage = parseInt(stage);
    if (limit) filters.limit = parseInt(limit);

    const leads = await OdooService.getOdooLeads(filters);

    successResponse(res, leads, 'Odoo leads fetched successfully');
  } catch (error) {
    console.error('Get Odoo leads error:', error);
    errorResponse(res, 'Failed to fetch Odoo leads', 500);
  }
};

/**
 * Get Odoo sync status for all inquiries
 */
exports.getSyncStatus = async (req, res) => {
  try {
    const totalResult = await query('SELECT COUNT(*) FROM inquiries');
    const syncedResult = await query('SELECT COUNT(*) FROM inquiries WHERE odoo_lead_id IS NOT NULL');
    const pendingResult = await query('SELECT COUNT(*) FROM inquiries WHERE odoo_lead_id IS NULL');

    const status = {
      total: parseInt(totalResult.rows[0].count),
      synced: parseInt(syncedResult.rows[0].count),
      pending: parseInt(pendingResult.rows[0].count),
      syncPercentage: (parseInt(syncedResult.rows[0].count) / parseInt(totalResult.rows[0].count) * 100).toFixed(2)
    };

    successResponse(res, status, 'Sync status retrieved');
  } catch (error) {
    console.error('Get sync status error:', error);
    errorResponse(res, 'Failed to get sync status', 500);
  }
};

/**
 * Create customer in Odoo
 */
exports.createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, inquiryId } = req.body;

    if (!name || !email) {
      return errorResponse(res, 'Name and email are required', 400);
    }

    const customerId = await OdooService.createCustomerInOdoo({
      name,
      email,
      phone,
      company,
      inquiryId
    });

    successResponse(res, { customerId }, 'Customer created in Odoo successfully', 201);
  } catch (error) {
    console.error('Create customer error:', error);
    errorResponse(res, 'Failed to create customer in Odoo', 500);
  }
};
