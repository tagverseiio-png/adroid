const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../config/database');

// POST a new lead (Public)
router.post('/', async (req, res) => {
    const { landing_page_slug, name, company, email, phone, message, source } = req.body;
    try {
        const result = await query(
            `INSERT INTO landing_page_leads 
            (landing_page_slug, name, company, email, phone, message, source, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'new') RETURNING *`,
            [landing_page_slug, name, company, email, phone, message, source]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET all leads (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_page_leads ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE lead status (Admin)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await query(
            'UPDATE landing_page_leads SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, req.params.id]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
