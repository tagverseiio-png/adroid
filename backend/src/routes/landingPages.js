const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { query } = require('../config/database');

// GET all landing pages (Admin)
router.get('/', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single landing page by Slug (Public)
router.get('/:slug', async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages WHERE slug = $1 AND status = $2', [req.params.slug, 'published']);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Landing page not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET single landing page by ID (Admin)
router.get('/admin/:id', auth, async (req, res) => {
    try {
        const result = await query('SELECT * FROM landing_pages WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// CREATE landing page (Admin)
router.post('/', auth, async (req, res) => {
    const { name, slug } = req.body;
    try {
        const defaultSections = {
            hero: { enabled: true, content: {} },
            about: { enabled: true, content: {} },
            services: { enabled: true, content: {} },
            portfolio: { enabled: true, content: { featured_projects: [] } },
            why_us: { enabled: true, content: { items: [] } },
            process: { enabled: true, content: { steps: [] } },
            testimonials: { enabled: true, content: { items: [] } },
            faq: { enabled: true, content: { items: [] } },
            contact: { enabled: true, content: {} }
        };
        const defaultOrder = ['hero', 'about', 'services', 'portfolio', 'why_us', 'process', 'testimonials', 'faq', 'contact'];

        const result = await query(
            `INSERT INTO landing_pages (name, slug, status, sections, sections_order, seo) 
             VALUES ($1, $2, 'draft', $3, $4, $5) RETURNING *`,
            [name, slug, defaultSections, defaultOrder, {}]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') return res.status(400).json({ success: false, message: 'Slug already exists' });
        res.status(500).json({ success: false, message: error.message });
    }
});

// UPDATE landing page (Admin)
router.put('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const { status, sections, sections_order, seo } = req.body;
    try {
        const current = await query('SELECT * FROM landing_pages WHERE id = $1', [id]);
        if (current.rows.length === 0) return res.status(404).json({ success: false, message: 'Not found' });
        
        const c = current.rows[0];
        const result = await query(
            `UPDATE landing_pages SET 
                status = COALESCE($1, status),
                sections = COALESCE($2, sections),
                sections_order = COALESCE($3, sections_order),
                seo = COALESCE($4, seo),
                updated_at = NOW()
             WHERE id = $5 RETURNING *`,
            [status ?? c.status, sections ?? c.sections, sections_order ?? c.sections_order, seo ?? c.seo, id]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE landing page (Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM landing_pages WHERE id = $1', [req.params.id]);
        res.json({ success: true, message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
