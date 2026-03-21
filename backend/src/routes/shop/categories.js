const express = require('express');
const router = express.Router();
const { pool } = require('../../config/database');
const auth = require('../../middleware/auth');

// GET /api/shop/categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM shop_categories WHERE active = true ORDER BY display_order ASC, name ASC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch categories' });
    }
});

// POST (admin)
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, image, display_order = 0 } = req.body;
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const result = await pool.query(
            `INSERT INTO shop_categories (name, slug, description, image, display_order)
             VALUES ($1,$2,$3,$4,$5) RETURNING *`,
            [name, slug, description, image, display_order]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create category' });
    }
});

// PUT (admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const { name, description, image, display_order, active } = req.body;
        const result = await pool.query(
            `UPDATE shop_categories SET
                name = COALESCE($1, name),
                description = COALESCE($2, description),
                image = COALESCE($3, image),
                display_order = COALESCE($4, display_order),
                active = COALESCE($5, active),
                updated_at = NOW()
             WHERE id = $6 RETURNING *`,
            [name, description, image, display_order, active, req.params.id]
        );
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update category' });
    }
});

// DELETE (admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query(`UPDATE shop_categories SET active = false WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Category deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete category' });
    }
});

module.exports = router;
