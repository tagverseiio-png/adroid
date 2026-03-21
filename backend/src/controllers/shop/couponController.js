const { pool } = require('../../config/database');

// POST /api/shop/coupons/validate (public)
const validate = async (req, res) => {
    try {
        const { code, cart_total } = req.body;
        if (!code || !cart_total) return res.status(400).json({ success: false, message: 'code and cart_total required' });

        const result = await pool.query(
            `SELECT * FROM shop_coupons
             WHERE UPPER(code) = UPPER($1) AND active = true
             AND (expiry_date IS NULL OR expiry_date > NOW())
             AND (max_uses = 0 OR used_count < max_uses)
             AND min_order_value <= $2`,
            [code, parseFloat(cart_total)]
        );

        if (!result.rows.length) {
            return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        const coupon = result.rows[0];
        let discount = 0;
        if (coupon.type === 'percent') {
            discount = Math.round((parseFloat(cart_total) * coupon.value / 100) * 100) / 100;
            if (coupon.max_discount) discount = Math.min(discount, parseFloat(coupon.max_discount));
        } else {
            discount = Math.min(parseFloat(coupon.value), parseFloat(cart_total));
        }

        res.json({
            success: true,
            data: {
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                discount,
                description: coupon.description,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to validate coupon' });
    }
};

// GET /api/shop/coupons (admin)
const getAll = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM shop_coupons ORDER BY created_at DESC`);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
    }
};

// POST /api/shop/coupons (admin)
const create = async (req, res) => {
    try {
        const { code, type, value, min_order_value = 0, max_discount, max_uses = 0, active = true, expiry_date, description } = req.body;
        if (!code || !type || !value) return res.status(400).json({ success: false, message: 'code, type and value are required' });

        const result = await pool.query(
            `INSERT INTO shop_coupons (code, type, value, min_order_value, max_discount, max_uses, active, expiry_date, description)
             VALUES (UPPER($1),$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [code, type, value, min_order_value, max_discount || null, max_uses, active, expiry_date || null, description || null]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ success: false, message: 'Coupon code already exists' });
        res.status(500).json({ success: false, message: 'Failed to create coupon' });
    }
};

// PUT /api/shop/coupons/:id (admin)
const update = async (req, res) => {
    try {
        const { type, value, min_order_value, max_discount, max_uses, active, expiry_date, description } = req.body;
        const result = await pool.query(
            `UPDATE shop_coupons SET
                type = COALESCE($1, type),
                value = COALESCE($2, value),
                min_order_value = COALESCE($3, min_order_value),
                max_discount = $4,
                max_uses = COALESCE($5, max_uses),
                active = COALESCE($6, active),
                expiry_date = $7,
                description = COALESCE($8, description),
                updated_at = NOW()
             WHERE id = $9 RETURNING *`,
            [type, value, min_order_value, max_discount || null, max_uses, active, expiry_date || null, description, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update coupon' });
    }
};

// DELETE /api/shop/coupons/:id (admin)
const deleteCoupon = async (req, res) => {
    try {
        const result = await pool.query(`DELETE FROM shop_coupons WHERE id = $1 RETURNING id`, [req.params.id]);
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to delete coupon' });
    }
};

module.exports = { validate, getAll, create, update, deleteCoupon };
