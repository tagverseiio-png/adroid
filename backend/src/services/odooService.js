// Odoo Integration Service
// Handles syncing data between Adroit Design and Odoo

const { getOdooClient } = require('../config/odoo');
const { query } = require('../config/database');

class OdooService {
  /**
   * Create a Lead DIRECTLY in Odoo (no local storage)
   * This is the primary inquiry flow - data goes straight to Odoo
   */
  static async createLeadDirectly(inquiryData) {
    try {
      const odoo = getOdooClient();
      
      const leadData = {
        name: inquiryData.subject || `Inquiry from ${inquiryData.name}`,
        email_from: inquiryData.email,
        phone: inquiryData.phone || false,
        description: inquiryData.message,
        partner_name: inquiryData.company || inquiryData.name,
        contact_name: inquiryData.name,
        type: 'lead',
        source_id: 1, // Update based on your lead source in Odoo
        tag_ids: inquiryData.type === 'project' ? [[6, 0, [2]]] : [[6, 0, [1]]], // Custom tags
      };

      const leadId = await odoo.create('crm.lead', leadData);
      console.log(`✅ Lead created directly in Odoo with ID: ${leadId}`);
      
      return leadId;
    } catch (error) {
      console.error('❌ Failed to create Odoo lead:', error.message);
      throw error;
    }
  }

  /**
   * Create a Lead in Odoo from an inquiry (legacy - with local storage)
   */
  static async createLeadFromInquiry(inquiry) {
    try {
      const odoo = getOdooClient();
      
      const leadData = {
        name: inquiry.subject || `Inquiry from ${inquiry.name}`,
        email_from: inquiry.email,
        phone: inquiry.phone || false,
        description: inquiry.message,
        partner_name: inquiry.company || inquiry.name,
        contact_name: inquiry.name,
        type: 'lead',
        source_id: 1, // Update based on your lead source in Odoo
        tag_ids: inquiry.type === 'project' ? [[6, 0, [2]]] : [[6, 0, [1]]], // Custom tags
      };

      const leadId = await odoo.create('crm.lead', leadData);
      console.log(`✅ Lead created in Odoo with ID: ${leadId}`);
      
      // Store Odoo ID in local database (if table exists)
      try {
        await query(
          'UPDATE inquiries SET odoo_lead_id = $1 WHERE id = $2',
          [leadId, inquiry.id]
        );
      } catch (dbError) {
        console.warn('⚠️  Could not update local DB (inquiries table may not exist)');
      }

      return leadId;
    } catch (error) {
      console.error('❌ Failed to create Odoo lead:', error.message);
      throw error;
    }
  }

  /**
   * Update Lead status in Odoo
   */
  static async updateLeadStatus(inquiryId, inquiryStatus) {
    try {
      // Get the inquiry with Odoo ID
      const result = await query(
        'SELECT odoo_lead_id FROM inquiries WHERE id = $1',
        [inquiryId]
      );

      if (!result.rows[0]?.odoo_lead_id) {
        console.warn(`No Odoo lead ID for inquiry ${inquiryId}`);
        return;
      }

      const odooLeadId = result.rows[0].odoo_lead_id;
      const odoo = getOdooClient();

      // Map inquiry status to Odoo stage
      const stageMap = {
        'New': 1,         // New
        'Read': 2,        // Qualified
        'Responded': 3,   // Proposal Sent
        'Archived': 4     // Won/Lost
      };

      const stageId = stageMap[inquiryStatus] || 1;

      await odoo.write('crm.lead', [odooLeadId], {
        stage_id: stageId,
      });

      console.log(`✅ Lead ${odooLeadId} status updated to ${inquiryStatus}`);
    } catch (error) {
      console.error('❌ Failed to update Odoo lead status:', error.message);
    }
  }

  /**
   * Create a Project in Odoo from a portfolio project
   */
  static async createProjectInOdoo(project) {
    try {
      const odoo = getOdooClient();

      const projectData = {
        name: project.title,
        description: project.description || '',
        partner_id: false, // Link to customer if available
        type: 'internal', // Can be 'internal' or 'external'
        state: 'open',
        sequence: 1,
        tag_ids: [[6, 0, []]],
      };

      const projectId = await odoo.create('project.project', projectData);
      console.log(`✅ Project created in Odoo with ID: ${projectId}`);

      // Store Odoo ID in local database
      await query(
        'UPDATE projects SET odoo_project_id = $1 WHERE id = $2',
        [projectId, project.id]
      );

      return projectId;
    } catch (error) {
      console.error('❌ Failed to create Odoo project:', error.message);
      // Don't throw - this is optional
    }
  }

  /**
   * Create a Contact/Customer in Odoo
   */
  static async createCustomerInOdoo(inquiryData) {
    try {
      const odoo = getOdooClient();

      const partnerData = {
        name: inquiryData.company || inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone || false,
        type: 'contact',
        is_company: !!inquiryData.company,
      };

      const partnerId = await odoo.create('res.partner', partnerData);
      console.log(`✅ Customer created in Odoo with ID: ${partnerId}`);

      // Store Odoo ID in local database
      if (inquiryData.inquiryId) {
        await query(
          'UPDATE inquiries SET odoo_customer_id = $1 WHERE id = $2',
          [partnerId, inquiryData.inquiryId]
        );
      }

      return partnerId;
    } catch (error) {
      console.error('❌ Failed to create Odoo customer:', error.message);
      // Don't throw - this is optional
    }
  }

  /**
   * Get Leads from Odoo
   */
  static async getOdooLeads(filters = {}) {
    try {
      const odoo = getOdooClient();
      
      const domain = [];
      if (filters.name) domain.push(['name', 'ilike', filters.name]);
      if (filters.stage) domain.push(['stage_id', '=', filters.stage]);

      const leadIds = await odoo.search('crm.lead', domain, {
        order: 'id desc',
        limit: filters.limit || 100,
      });

      if (leadIds.length === 0) return [];

      const leads = await odoo.read('crm.lead', leadIds, [
        'name', 'email_from', 'phone', 'description', 'partner_name', 'stage_id', 'create_date'
      ]);

      return leads;
    } catch (error) {
      console.error('❌ Failed to fetch Odoo leads:', error.message);
      return [];
    }
  }

  /**
   * Sync lead back to local database
   */
  static async syncLeadToLocal(odooLeadId) {
    try {
      const odoo = getOdooClient();

      const leadData = await odoo.read('crm.lead', [odooLeadId], [
        'name', 'email_from', 'phone', 'description', 'partner_name', 'stage_id'
      ]);

      if (!leadData || leadData.length === 0) return null;

      const lead = leadData[0];
      // Map Odoo data to local inquiry format
      return {
        name: lead.partner_name || lead.name,
        email: lead.email_from,
        phone: lead.phone,
        subject: lead.name,
        message: lead.description,
        odoo_lead_id: odooLeadId,
      };
    } catch (error) {
      console.error('❌ Failed to sync Odoo lead:', error.message);
      return null;
    }
  }

  /**
   * Test Odoo connection
   */
  static async testConnection() {
    try {
      const odoo = getOdooClient();
      await odoo.authenticate();
      return { success: true, message: 'Connected to Odoo' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

module.exports = OdooService;
