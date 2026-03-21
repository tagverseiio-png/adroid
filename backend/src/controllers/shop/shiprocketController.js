const https = require('https');
const http = require('http');

const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL || '';
const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD || '';
const SHIPROCKET_API = 'https://apiv2.shiprocket.in/v1/external';

// ── Token Cache ──────────────────────────────────────────────────────────────

let cachedToken = null;
let tokenExpiry = 0;

const getToken = async () => {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

    const body = JSON.stringify({ email: SHIPROCKET_EMAIL, password: SHIPROCKET_PASSWORD });
    const data = await srRequest('POST', '/auth/login', body, false);

    if (!data.token) throw new Error('Shiprocket auth failed: ' + (data.message || 'No token received'));

    cachedToken = data.token;
    tokenExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
    return cachedToken;
};

// ── HTTP Helper ───────────────────────────────────────────────────────────────

const srRequest = (method, path, body = null, withAuth = true) => {
    return new Promise(async (resolve, reject) => {
        const token = withAuth ? await getToken() : null;
        const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;

        const options = {
            hostname: 'apiv2.shiprocket.in',
            path: `/v1/external${path}`,
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch { resolve({ raw: data }); }
            });
        });

        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
};

// ── Create Shipment ──────────────────────────────────────────────────────────

const createShipment = async (order) => {
    const address = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;

    const items = (typeof order.items === 'string' ? JSON.parse(order.items) : order.items)
        .map(item => ({
            name: item.name,
            sku: item.sku || item.product_id,
            units: item.qty,
            selling_price: item.unit_price,
        }));

    const payload = {
        order_id: order.order_number,
        order_date: new Date(order.created_at).toISOString().slice(0, 10),
        pickup_location: 'Primary',
        channel_id: '',
        comment: order.notes || '',
        billing_customer_name: order.customer_name,
        billing_last_name: '',
        billing_address: address.line1 || address.address || '',
        billing_address_2: address.line2 || '',
        billing_city: address.city || '',
        billing_pincode: address.pincode || address.pin || '',
        billing_state: address.state || '',
        billing_country: 'India',
        billing_email: order.customer_email,
        billing_phone: order.customer_phone,
        shipping_is_billing: true,
        order_items: items,
        payment_method: order.payment_status === 'paid' ? 'Prepaid' : 'COD',
        shipping_charges: parseFloat(order.shipping_charge || 0),
        giftwrap_charges: 0,
        transaction_charges: 0,
        total_discount: parseFloat(order.discount_amount || 0),
        sub_total: parseFloat(order.subtotal),
        length: 20, width: 15, height: 10,
        weight: 0.5,
    };

    const result = await srRequest('POST', '/orders/create/adhoc', payload);

    if (!result.order_id) {
        throw new Error('Shiprocket order creation failed: ' + (result.message || JSON.stringify(result)));
    }

    return {
        shiprocket_order_id: result.order_id?.toString(),
        shipment_id: result.shipment_id?.toString(),
        awb_code: result.awb_code || null,
        courier_name: result.courier_name || null,
        tracking_url: result.tracking_url || null,
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

module.exports = { getToken, createShipment, trackShipment };
