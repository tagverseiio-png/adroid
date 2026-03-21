const { pool } = require('../../config/database');

// POST /api/shop/reviews (public)
const create = async (req, res) => {
    try {
        const { product_id, order_id, reviewer_name, reviewer_email, rating, title, body } = req.body;
        if (!product_id || !reviewer_name || !reviewer_email || !rating) {
            return res.status(400).json({ success: false, message: 'product_id, name, email, rating required' });
        }
        const result = await pool.query(
            `INSERT INTO shop_reviews (product_id, order_id, reviewer_name, reviewer_email, rating, title, body)
             VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
            [product_id, order_id || null, reviewer_name, reviewer_email, parseInt(rating), title || null, body || null]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Review submitted and awaiting approval' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit review' });
    }
};

// GET /api/shop/reviews/:productId (public — approved only)
const getByProduct = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM shop_reviews WHERE product_id = $1 AND approved = true ORDER BY created_at DESC`,
            [req.params.productId]
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

// GET /api/shop/reviews/admin/all (admin)
const getAll = async (req, res) => {
    try {
        const { approved } = req.query;
        const conditions = [];
        const params = [];
        if (approved !== undefined) { params.push(approved === 'true'); conditions.push(`r.approved = $${params.length}`); }
        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const result = await pool.query(
            `SELECT r.*, p.name AS product_name FROM shop_reviews r
             LEFT JOIN shop_products p ON p.id = r.product_id
             ${where} ORDER BY r.created_at DESC`, params
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
    }
};

// PATCH /api/shop/reviews/:id/approve (admin)
const approve = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE shop_reviews SET approved = NOT approved WHERE id = $1 RETURNING *`,
            [req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Review not found' });

        // Recalculate product average rating
        const review = result.rows[0];
        await pool.query(
            `UPDATE shop_products SET
                average_rating = (SELECT COALESCE(AVG(rating),0) FROM shop_reviews WHERE product_id = $1 AND approved = true),
                review_count = (SELECT COUNT(*) FROM shop_reviews WHERE product_id = $1 AND approved = true)
             WHERE id = $1`,
            [review.product_id]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update review' });
    }
};

// DELETE /api/shop/reviews/:id (admin)
const deleteReview = async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM shop_reviews WHERE id = $1 RETURNING *`, [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Review not found' });

        // Recalculate rating
        await pool.query(
            `UPDATE shop_products SET
                average_rating = (SELECT COALESCE(AVG(rating),0) FROM shop_reviews WHERE product_id = $1 AND approved = true),
                review_count = (SELECT COUNT(*) FROM shop_reviews WHERE product_id = $1 AND approved = true)
             WHERE id = $1`,
            [result.rows[0].product_id]
        );

        res.json({ success: true, message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete review' });
    }
};

module.exports = { create, getByProduct, getAll, approve, deleteReview };
