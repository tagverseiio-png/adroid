const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const honeypot = require('../middleware/honeypot');
const captcha = require('../middleware/captcha');
const { validateLpLead } = require('../middleware/validator');
const { query } = require('../config/database');

// POST a new lead (Public)
// Security stack: honeypot trap → CAPTCHA verify → server-side validation → insert
router.post('/', honeypot, captcha, validateLpLead, async (req, res) => {
    const {
        landing_page_slug, name, company, email,
        phone, message, brief, location, area, source, category
    } = req.body;

    try {
        // Compose message/brief from whichever field was sent by the form
        const leadMessage = message || brief || null;

        const result = await query(
            `INSERT INTO landing_page_leads 
            (landing_page_slug, name, company, email, phone, message, source, status, spam_suspect)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'new', FALSE) RETURNING *`,
            [landing_page_slug || null, name, company || null, email, phone || null, leadMessage, source || 'Landing Page']
        );

        console.log(`[lp-leads] ✅ New lead saved: ${email} from ${source || 'Landing Page'}`);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        console.error('[lp-leads] DB error:', error.message);
        res.status(500).json({ success: false, message: 'Failed to save lead. Please try again.' });
    }
});

// GET all leads (Admin) — supports ?status=suspect for spam review
router.get('/', auth, async (req, res) => {
    try {
        const { status, page = 1, limit = 50 } = req.query;
        let queryText = 'SELECT * FROM landing_page_leads WHERE 1=1';
        const params = [];
        let paramIndex = 1;

        if (status) {
            queryText += ` AND status = $${paramIndex}`;
            params.push(status);
            paramIndex++;
        }

        queryText += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

        const result = await query(queryText, params);
        res.json({ success: true, data: result.rows, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE lead status (Admin) — use status='suspect' to quarantine
router.put('/:id', auth, async (req, res) => {
    const { status, spam_suspect } = req.body;
    const allowedStatuses = ['new', 'suspect', 'contacted', 'qualified', 'converted', 'closed'];

    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` });
    }

    try {
        const updateFields = [];
        const params = [];
        let paramIndex = 1;

        if (status !== undefined) {
            updateFields.push(`status = $${paramIndex}`);
            params.push(status);
            paramIndex++;
        }

        if (spam_suspect !== undefined) {
            updateFields.push(`spam_suspect = $${paramIndex}`);
            params.push(Boolean(spam_suspect));
            paramIndex++;
        }

        updateFields.push(`updated_at = NOW()`);
        params.push(req.params.id);

        const result = await query(
            `UPDATE landing_page_leads SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            params
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
