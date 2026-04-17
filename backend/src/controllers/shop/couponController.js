const { pool } = require('../../config/database');

// ── POST /api/shop/coupons/validate (public, rate-limited in route) ───────────
// NOTE: This only VALIDATES — it does NOT increment used_count.
// Incrementing happens atomically inside orderController.createOrder within a transaction.
const validate = async (req, res) => {
    try {
        const { code, cart_total } = req.body;

        if (!code || typeof code !== 'string' || code.length > 50) {
            return res.status(400).json({ success: false, message: 'Invalid coupon code format' });
        }
        if (!cart_total || isNaN(parseFloat(cart_total)) || parseFloat(cart_total) < 0) {
            return res.status(400).json({ success: false, message: 'Invalid cart_total' });
        }

        const cartValue = parseFloat(cart_total);

        const result = await pool.query(
            `SELECT id, code, type, value, max_discount, description
             FROM shop_coupons
             WHERE UPPER(code) = UPPER($1)
               AND active = true
               AND (expiry_date IS NULL OR expiry_date > NOW())
               AND (max_uses = 0 OR used_count < max_uses)
               AND min_order_value <= $2`,
            [code.trim(), cartValue]
        );

        if (!result.rows.length) {
            // Same message for not found / invalid — prevents information leak
            return res.status(400).json({ success: false, message: 'Invalid or expired coupon code' });
        }

        const coupon = result.rows[0];
        let discount = 0;

        if (coupon.type === 'percent') {
            discount = Math.round((cartValue * parseFloat(coupon.value) / 100) * 100) / 100;
            if (coupon.max_discount) discount = Math.min(discount, parseFloat(coupon.max_discount));
        } else {
            discount = Math.min(parseFloat(coupon.value), cartValue);
        }

        // Return minimal info — do NOT return id or internal fields
        res.json({
            success: true,
            data: {
                code:        coupon.code,
                type:        coupon.type,
                discount,
                description: coupon.description,
            }
        });
    } catch (err) {
        console.error('coupon validate error:', err);
        res.status(500).json({ success: false, message: 'Failed to validate coupon' });
    }
};

// ── GET /api/shop/coupons (admin) ─────────────────────────────────────────────
const getAll = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM shop_coupons ORDER BY created_at DESC`);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
    }
};

// ── POST /api/shop/coupons (admin) ────────────────────────────────────────────
const create = async (req, res) => {
    try {
        const { code, type, value, min_order_value = 0, max_discount, max_uses = 0, active = true, expiry_date, description } = req.body;

        if (!code || typeof code !== 'string' || code.trim().length < 2 || code.length > 50) {
            return res.status(400).json({ success: false, message: 'Coupon code must be 2–50 characters' });
        }
        if (!['percent', 'flat'].includes(type)) {
            return res.status(400).json({ success: false, message: 'type must be "percent" or "flat"' });
        }
        if (!value || parseFloat(value) <= 0) {
            return res.status(400).json({ success: false, message: 'value must be a positive number' });
        }
        if (type === 'percent' && parseFloat(value) > 100) {
            return res.status(400).json({ success: false, message: 'Percent discount cannot exceed 100%' });
        }

        const result = await pool.query(
            `INSERT INTO shop_coupons (code, type, value, min_order_value, max_discount, max_uses, active, expiry_date, description)
             VALUES (UPPER($1),$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [code.trim(), type, parseFloat(value), parseFloat(min_order_value), max_discount ? parseFloat(max_discount) : null,
             parseInt(max_uses), active, expiry_date || null, description?.substring(0, 255) || null]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ success: false, message: 'Coupon code already exists' });
        res.status(500).json({ success: false, message: 'Failed to create coupon' });
    }
};

// ── PUT /api/shop/coupons/:id (admin) ─────────────────────────────────────────
const update = async (req, res) => {
    try {
        const { type, value, min_order_value, max_discount, max_uses, active, expiry_date, description } = req.body;
        const result = await pool.query(
            `UPDATE shop_coupons SET
                type             = COALESCE($1, type),
                value            = COALESCE($2, value),
                min_order_value  = COALESCE($3, min_order_value),
                max_discount     = $4,
                max_uses         = COALESCE($5, max_uses),
                active           = COALESCE($6, active),
                expiry_date      = $7,
                description      = COALESCE($8, description),
                updated_at       = NOW()
             WHERE id = $9 RETURNING *`,
            [type, value ? parseFloat(value) : null, min_order_value ? parseFloat(min_order_value) : null,
             max_discount ? parseFloat(max_discount) : null, max_uses !== undefined ? parseInt(max_uses) : null,
             active !== undefined ? active : null, expiry_date || null, description?.substring(0, 255), req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update coupon' });
    }
};

// ── DELETE /api/shop/coupons/:id (admin) ─────────────────────────────────────
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
