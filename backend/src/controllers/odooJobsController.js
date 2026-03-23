const { getOdooClient } = require('../config/odoo');
const { successResponse, errorResponse } = require('../utils/response');
const { query } = require('../config/database');
const fs = require('fs');
const path = require('path');

const odooJobsController = {
  // Submit generic job application directly to Odoo
  applyJob: async (req, res) => {
    try {
      const { name, email, phone, roles, type, message, portfolio_link } = req.body;
      const file = req.file;

      if (!name || !email) {
        return errorResponse(res, 'Missing required fields: name, email', 400);
      }

      // Local File Path (if uploaded)
      const filePath = file ? `uploads/resumes/${file.filename}` : portfolio_link;

      // 1. SAVE TO LOCAL DATABASE (Admin visibility)
      // Since user said "don't migrate", we use existing columns:
      // Store 'roles' and 'type' in the 'message' field or 'subject'
      const localSubject = `Job Application: ${roles || 'General'}`;
      const localMessage = `Type: ${type || 'Career'}\nRole: ${roles || 'N/A'}\nMessage: ${message || ''}`;
      
      await query(
        `INSERT INTO inquiries (name, email, phone, subject, message, portfolio_link, type, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [name, email, phone || '', localSubject, localMessage, filePath, 'career', 'New']
      );

      // 2. SYNC TO ODOO
      const odoo = getOdooClient();
      
      // Create/Find Candidate
      let candidateId;
      try {
        const existingIds = await odoo.search('hr.candidate', [['email_from', '=', email]]);
        if (existingIds.length > 0) {
          candidateId = existingIds[0];
        } else {
          candidateId = await odoo.create('hr.candidate', {
            partner_name: name,
            email_from: email,
            partner_phone: phone || '',
          });
        }
      } catch (e) { console.error('Odoo Candidate error:', e.message); }

      const resumeUrl = file ? `${process.env.VITE_API_URL || ''}/${filePath}` : portfolio_link;

      const applicantData = {
        partner_name: name,
        email_from: email,
        partner_phone: phone || '',
        applicant_notes: `<p><strong>Type:</strong> ${type || 'N/A'}</p><p><strong>Role:</strong> ${roles || 'N/A'}</p><p><strong>Resume/Portfolio:</strong> <a href="${resumeUrl}">${resumeUrl}</a></p><p><strong>Notes:</strong><br/>${(message || '').replace(/\n/g, '<br/>')}</p>`,
      };

      if (candidateId) applicantData.candidate_id = candidateId;
      const applicantId = await odoo.create('hr.applicant', applicantData);

      return successResponse(res, { id: applicantId }, 'Application submitted successfully', 201);
    } catch (error) {
      console.error('Error in applyJob:', error);
      return errorResponse(res, 'Failed to process application', 500);
    }
  },

  // Delete resume file from storage (Prevent "Full Storage")
  deleteApplicantFile: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get file path from DB
      const result = await query('SELECT portfolio_link FROM inquiries WHERE id = $1 AND type = $2', [id, 'career']);
      
      if (result.rows.length === 0) {
        return errorResponse(res, 'Application not found', 404);
      }

      const filePath = result.rows[0].portfolio_link;

      if (filePath && filePath.startsWith('uploads/')) {
        const fullPath = path.join(__dirname, '../../', filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
        
        // Update DB to reflect deletion but keep the record
        await query('UPDATE inquiries SET portfolio_link = $1 WHERE id = $2', ['[File Deleted to Save Space]', id]);
      }

      return successResponse(res, null, 'File deleted successfully');
    } catch (error) {
      console.error('Error deleting resume file:', error);
      return errorResponse(res, 'Failed to delete file', 500);
    }
  }
};

module.exports = odooJobsController;
