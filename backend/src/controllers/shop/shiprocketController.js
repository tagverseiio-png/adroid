const https = require('https');
const { pool } = require('../../config/database');

const SHIPROCKET_EMAIL    = process.env.SHIPROCKET_EMAIL    || '';
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || '';

// ── Token Cache ──────────────────────────────────────────────────────────────

let cachedToken  = null;
let tokenExpiry  = 0;

const getToken = async () => {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

    const body = JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD });
    const data = await srRequest('POST', '/auth/login', body, false);

    if (!data.token) {
        throw new Error('Shiprocket auth failed: ' + (data.message || JSON.stringify(data)));
    }

    cachedToken = data.token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
    console.log('[Shiprocket] Token refreshed');
    return cachedToken;
};

// ── HTTP Helper ───────────────────────────────────────────────────────────────

const srRequest = (method, path, body = null, withAuth = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token  = withAuth ? await getToken() : null;
            const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

            const options = {
                hostname: 'apiv2.shiprocket.in',
                path:     `/v1/external${path}`,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token   ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
                },
            };

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data',  chunk => { data += chunk; });
                res.on('end',   ()    => {
                    try   { resolve(JSON.parse(data)); }
                    catch { resolve({ raw: data, status_code: res.statusCode }); }
                });
            });

            req.on('error', reject);
            if (bodyStr) req.write(bodyStr);
            req.end();

        } catch (err) {
            reject(err);
        }
    });
};

// ── Create Shipment ──────────────────────────────────────────────────────────
// Uses the pickup_location_name stored on the order (set by admin)
// Falls back to 'Primary' which must match a pickup location in Shiprocket dashboard

const createShipment = async (order) => {
    const address = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : (order.shipping_address || {});

    const orderItemsParsed = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    
    const items = orderItemsParsed.map(item => ({
            name:          item.name,
            sku:           item.sku || String(item.product_id),
            units:         item.qty,
            selling_price: String(parseFloat(item.unit_price).toFixed(2)),
        }));

    // Calculate weight and dimensions dynamically
    let totalWeightGrams = 0;
    let maxL = 0, maxB = 0, maxH = 0;

    for (const item of orderItemsParsed) {
        let weight = item.weight_grams;
        let dims = item.dimensions;

        // Fallback for older orders missing snapshot data
        if (weight === undefined || dims === undefined) {
            try {
                const prodRes = await pool.query(`SELECT weight_grams, dimensions FROM shop_products WHERE id = $1`, [item.product_id]);
                if (prodRes.rows.length) {
                    weight = prodRes.rows[0].weight_grams;
                    dims = typeof prodRes.rows[0].dimensions === 'string' ? JSON.parse(prodRes.rows[0].dimensions) : prodRes.rows[0].dimensions;
                }
            } catch (e) {
                console.error('[Shiprocket] Fallback weight fetch failed:', e.message);
            }
        }

        const qty = item.qty || 1;
        totalWeightGrams += (parseInt(weight) || 500) * qty;
        
        dims = dims || {};
        const l = parseFloat(dims.length || dims.l || 20);
        const b = parseFloat(dims.breadth || dims.width || dims.b || dims.w || 15);
        const h = parseFloat(dims.height || dims.h || 10);

        if (l > maxL) maxL = l;
        if (b > maxB) maxB = b;
        maxH += (h * qty); // Assume stacking
    }

    const totalWeightKg = parseFloat((Math.max(10, totalWeightGrams) / 1000).toFixed(3));

    // Pickup location: use the one set by admin, fallback to 'Franklin'
    const pickupLocation = (order.pickup_location_name || 'Franklin').trim();

    const nameParts = (order.customer_name || 'Customer').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName  = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

    const phone = (order.customer_phone || '').replace(/[^0-9]/g, '').slice(-10);

    console.log('[Shiprocket] Creating shipment for order:', order.order_number);
    console.log('[Shiprocket] Pickup location:', pickupLocation);
    console.log('[Shiprocket] Delivery address:', address.city, address.state, address.pincode);
    console.log(`[Shiprocket] Package size: ${maxL}x${maxB}x${maxH}cm, Weight: ${totalWeightKg}kg`);

    // Append timestamp to order_id to prevent Shiprocket duplicate collisions on retries
    const uniqueOrderId = `${order.order_number}-${Math.floor(Date.now() / 1000)}`;

    const payload = {
        order_id:                  uniqueOrderId,
        order_date:                new Date(order.created_at).toISOString().slice(0, 10),
        pickup_location:           pickupLocation,
        comment:                   order.notes || `Adroit Design Order ${order.order_number}`,
        billing_customer_name:     firstName,
        billing_last_name:         lastName,
        billing_address:           address.line1 || 'No Address Line 1',
        billing_address_2:         address.line2 || '',
        billing_city:              address.city  || 'Unknown',
        billing_pincode:           String(address.pincode || address.pin || '').replace(/[^0-9]/g, '').slice(0, 6),
        billing_state:             address.state || 'Unknown',
        billing_country:           'India',
        billing_email:             order.customer_email || 'noemail@adroitdesigns.in',
        billing_phone:             phone.length === 10 ? phone : (() => { throw new Error('Invalid phone number — cannot create shipment'); })(),
        shipping_is_billing:       true,
        order_items:               items,
        payment_method:            order.payment_status === 'paid' ? 'Prepaid' : 'COD',
        shipping_charges:          parseFloat(order.shipping_charge || 0),
        giftwrap_charges:          0,
        transaction_charges:       0,
        total_discount:            parseFloat(order.discount_amount || 0),
        sub_total:                 parseFloat(order.subtotal),
        length:                    Math.max(1, maxL),
        breadth:                   Math.max(1, maxB),
        height:                    Math.max(1, maxH),
        weight:                    totalWeightKg,
    };

    console.log('[Shiprocket] Payload:', JSON.stringify(payload, null, 2));

    const result = await srRequest('POST', '/orders/create/adhoc', payload);

    console.log('[Shiprocket] Response:', JSON.stringify(result, null, 2));

    if (!result.order_id) {
        const errorMsg = result.message || result.error || JSON.stringify(result);
        throw new Error(`Shiprocket order creation failed: ${errorMsg}`);
    }

    let awb_code = result.awb_code || null;
    let courier_name = result.courier_name || null;
    let tracking_url = result.tracking_url || null;

    // Automatically call Step 5: Assign AWB as per Shiprocket API Docs
    if (result.shipment_id && !awb_code) {
        try {
            console.log(`[Shiprocket] Auto-assigning AWB for shipment_id: ${result.shipment_id}`);
            const awbPayload = { shipment_id: result.shipment_id };
            const awbResult = await srRequest('POST', '/courier/assign/awb', awbPayload);
            console.log('[Shiprocket] AWB Assignment Response:', JSON.stringify(awbResult, null, 2));

            if (awbResult.response && awbResult.response.data) {
                awb_code     = awbResult.response.data.awb_code     || awb_code;
                courier_name = awbResult.response.data.courier_name || courier_name;
                tracking_url = awbResult.response.data.track_url    || tracking_url;
            }
            
            // Fallback tracking URL if still missing
            if (awb_code && !tracking_url) {
                tracking_url = `https://shiprocket.co/tracking/${awb_code}`;
            }
        } catch (awbErr) {
            console.error('[Shiprocket] Failed to auto-assign AWB:', awbErr.message);
            // We don't throw here because the order was successfully created in Shiprocket.
        }
    }

    return {
        shiprocket_order_id: String(result.order_id),
        shipment_id:         result.shipment_id ? String(result.shipment_id) : null,
        awb_code,
        courier_name,
        tracking_url,
    };
};

// ── Track Shipment ───────────────────────────────────────────────────────────

const trackShipment = async (req, res) => {
    try {
        const { awb } = req.params;
        const data = await srRequest('GET', `/courier/track/awb/${awb}`);
        res.json({ success: true, data });
    } catch (err) {
        console.error('trackShipment error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch tracking info' });
    }
};

// ── Generate Label ───────────────────────────────────────────────────────────
const generateLabel = async (shipment_ids) => {
    return await srRequest('POST', '/courier/generate/label', { shipment_id: shipment_ids });
};

// ── Generate Invoice ─────────────────────────────────────────────────────────
const generateInvoice = async (order_ids) => {
    return await srRequest('POST', '/orders/print/invoice', { ids: order_ids });
};

// ── Cancel Shipment ──────────────────────────────────────────────────────────
const cancelShipment = async (awbs) => {
    return await srRequest('POST', '/orders/cancel/awbs', { awbs });
};

// ── Track AWB (Server Side) ──────────────────────────────────────────────────
const trackAwbServer = async (awb) => {
    return await srRequest('GET', `/courier/track/awb/${awb}`);
};

// ── Assign AWB (Server Side) ────────────────────────────────────────────────
const assignAwbAPI = async (shipment_id) => {
    const result = await srRequest('POST', '/courier/assign/awb', { shipment_id });
    if (result.response && result.response.data && result.response.data.awb_code) {
        // Construct fallback tracking URL if not provided
        result.response.data.tracking_url = result.response.data.track_url || `https://shiprocket.co/tracking/${result.response.data.awb_code}`;
    }
    return result;
};

// ── Get Pickup Locations ───────────────────────────────────────────────────────
const getPickupLocations = async (req, res) => {
    try {
        const data = await srRequest('GET', '/settings/company/pickup');
        res.json({ success: true, data: data.data.shipping_address || [] });
    } catch (err) {
        console.error('getPickupLocations error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch pickup locations from Shiprocket' });
    }
};

module.exports = { getToken, createShipment, trackShipment, generateLabel, generateInvoice, cancelShipment, trackAwbServer, assignAwbAPI, getPickupLocations };
