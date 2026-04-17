const { pool } = require('../../config/database');

// ── GET /api/shop/pickup-locations ───────────────────────────────────────────
const getAll = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM shop_pickup_locations WHERE active = true ORDER BY is_default DESC, name ASC`
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('pickupLocations getAll error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch pickup locations' });
    }
};

// ── POST /api/shop/pickup-locations ─────────────────────────────────────────
const create = async (req, res) => {
    const { name, contact_person, phone, address_line1, address_line2, city, state, pincode, country, shiprocket_pickup_name, is_default } = req.body;

    if (!name || !address_line1 || !city || !state || !pincode) {
        return res.status(400).json({ success: false, message: 'name, address_line1, city, state and pincode are required' });
    }

    try {
        if (is_default) {
            // Unset any existing default
            await pool.query(`UPDATE shop_pickup_locations SET is_default = false`);
        }

        const result = await pool.query(
            `INSERT INTO shop_pickup_locations
             (name, contact_person, phone, address_line1, address_line2, city, state, pincode, country, shiprocket_pickup_name, is_default)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             RETURNING *`,
            [name, contact_person || null, phone || null, address_line1, address_line2 || null, city, state, pincode, country || 'India', shiprocket_pickup_name || 'Primary', !!is_default]
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('pickupLocations create error:', err);
        if (err.code === '23505') return res.status(400).json({ success: false, message: 'A location with this name already exists' });
        res.status(500).json({ success: false, message: 'Failed to create pickup location' });
    }
};

// ── PUT /api/shop/pickup-locations/:id ──────────────────────────────────────
const update = async (req, res) => {
    const { name, contact_person, phone, address_line1, address_line2, city, state, pincode, country, shiprocket_pickup_name, is_default, active } = req.body;
    try {
        if (is_default) {
            await pool.query(`UPDATE shop_pickup_locations SET is_default = false`);
        }

        const result = await pool.query(
            `UPDATE shop_pickup_locations SET
                name = COALESCE($1, name),
                contact_person = COALESCE($2, contact_person),
                phone = COALESCE($3, phone),
                address_line1 = COALESCE($4, address_line1),
                address_line2 = COALESCE($5, address_line2),
                city = COALESCE($6, city),
                state = COALESCE($7, state),
                pincode = COALESCE($8, pincode),
                country = COALESCE($9, country),
                shiprocket_pickup_name = COALESCE($10, shiprocket_pickup_name),
                is_default = COALESCE($11, is_default),
                active = COALESCE($12, active),
                updated_at = NOW()
             WHERE id = $13 RETURNING *`,
            [name, contact_person, phone, address_line1, address_line2, city, state, pincode, country, shiprocket_pickup_name, is_default, active, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Pickup location not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('pickupLocations update error:', err);
        res.status(500).json({ success: false, message: 'Failed to update pickup location' });
    }
};

// ── DELETE /api/shop/pickup-locations/:id ────────────────────────────────────
const remove = async (req, res) => {
    try {
        await pool.query(`UPDATE shop_pickup_locations SET active = false WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Pickup location deactivated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to deactivate pickup location' });
    }
};

module.exports = { getAll, create, update, remove };
