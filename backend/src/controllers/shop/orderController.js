const { pool } = require('../../config/database');
const { createShipment } = require('./shiprocketController');

// ── Helpers ─────────────────────────────────────────────────────────────────

const generateOrderNumber = () => {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `AD-${ts}-${rand}`;
};

// ── Customer: Create Order ───────────────────────────────────────────────────

// POST /api/shop/orders
const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const {
            customer_name, customer_email, customer_phone,
            shipping_address, items: cartItems, coupon_code, notes
        } = req.body;

        if (!customer_name || !customer_email || !customer_phone || !shipping_address || !cartItems?.length) {
            return res.status(400).json({ success: false, message: 'Missing required order fields' });
        }

        // Validate & fetch products + check stock
        const productIds = cartItems.map(i => i.product_id);
        const prodRes = await client.query(
            `SELECT id, name, sku, price, sale_price, stock_qty, published
             FROM shop_products WHERE id = ANY($1) AND published = true`,
            [productIds]
        );
        const productMap = Object.fromEntries(prodRes.rows.map(p => [p.id, p]));

        let subtotal = 0;
        const itemsSnapshot = [];

        for (const ci of cartItems) {
            const prod = productMap[ci.product_id];
            if (!prod) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: `Product ${ci.product_id} not available` });
            }
            if (prod.stock_qty < ci.qty) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: `Insufficient stock for "${prod.name}"` });
            }
            const unitPrice = parseFloat(prod.sale_price || prod.price);
            const lineTotal = unitPrice * ci.qty;
            subtotal += lineTotal;
            itemsSnapshot.push({ product_id: prod.id, name: prod.name, sku: prod.sku, qty: ci.qty, unit_price: unitPrice, total_price: lineTotal });
        }

        // Apply coupon
        let discountAmount = 0;
        let couponApplied = null;
        if (coupon_code) {
            const couponRes = await client.query(
                `SELECT * FROM shop_coupons WHERE UPPER(code) = UPPER($1) AND active = true
                 AND (expiry_date IS NULL OR expiry_date > NOW())
                 AND (max_uses = 0 OR used_count < max_uses)
                 AND min_order_value <= $2`,
                [coupon_code, subtotal]
            );
            if (couponRes.rows.length) {
                const coupon = couponRes.rows[0];
                if (coupon.type === 'percent') {
                    discountAmount = Math.round((subtotal * coupon.value / 100) * 100) / 100;
                    if (coupon.max_discount) discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
                } else {
                    discountAmount = Math.min(parseFloat(coupon.value), subtotal);
                }
                couponApplied = coupon.code;
                // Increment coupon usage
                await client.query(`UPDATE shop_coupons SET used_count = used_count + 1 WHERE id = $1`, [coupon.id]);
            }
        }

        const shippingCharge = subtotal - discountAmount >= 999 ? 0 : 99; // Free shipping above ₹999
        const total = Math.max(0, subtotal - discountAmount + shippingCharge);
        const orderNumber = generateOrderNumber();

        // Deduct stock atomically
        for (const ci of cartItems) {
            const result = await client.query(
                `UPDATE shop_products SET stock_qty = stock_qty - $1, updated_at = NOW()
                 WHERE id = $2 AND stock_qty >= $1 RETURNING id`,
                [ci.qty, ci.product_id]
            );
            if (!result.rows.length) {
                await client.query('ROLLBACK');
                return res.status(409).json({ success: false, message: `Stock just ran out for product ${ci.product_id}` });
            }
        }

        // Insert order
        const orderRes = await client.query(
            `INSERT INTO shop_orders
             (order_number, customer_name, customer_email, customer_phone,
              shipping_address, items, subtotal, discount_amount, coupon_code,
              shipping_charge, total, notes, payment_status, order_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending','placed')
             RETURNING *`,
            [
                orderNumber, customer_name, customer_email, customer_phone,
                JSON.stringify(shipping_address), JSON.stringify(itemsSnapshot),
                subtotal, discountAmount, couponApplied,
                shippingCharge, total, notes || null
            ]
        );

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            data: orderRes.rows[0],
            message: 'Order created successfully'
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('createOrder error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create order' });
    } finally {
        client.release();
    }
};

// ── Admin: List Orders ───────────────────────────────────────────────────────

// GET /api/shop/orders
const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 30, status, payment_status, search, date_from, date_to } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const conditions = [];
        const params = [];
        let pi = 1;

        if (status) { params.push(status); conditions.push(`order_status = $${pi++}`); }
        if (payment_status) { params.push(payment_status); conditions.push(`payment_status = $${pi++}`); }
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(order_number ILIKE $${pi++} OR customer_email ILIKE $${pi - 1} OR customer_name ILIKE $${pi - 1})`);
        }
        if (date_from) { params.push(date_from); conditions.push(`created_at >= $${pi++}`); }
        if (date_to) { params.push(date_to); conditions.push(`created_at <= $${pi++}`); }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        params.push(parseInt(limit)); params.push(offset);

        const [rows, countRes] = await Promise.all([
            pool.query(`SELECT * FROM shop_orders ${where} ORDER BY created_at DESC LIMIT $${pi++} OFFSET $${pi}`, params),
            pool.query(`SELECT COUNT(*), COALESCE(SUM(CASE WHEN payment_status='paid' THEN total ELSE 0 END), 0) AS revenue FROM shop_orders ${where}`, params.slice(0, -2)),
        ]);

        res.json({
            success: true,
            data: rows.rows,
            total: parseInt(countRes.rows[0].count),
            revenue: parseFloat(countRes.rows[0].revenue),
        });
    } catch (err) {
        console.error('getAll orders error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

// GET /api/shop/orders/stats (admin dashboard)
const getStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) AS total_revenue,
                COUNT(CASE WHEN order_status = 'placed' THEN 1 END) AS pending_orders,
                COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) AS today_orders
            FROM shop_orders
        `);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

// GET /api/shop/orders/:orderNumber
const getByOrderNumber = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM shop_orders WHERE order_number = $1`, [req.params.orderNumber]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch order' });
    }
};

// PATCH /api/shop/orders/:id/status
const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await pool.query(
            `UPDATE shop_orders SET order_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, req.params.id]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

// PATCH /api/shop/orders/:id/cancel
const cancelOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderRes = await client.query(`SELECT * FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        const order = orderRes.rows[0];

        if (['delivered', 'cancelled'].includes(order.order_status)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: `Cannot cancel an order with status "${order.order_status}"` });
        }

        // Restore stock
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
        for (const item of items) {
            await client.query(
                `UPDATE shop_products SET stock_qty = stock_qty + $1 WHERE id = $2`,
                [item.qty, item.product_id]
            );
        }

        await client.query(
            `UPDATE shop_orders SET order_status = 'cancelled', payment_status = CASE WHEN payment_status = 'paid' THEN 'refunded' ELSE payment_status END, updated_at = NOW() WHERE id = $1`,
            [req.params.id]
        );

        await client.query('COMMIT');
        res.json({ success: true, message: 'Order cancelled and stock restored' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('cancelOrder error:', err);
        res.status(500).json({ success: false, message: 'Failed to cancel order' });
    } finally {
        client.release();
    }
};

// POST /api/shop/orders/:id/create-shipment (admin triggers Shiprocket)
const triggerShipment = async (req, res) => {
    try {
        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orderRes.rows[0];
        const result = await createShipment(order);

        await pool.query(
            `UPDATE shop_orders SET shiprocket_order_id = $1, shipment_id = $2, awb_code = $3,
             courier_name = $4, order_status = 'confirmed', updated_at = NOW()
             WHERE id = $5`,
            [result.shiprocket_order_id, result.shipment_id, result.awb_code, result.courier_name, order.id]
        );

        res.json({ success: true, message: 'Shipment created', data: result });
    } catch (err) {
        console.error('triggerShipment error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create shipment' });
    }
};

// Customer order lookup (by order number + email)
const lookupOrder = async (req, res) => {
    try {
        const { order_number, email } = req.query;
        if (!order_number || !email) return res.status(400).json({ success: false, message: 'order_number and email are required' });

        const result = await pool.query(
            `SELECT * FROM shop_orders WHERE order_number = $1 AND LOWER(customer_email) = LOWER($2)`,
            [order_number, email]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to lookup order' });
    }
};

module.exports = { createOrder, getAll, getStats, getByOrderNumber, updateStatus, cancelOrder, triggerShipment, lookupOrder };
