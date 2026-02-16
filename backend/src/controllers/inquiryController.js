const OdooService = require('../services/odooService');
const { successResponse, errorResponse } = require('../utils/response');
const emailService = require('../services/emailService');
const { getOdooClient } = require('../config/odoo');
const { query } = require('../config/database');

/**
 * Get all inquiries from local database (admin only)
 */
exports.getAllInquiries = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;

    let queryText = 'SELECT * FROM inquiries WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      queryText += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (status) {
      queryText += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    queryText += ' ORDER BY created_at DESC';
    queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, (page - 1) * limit);

    const result = await query(queryText, params);
    const inquiries = result.rows;
    const source = 'Local Database';

    console.log(`✅ Fetched ${inquiries.length} inquiries from local database`);

    // Format response with pagination
    successResponse(res, {
      inquiries: inquiries,
      page: parseInt(page),
      limit: parseInt(limit),
      total: inquiries.length,
      source: source
    });
  } catch (error) {
    console.error('Get inquiries error:', error);
    errorResponse(res, error.message || 'Failed to fetch inquiries', 500);
  }
};

/**
 * Create inquiry directly in Odoo (public endpoint)
 * No local database storage - goes straight to Odoo
 */
exports.createInquiry = async (req, res) => {
  try {
    const {
      name, email, phone, subject, message,
      type, company, portfolio_link
    } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return errorResponse(res, 'Name, email, and message are required', 400);
    }

    let inquiryId = null;
    let storedIn = 'Odoo CRM';

    try {
      // Try to create lead in Odoo directly
      inquiryId = await OdooService.createLeadDirectly({
        name,
        email,
        phone,
        subject,
        message,
        type,
        company,
        portfolio_link
      });
    } catch (odooError) {
      // Fallback: Save to local database if Odoo fails
      console.warn('⚠️ Odoo unavailable, saving inquiry to local database:', odooError.message);
      storedIn = 'Local Database';
      
      try {
        const result = await query(
          `INSERT INTO inquiries (name, email, phone, subject, message, type, company, status) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, 'new')
           RETURNING id`,
          [name, email, phone || null, subject || null, message, type || 'general', company || null]
        );
        inquiryId = result.rows[0].id;
        console.log(`✅ Inquiry saved locally with ID: ${inquiryId}`);
      } catch (dbError) {
        console.error('❌ Failed to save inquiry locally:', dbError);
        throw new Error('Could not save inquiry. Please try again.');
      }
    }

    // Send confirmation emails (async - non-blocking, won't cause errors if email fails)
    // These run in background and don't affect the response
    Promise.all([
      emailService.sendInquiryNotification?.({
        id: inquiryId,
        name,
        email,
        subject,
        message
      }).catch(err => {
        console.error('Email notification error:', err);
      }),
      emailService.sendAutoReply?.({
        name,
        email,
        subject,
        message
      }).catch(err => {
        console.error('Auto-reply error:', err);
      })
    ]).catch(() => {
      // Silently ignore email errors - they shouldn't fail the inquiry submission
    });

    successResponse(res, {
      id: inquiryId,
      name,
      email,
      message: 'Inquiry submitted successfully',
      storedIn
    }, 'Inquiry submitted successfully', 201);
  } catch (error) {
    console.error('Create inquiry error:', error);
    errorResponse(res, error.message || 'Failed to submit inquiry', 500);
  }
};

/**
 * Update inquiry status in Odoo or local database (admin only)
 */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Qualified', 'Proposal Sent', 'Won', 'Lost'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    // Try Odoo first, fall back to local database
    try {
      const odoo = getOdooClient();
      const stageMap = {
        'New': 1,
        'Qualified': 2,
        'Proposal Sent': 3,
        'Won': 4,
        'Lost': 5
      };

      await odoo.write('crm.lead', [parseInt(id)], {
        stage_id: stageMap[status]
      });

      return successResponse(res, { odooLeadId: id, status }, 'Inquiry status updated in Odoo');
    } catch (odooError) {
      console.warn('⚠️ Odoo unavailable, updating local database:', odooError.message);
      
      // Update in local database
      const result = await query(
        'UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
      );
      
      if (result.rows.length === 0) {
        return errorResponse(res, 'Inquiry not found', 404);
      }
      
      console.log(`✅ Updated inquiry ${id} status in local database`);
      return successResponse(res, { id, status }, 'Inquiry status updated in local database');
    }
  } catch (error) {
    console.error('Update status error:', error);
    errorResponse(res, 'Failed to update inquiry status', 500);
  }
};

/**
 * Delete inquiry from Odoo or local database (admin only)
 */
exports.deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Try Odoo first, fall back to local database
    try {
      const odoo = getOdooClient();
      await odoo.delete('crm.lead', [parseInt(id)]);
      return successResponse(res, null, 'Inquiry deleted from Odoo');
    } catch (odooError) {
      console.warn('⚠️ Odoo unavailable, deleting from local database:', odooError.message);
      
      // Delete from local database
      const result = await query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return errorResponse(res, 'Inquiry not found', 404);
      }
      
      console.log(`✅ Deleted inquiry ${id} from local database`);
      return successResponse(res, null, 'Inquiry deleted from local database');
    }
  } catch (error) {
    console.error('Delete inquiry error:', error);
    errorResponse(res, 'Failed to delete inquiry', 500);
  }
};

/**
 * Get single inquiry from local database
 */
exports.getInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query('SELECT * FROM inquiries WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return errorResponse(res, 'Inquiry not found', 404);
    }

    const inquiry = {
      ...result.rows[0],
      source: 'Local Database'
    };

    console.log(`✅ Fetched inquiry ${id} from local database`);
    return successResponse(res, inquiry);
  } catch (error) {
    console.error('Get inquiry error:', error);
    errorResponse(res, 'Failed to fetch inquiry', 500);
  }
};
