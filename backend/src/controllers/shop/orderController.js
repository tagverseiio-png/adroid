const { pool } = require('../../config/database');
const { createShipment, generateLabel, generateInvoice, cancelShipment, trackAwbServer } = require('./shiprocketController');

// ── Helpers ─────────────────────────────────────────────────────────────────

const generateOrderNumber = () => {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
    return `AD-${ts}-${rand}`;
};

// Input sanitisation helper
const sanitiseStr = (val, maxLen = 255) =>
    typeof val === 'string' ? val.trim().substring(0, maxLen) : '';

const ALL_STATUSES = ['placed', 'confirmed', 'preparing', 'ready', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

// ── POST /api/shop/orders — Customer creates order ───────────────────────────
// Stock is reserved immediately. Payment must complete to confirm it.
// If payment fails, admin cancels the order which restores stock.
const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const { customer_name, customer_email, customer_phone, shipping_address, items: cartItems, coupon_code, notes } = req.body;

        // ── Sanitise & Validate ───────────────────────────────────────────
        const name  = sanitiseStr(customer_name,  200);
        const email = sanitiseStr(customer_email, 200).toLowerCase();
        const phone = sanitiseStr(customer_phone, 20);
        const note  = sanitiseStr(notes, 1000);

        if (!name || !email || !phone || !shipping_address || !cartItems?.length) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Missing required order fields' });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Invalid email address' });
        }
        const cleanedPhone = phone.replace(/[^0-9]/g, '');
        if (cleanedPhone.length < 10) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit phone number' });
        }
        if (!Array.isArray(cartItems) || cartItems.length > 50) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Invalid cart (max 50 items)' });
        }

        // Sanitise & validate each cart item
        for (const ci of cartItems) {
            ci.product_id = parseInt(ci.product_id);
            ci.qty        = parseInt(ci.qty);
            if (!ci.product_id || ci.product_id < 1) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'Invalid product in cart' });
            }
            if (!ci.qty || ci.qty < 1 || ci.qty > 999) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: 'Invalid quantity in cart' });
            }
        }

        // Sanitise shipping address fields
        const addr = {
            line1:   sanitiseStr(shipping_address.line1,   300),
            line2:   sanitiseStr(shipping_address.line2,   300),
            city:    sanitiseStr(shipping_address.city,    100),
            state:   sanitiseStr(shipping_address.state,   100),
            pincode: sanitiseStr(shipping_address.pincode, 10),
        };
        if (!addr.line1 || !addr.city || !addr.state || !addr.pincode) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: 'Incomplete shipping address' });
        }

        // Validate & fetch products + check stock
        const productIds = cartItems.map(i => i.product_id);
        const prodRes = await client.query(
            `SELECT id, name, sku, price, sale_price, stock_qty, published, weight_grams, dimensions
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
                return res.status(400).json({ success: false, message: `Product not available` });
            }
            if (prod.stock_qty < ci.qty) {
                await client.query('ROLLBACK');
                return res.status(400).json({ success: false, message: `Insufficient stock for "${prod.name}" (only ${prod.stock_qty} left)` });
            }
            const unitPrice = parseFloat(prod.sale_price || prod.price);
            const lineTotal = unitPrice * ci.qty;
            subtotal += lineTotal;
            itemsSnapshot.push({ 
                product_id: prod.id, 
                name: prod.name, 
                sku: prod.sku, 
                qty: ci.qty, 
                unit_price: unitPrice, 
                total_price: lineTotal,
                weight_grams: prod.weight_grams || 0,
                dimensions: prod.dimensions || {}
            });
        }

        // Apply coupon — SELECT FOR UPDATE locks the row inside the transaction
        // preventing race-condition double-use of single-use coupons
        let discountAmount = 0;
        let couponApplied  = null;
        if (coupon_code) {
            const cleanCode = sanitiseStr(coupon_code, 50);
            const couponRes = await client.query(
                `SELECT * FROM shop_coupons
                 WHERE UPPER(code) = UPPER($1)
                   AND active = true
                   AND (expiry_date IS NULL OR expiry_date > NOW())
                   AND (max_uses = 0 OR used_count < max_uses)
                   AND min_order_value <= $2
                 FOR UPDATE`, // lock row: prevents concurrent orders using same coupon
                [cleanCode, subtotal]
            );
            if (couponRes.rows.length) {
                const coupon = couponRes.rows[0];
                if (coupon.type === 'percent') {
                    discountAmount = Math.round((subtotal * parseFloat(coupon.value) / 100) * 100) / 100;
                    if (coupon.max_discount) discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount));
                } else {
                    discountAmount = Math.min(parseFloat(coupon.value), subtotal);
                }
                couponApplied = coupon.code;
                await client.query(
                    `UPDATE shop_coupons SET used_count = used_count + 1 WHERE id = $1`,
                    [coupon.id]
                );
            }
        }

        const shippingCharge = (subtotal - discountAmount) >= 999 ? 0 : 99;
        const total          = Math.max(0, subtotal - discountAmount + shippingCharge);
        const orderNumber    = generateOrderNumber();

        // Deduct stock atomically (reserved — restored if cancelled)
        for (const ci of cartItems) {
            const result = await client.query(
                `UPDATE shop_products SET stock_qty = stock_qty - $1, updated_at = NOW()
                 WHERE id = $2 AND stock_qty >= $1 RETURNING id`,
                [ci.qty, ci.product_id]
            );
            if (!result.rows.length) {
                await client.query('ROLLBACK');
                return res.status(409).json({ success: false, message: `Stock just ran out. Please refresh and try again.` });
            }
        }

        // Insert order with sanitised fields
        const orderRes = await client.query(
            `INSERT INTO shop_orders
             (order_number, customer_name, customer_email, customer_phone,
              shipping_address, items, subtotal, discount_amount, coupon_code,
              shipping_charge, total, notes, payment_status, order_status)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'pending','placed')
             RETURNING id, order_number, customer_name, customer_email, customer_phone,
                       shipping_address, items, subtotal, discount_amount, coupon_code,
                       shipping_charge, total, notes, payment_status, order_status, created_at`,
            [
                orderNumber, name, email, phone,
                JSON.stringify(addr), JSON.stringify(itemsSnapshot),
                subtotal, discountAmount, couponApplied,
                shippingCharge, total, note || null
            ]
        );

        await client.query('COMMIT');
        res.status(201).json({ success: true, data: orderRes.rows[0], message: 'Order created successfully' });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('createOrder error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create order' });
    } finally {
        client.release();
    }
};

// ── GET /api/shop/orders/admin/all — Admin list ──────────────────────────────
const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 50, status, payment_status, search, date_from, date_to } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const conditions = [];
        const params = [];
        let pi = 1;

        if (status)         { params.push(status);          conditions.push(`order_status = $${pi++}`); }
        if (payment_status) { params.push(payment_status);  conditions.push(`payment_status = $${pi++}`); }
        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(order_number ILIKE $${pi} OR customer_email ILIKE $${pi} OR customer_name ILIKE $${pi})`);
            pi++;
        }
        if (date_from) { params.push(date_from); conditions.push(`created_at >= $${pi++}`); }
        if (date_to)   { params.push(date_to);   conditions.push(`created_at <= $${pi++}`); }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        // Build count query (without LIMIT/OFFSET)
        const countParams = [...params];
        const countRes = await pool.query(
            `SELECT COUNT(*) AS cnt,
                    COALESCE(SUM(CASE WHEN payment_status='paid' THEN total ELSE 0 END), 0) AS revenue
             FROM shop_orders ${where}`,
            countParams
        );

        // Build data query
        params.push(parseInt(limit), offset);
        const rows = await pool.query(
            `SELECT * FROM shop_orders ${where} ORDER BY created_at DESC LIMIT $${pi} OFFSET $${pi + 1}`,
            params
        );

        res.json({
            success: true,
            data:    rows.rows,
            total:   parseInt(countRes.rows[0].cnt),
            revenue: parseFloat(countRes.rows[0].revenue),
        });
    } catch (err) {
        console.error('getAll orders error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch orders' });
    }
};

// ── GET /api/shop/orders/stats ───────────────────────────────────────────────
const getStats = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                COUNT(*) AS total_orders,
                COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) AS total_revenue,
                COUNT(CASE WHEN order_status = 'confirmed' THEN 1 END) AS new_orders,
                COUNT(CASE WHEN order_status IN ('preparing', 'ready') THEN 1 END) AS in_progress,
                COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) AS today_orders,
                COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) AS failed_payments
            FROM shop_orders
        `);
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
};

// ── GET /api/shop/orders/:orderNumber ────────────────────────────────────────
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

// ── PATCH /api/shop/orders/:id/status ────────────────────────────────────────
// When status changes to 'ready', auto-trigger Shiprocket
const updateStatus = async (req, res) => {
    const { status, pickup_location_name } = req.body;

    if (!ALL_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Valid: ${ALL_STATUSES.join(', ')}` });
    }

    const SHIPROCKET_MANAGED_STATUSES = ['shipped', 'out_for_delivery', 'delivered', 'returned'];
    if (SHIPROCKET_MANAGED_STATUSES.includes(status)) {
        return res.status(403).json({ 
            success: false, 
            message: 'Status is managed automatically by Shiprocket and cannot be changed manually.' 
        });
    }

    try {
        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orderRes.rows[0];

        // Save pickup location if provided
        let updates = `order_status = $1, updated_at = NOW()`;
        const params = [status, order.id];

        if (pickup_location_name) {
            updates += `, pickup_location_name = $${params.length + 1}`;
            params.splice(params.length - 1, 0, pickup_location_name); // insert before last param (order id)
            // Fix: rebuild params correctly
        }

        // Simple update — handle pickup separately below
        await pool.query(
            `UPDATE shop_orders SET order_status = $1, updated_at = NOW() WHERE id = $2`,
            [status, order.id]
        );

        // Save pickup location if provided
        if (pickup_location_name) {
            await pool.query(
                `UPDATE shop_orders SET pickup_location_name = $1 WHERE id = $2`,
                [pickup_location_name, order.id]
            );
        }

        // ── Auto-trigger Shiprocket when status → 'ready' ──────────────────
        if (status === 'ready') {
            if (order.payment_status !== 'paid') {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot mark as ready — order is not paid yet'
                });
            }

            if (order.shiprocket_order_id) {
                return res.json({ success: true, message: 'Status updated (shipment already created)' });
            }

            try {
                // Get latest order data (with pickup_location_name)
                const freshOrder = (await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order.id])).rows[0];
                const shipResult = await createShipment(freshOrder);

                await pool.query(
                    `UPDATE shop_orders SET
                        shiprocket_order_id  = $1,
                        shipment_id          = $2,
                        awb_code             = $3,
                        courier_name         = $4,
                        tracking_url         = $5,
                        shiprocket_response  = $6,
                        order_status         = 'shipped',
                        updated_at           = NOW()
                     WHERE id = $7`,
                    [
                        shipResult.shiprocket_order_id,
                        shipResult.shipment_id,
                        shipResult.awb_code || null,
                        shipResult.courier_name || null,
                        shipResult.tracking_url || null,
                        JSON.stringify(shipResult),
                        order.id
                    ]
                );

                const updatedOrder = (await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order.id])).rows[0];
                return res.json({ success: true, message: 'Order is ready — Shiprocket shipment created!', data: updatedOrder });

            } catch (shipErr) {
                console.error('[Shiprocket] createShipment failed:', shipErr.message);
                // Revert status to prevent Ghost State
                await pool.query(
                    `UPDATE shop_orders SET order_status = $1, updated_at = NOW() WHERE id = $2`,
                    [order.order_status, order.id]
                );
                return res.status(400).json({
                    success: false,
                    message: 'Shiprocket creation failed: ' + shipErr.message
                });
            }
        }

        const updatedOrder = (await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order.id])).rows[0];
        res.json({ success: true, message: 'Status updated successfully', data: updatedOrder });
    } catch (err) {
        console.error('updateStatus error:', err);
        res.status(500).json({ success: false, message: 'Failed to update status' });
    }
};

// ── POST /api/shop/orders/:id/assign-awb — Admin manually assigns AWB ───────
const assignAwb = async (req, res) => {
    try {
        const { id } = req.params;
        const order = (await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [id])).rows[0];
        if (!order || !order.shipment_id) return res.status(400).json({ success: false, message: 'No shipment ID found' });

        const { assignAwbAPI } = require('./shiprocketController');
        const awbResult = await assignAwbAPI(order.shipment_id);

        if (awbResult.response && awbResult.response.data && awbResult.response.data.awb_code) {
            const data = awbResult.response.data;
            await pool.query(
                `UPDATE shop_orders SET awb_code = $1, courier_name = $2, tracking_url = $3, updated_at = NOW() WHERE id = $4`,
                [data.awb_code, data.courier_name, data.tracking_url, order.id]
            );
            return res.json({ success: true, message: 'AWB Assigned Successfully', data: { awb_code: data.awb_code, courier_name: data.courier_name, tracking_url: data.tracking_url } });
        } else {
            return res.status(400).json({ success: false, message: awbResult.message || 'Failed to assign AWB. Ensure wallet has balance.', full_error: awbResult });
        }
    } catch (err) {
        console.error('assignAwb error:', err);
        res.status(500).json({ success: false, message: 'Failed to assign AWB' });
    }
};

// ── POST /api/shop/orders/webhook/shiprocket — Tracking updates ─────────────
const shiprocketWebhook = async (req, res) => {
    try {
        const data = req.body;
        console.log('[Shiprocket Webhook] Received:', data.awb);

        if (!data || !data.awb) return res.status(200).send('OK');

        let newStatus = null;
        const srStatus = (data.current_status || '').toUpperCase();

        if (srStatus.includes('DELIVERED')) newStatus = 'delivered';
        else if (srStatus.includes('OUT FOR DELIVERY')) newStatus = 'out_for_delivery';
        else if (srStatus.includes('RTO') || srStatus.includes('RETURN')) newStatus = 'returned';
        else if (srStatus.includes('CANCELED') || srStatus.includes('CANCELLED')) newStatus = 'cancelled';
        else if (srStatus.includes('SHIPPED') || srStatus.includes('IN TRANSIT') || srStatus.includes('PICKED UP')) newStatus = 'shipped';

        if (newStatus) {
            await pool.query(
                `UPDATE shop_orders SET order_status = $1, updated_at = NOW() WHERE awb_code = $2`,
                [newStatus, data.awb]
            );
            console.log(`[Shiprocket Webhook] Updated AWB ${data.awb} to ${newStatus}`);
        }

        res.status(200).send('OK');
    } catch (err) {
        console.error('[Shiprocket Webhook] Error:', err.message);
        res.status(200).send('Error');
    }
};

// ── PATCH /api/shop/orders/:id/cancel ───────────────────────────────────────
// Cancels order and restores stock
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

        // Cancel Shiprocket AWB if present
        if (order.awb_code) {
            try {
                await cancelShipment([order.awb_code]);
            } catch (err) {
                console.error('Failed to cancel Shiprocket AWB:', err);
            }
        }

        // Restore stock
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
        for (const item of items) {
            await client.query(
                `UPDATE shop_products SET stock_qty = stock_qty + $1 WHERE id = $2`,
                [item.qty, item.product_id]
            );
        }

        await client.query(
            `UPDATE shop_orders SET
                order_status   = 'cancelled',
                payment_status = CASE WHEN payment_status = 'paid' THEN 'refunded' ELSE payment_status END,
                updated_at     = NOW()
             WHERE id = $1`,
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

// ── POST /api/shop/orders/:id/create-shipment (manual override) ──────────────
const triggerShipment = async (req, res) => {
    try {
        const { pickup_location_name } = req.body;

        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orderRes.rows[0];

        if (order.payment_status !== 'paid') {
            return res.status(400).json({ success: false, message: 'Order must be paid before creating a shipment' });
        }

        // Use provided pickup location or existing
        const pickupName = pickup_location_name || order.pickup_location_name;
        if (pickup_location_name) {
            await pool.query(`UPDATE shop_orders SET pickup_location_name = $1 WHERE id = $2`, [pickup_location_name, order.id]);
        }

        const freshOrder = { ...order, pickup_location_name: pickupName };
        const result = await createShipment(freshOrder);

        await pool.query(
            `UPDATE shop_orders SET
                shiprocket_order_id = $1,
                shipment_id         = $2,
                awb_code            = $3,
                courier_name        = $4,
                shiprocket_response = $5,
                order_status        = 'shipped',
                updated_at          = NOW()
             WHERE id = $6`,
            [result.shiprocket_order_id, result.shipment_id, result.awb_code, result.courier_name, JSON.stringify(result), order.id]
        );

        const updatedOrder = (await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order.id])).rows[0];
        res.json({ success: true, message: 'Shipment created on Shiprocket', data: updatedOrder });

    } catch (err) {
        console.error('triggerShipment error:', err);
        res.status(500).json({ success: false, message: err.message || 'Failed to create shipment' });
    }
};

// ── GET /api/shop/orders/lookup — Customer self-lookup ───────────────────────
const lookupOrder = async (req, res) => {
    try {
        const { order_number, email } = req.query;
        if (!order_number || !email) return res.status(400).json({ success: false, message: 'order_number and email are required' });

        const result = await pool.query(
            `SELECT * FROM shop_orders WHERE order_number = $1 AND LOWER(customer_email) = LOWER($2)`,
            [order_number, email]
        );
        if (!result.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        const order = result.rows[0];

        // Items are stored as JSONB in shop_orders.items — parse them
        let items = [];
        try {
            items = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
        } catch (e) {
            items = [];
        }
        order.items = items;

        // Generate tracking_url fallback if missing but AWB exists
        if (order.awb_code && !order.tracking_url) {
            order.tracking_url = `https://shiprocket.co/tracking/${order.awb_code}`;
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to lookup order' });
    }
};

// ── POST /api/shop/orders/:id/generate-label ─────────────────────────────────
const generateLabelForOrder = async (req, res) => {
    try {
        const orderRes = await pool.query(`SELECT shipment_id FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        const { shipment_id } = orderRes.rows[0];
        if (!shipment_id) return res.status(400).json({ success: false, message: 'No shipment ID for this order' });

        const data = await generateLabel([parseInt(shipment_id)]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to generate label: ' + err.message });
    }
};

// ── POST /api/shop/orders/:id/generate-invoice ───────────────────────────────
const generateInvoiceForOrder = async (req, res) => {
    try {
        const orderRes = await pool.query(`SELECT shiprocket_order_id FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        const { shiprocket_order_id } = orderRes.rows[0];
        if (!shiprocket_order_id) return res.status(400).json({ success: false, message: 'No Shiprocket order ID' });

        const data = await generateInvoice([parseInt(shiprocket_order_id)]);
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to generate invoice: ' + err.message });
    }
};

// ── POST /api/shop/orders/:id/sync-shiprocket ────────────────────────────────
const syncShiprocketStatus = async (req, res) => {
    try {
        const orderRes = await pool.query(`SELECT id, awb_code, order_status FROM shop_orders WHERE id = $1`, [req.params.id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });
        const order = orderRes.rows[0];
        if (!order.awb_code) return res.status(400).json({ success: false, message: 'No AWB to track' });

        const data = await trackAwbServer(order.awb_code);
        if (data.tracking_data && data.tracking_data.shipment_status) {
            let newStatus = order.order_status;
            const srStatus = data.tracking_data.track_status ? data.tracking_data.track_status : 0;
            
            // Shiprocket statuses: 6=Shipped, 7=Delivered, 8=Cancelled, 9=RTO, 17=Out for Delivery
            if (srStatus === 7) newStatus = 'delivered';
            else if (srStatus === 17) newStatus = 'out_for_delivery';
            else if (srStatus === 6) newStatus = 'shipped';
            else if (srStatus === 8) newStatus = 'cancelled';

            if (newStatus !== order.order_status) {
                await pool.query(`UPDATE shop_orders SET order_status = $1, updated_at = NOW() WHERE id = $2`, [newStatus, order.id]);
            }
            
            res.json({ success: true, data: data.tracking_data, newStatus });
        } else {
            res.json({ success: true, data: data, message: 'No status update' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to sync status: ' + err.message });
    }
};

module.exports = {
    createOrder,
    getAll,
    getStats,
    getByOrderNumber,
    updateStatus,
    assignAwb,
    cancelOrder,
    triggerShipment,
    lookupOrder,
    generateLabelForOrder,
    generateInvoiceForOrder,
    syncShiprocketStatus,
    shiprocketWebhook
};
