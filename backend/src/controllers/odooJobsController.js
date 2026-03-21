const { getOdooClient } = require('../config/odoo');
const { successResponse, errorResponse } = require('../utils/response');

const odooJobsController = {
  // Submit generic job application directly to Odoo
  applyJob: async (req, res) => {
    try {
      const { name, email, phone, roles, type, message, portfolio_link } = req.body;

      if (!name || !email) {
        return errorResponse(res, 'Missing required fields: name, email', 400);
      }

      const odoo = getOdooClient();

      // Step 1: Create or find a Candidate record (required in Odoo 16+)
      let candidateId;
      try {
        // Try to find existing candidate by email
        const existingIds = await odoo.search('hr.candidate', [['email_from', '=', email]]);
        if (existingIds.length > 0) {
          candidateId = existingIds[0];
        } else {
          // Create a new candidate
          candidateId = await odoo.create('hr.candidate', {
            partner_name: name,
            email_from: email,
            partner_phone: phone || '',
          });
        }
      } catch (candidateErr) {
        console.error('Could not create/find hr.candidate:', candidateErr.message);
        // Fall through — try without candidate_id (older Odoo versions)
      }

      // Step 2: Create the applicant record
      const applicantData = {
        partner_name: name,
        email_from: email,
        partner_phone: phone || '',
        applicant_notes: `<p><strong>Application Type:</strong> ${type || 'N/A'}</p><p><strong>Role Applied:</strong> ${roles || 'N/A'}</p><p><strong>Portfolio:</strong> ${portfolio_link || 'N/A'}</p><p><strong>Cover Letter:</strong><br/>${(message || 'No message provided.').replace(/\n/g, '<br/>')}</p>`,
      };

      if (candidateId) {
        applicantData.candidate_id = candidateId;
      }

      const applicantId = await odoo.create('hr.applicant', applicantData);

      return successResponse(res, { id: applicantId }, 'Application submitted successfully to Odoo', 201);
    } catch (error) {
      console.error('Error submitting application to Odoo:', error);
      return errorResponse(res, 'Failed to submit application to Odoo', 500);
    }
  }
};

module.exports = odooJobsController;
