const crypto = require('crypto');
const { pool } = require('../../config/database');

// ── Environment ──────────────────────────────────────────────────────────────
// Strip accidental "KEY=" prefix in case env vars are mis-formatted on server
const clean = (val) => (val || '').trim().replace(/^\w+=/, '');

const PAYU_KEY      = clean(process.env.PAYU_KEY);
const PAYU_SALT     = clean(process.env.PAYU_SALT);
const PAYU_BASE_URL = clean(process.env.PAYU_BASE_URL) || 'https://secure.payu.in/_payment';
// FRONTEND_URL: first URL used for browser redirects after payment
const FRONTEND_URL  = clean((process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0]);
// API_URL: the live API domain — PayU will POST to this after payment
// Must NOT end with /api — we add the path ourselves below
const API_BASE      = clean(process.env.API_URL || 'http://localhost:3333').replace(/\/+$/, '');

// ── PayU Hash Formula ─────────────────────────────────────────────────────────
// Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
// 5 udf fields used + 5 empty + SALT at end = 16 pipes total
const generateHash = ({ key, txnid, amount, productinfo, firstname, email,
    udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', salt }) => {
    const str = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    console.log('[PayU] Hash string:', str.replace(salt, '***SALT***'));
    return crypto.createHash('sha512').update(str).digest('hex');
};

// ── PayU Reverse Hash (response verification) ─────────────────────────────────
// PayU India official formula (NO mihpayid):
//   Without additionalCharges: SALT|status||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|KEY
//   With    additionalCharges: SALT|status|additionalCharges|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|KEY
const verifyReverseHash = (payuResponse) => {
    try {
        const { status, mihpayid, txnid, amount, productinfo, firstname, email,
            additionalCharges, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
            hash: receivedHash } = payuResponse;

        // ── Full debug log so you can trace any future mismatch ──────────────
        console.log('[PayU] verifyReverseHash inputs:', {
            status, mihpayid, txnid, amount, productinfo, firstname, email,
            additionalCharges, udf1, udf2, udf3, udf4, udf5,
            receivedHash,
            PAYU_KEY,
            SALT_LEN: PAYU_SALT.length,
        });

        // Primary formula — PayU India official (no mihpayid)
        let hashStr;
        if (additionalCharges) {
            hashStr = `${PAYU_SALT}|${status}|${additionalCharges}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
        } else {
            hashStr = `${PAYU_SALT}|${status}||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
        }

        console.log('[PayU] Hash string (primary):', hashStr.replace(PAYU_SALT, '***SALT***'));
        const calculated = crypto.createHash('sha512').update(hashStr).digest('hex');

        if (calculated === receivedHash) {
            console.log('[PayU] Hash verified OK (primary formula)');
            return true;
        }

        // Fallback formula — with mihpayid (some PayU SDK versions include it)
        let hashStrFallback;
        if (additionalCharges) {
            hashStrFallback = `${PAYU_SALT}|${status}|${additionalCharges}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${mihpayid}|${PAYU_KEY}`;
        } else {
            hashStrFallback = `${PAYU_SALT}|${status}||${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${mihpayid}|${PAYU_KEY}`;
        }

        console.log('[PayU] Hash string (fallback with mihpayid):', hashStrFallback.replace(PAYU_SALT, '***SALT***'));
        const calculatedFallback = crypto.createHash('sha512').update(hashStrFallback).digest('hex');

        if (calculatedFallback === receivedHash) {
            console.log('[PayU] Hash verified OK (fallback formula with mihpayid)');
            return true;
        }

        // Both failed — log full mismatch details
        console.error('[PayU] ❌ Hash mismatch — both formulas failed!');
        console.error('[PayU] Primary   computed :', calculated);
        console.error('[PayU] Fallback  computed :', calculatedFallback);
        console.error('[PayU] PayU sent hash    :', receivedHash);
        return false;

    } catch (err) {
        console.error('[PayU] verifyReverseHash error:', err);
        return false;
    }
};

// ── POST /api/shop/payu/initiate ─────────────────────────────────────────────
const initiatePayment = async (req, res) => {
    try {
        // Validate credentials are set
        if (!PAYU_KEY || !PAYU_SALT) {
            console.error('[PayU] Missing PAYU_KEY or PAYU_SALT in environment');
            return res.status(500).json({ success: false, message: 'Payment gateway not configured' });
        }

        const { order_id } = req.body;
        if (!order_id) {
            return res.status(400).json({ success: false, message: 'order_id is required' });
        }

        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order_id]);
        if (!orderRes.rows.length) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        const order = orderRes.rows[0];

        if (order.payment_status === 'paid') {
            return res.status(400).json({ success: false, message: 'Order is already paid' });
        }

        const txnid      = order.order_number;
        const amount     = parseFloat(order.total).toFixed(2);
        const productinfo = `Adroit Design Order ${order.order_number}`;
        const firstname  = (order.customer_name || '').split(' ')[0].trim() || 'Customer';
        const email      = (order.customer_email || '').trim();
        const phone      = (order.customer_phone || '').trim();
        const udf1       = order.id.toString(); // store internal order id

        // PayU callback URLs — PayU POSTs to these after payment
        // Must be publicly accessible HTTPS endpoints on your live API domain
        const surl = `${API_BASE}/api/shop/payu/success`;
        const furl = `${API_BASE}/api/shop/payu/failure`;

        console.log('[PayU] Initiating payment for order:', txnid);
        console.log('[PayU] Amount:', amount);
        console.log('[PayU] surl:', surl);
        console.log('[PayU] furl:', furl);
        console.log('[PayU] KEY:', PAYU_KEY, '| SALT length:', PAYU_SALT.length);

        const hash = generateHash({ key: PAYU_KEY, txnid, amount, productinfo, firstname, email, udf1, salt: PAYU_SALT });

        const payuData = {
            key:              PAYU_KEY,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            phone,
            udf1,
            hash,
            surl,
            furl,
            service_provider: 'payu_paisa',
        };

        console.log('[PayU] Sending to frontend, payuUrl:', PAYU_BASE_URL);
        res.json({ success: true, data: { payuData, payuUrl: PAYU_BASE_URL } });

    } catch (err) {
        console.error('[PayU] initiatePayment error:', err);
        res.status(500).json({ success: false, message: 'Failed to initiate payment. Please try again.' });
    }
};

// ── POST /api/shop/payu/success ──────────────────────────────────────────────
// PayU POSTs here after successful payment. Must redirect to frontend.
const paymentSuccess = async (req, res) => {
    const payuResponse = req.body || {};
    console.log('[PayU] Success callback received:', JSON.stringify(payuResponse, null, 2));

    const orderNumber = payuResponse.txnid || 'unknown';

    try {
        // Verify hash to ensure request is genuinely from PayU
        if (!verifyReverseHash(payuResponse)) {
            console.error('[PayU] Hash verification FAILED — possible tampering for order:', orderNumber);
            // Still update DB so admin can see it
            await pool.query(
                `UPDATE shop_orders SET payment_status = 'failed', payu_response = $1, updated_at = NOW() WHERE order_number = $2`,
                [JSON.stringify({ ...payuResponse, debug: 'hash_failed' }), orderNumber]
            ).catch(e => console.error('[PayU] DB update failed:', e));
            return res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}&reason=hash_mismatch`);
        }

        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE order_number = $1`, [orderNumber]);
        if (!orderRes.rows.length) {
            console.error('[PayU] Order not found in DB for txnid:', orderNumber);
            return res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}&reason=not_found`);
        }

        const order = orderRes.rows[0];

        // Idempotent: if already paid, just redirect to success
        if (order.payment_status === 'paid') {
            console.log('[PayU] Order already marked paid, redirecting to success:', orderNumber);
            return res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-success&order=${orderNumber}`);
        }

        // Mark order as paid and confirmed
        await pool.query(
            `UPDATE shop_orders SET
                payment_status   = 'paid',
                payment_txn_id   = $1,
                payment_method   = $2,
                payu_mihpayid    = $3,
                payu_response    = $4,
                order_status     = 'confirmed',
                updated_at       = NOW()
             WHERE id = $5`,
            [
                payuResponse.txnid,
                payuResponse.mode || 'PayU',
                payuResponse.mihpayid || null,
                JSON.stringify(payuResponse),
                order.id
            ]
        );

        // Increment total_sales counter on each product
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || '[]');
        for (const item of items) {
            await pool.query(
                `UPDATE shop_products SET total_sales = COALESCE(total_sales, 0) + $1 WHERE id = $2`,
                [item.qty, item.product_id]
            ).catch(e => console.warn('[PayU] total_sales update failed for product', item.product_id, e.message));
        }

        console.log('[PayU] Order paid successfully:', orderNumber);
        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-success&order=${orderNumber}`);

    } catch (err) {
        console.error('[PayU] paymentSuccess handler error:', err);
        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}&reason=server_error`);
    }
};

// ── POST /api/shop/payu/failure ──────────────────────────────────────────────
// PayU POSTs here when payment fails or is cancelled by user.
const paymentFailure = async (req, res) => {
    const payuResponse = req.body || {};
    console.log('[PayU] Failure callback received:', JSON.stringify(payuResponse, null, 2));

    const orderNumber = payuResponse.txnid || 'unknown';

    try {
        await pool.query(
            `UPDATE shop_orders SET
                payment_status = 'failed',
                payu_response  = $1,
                updated_at     = NOW()
             WHERE order_number = $2`,
            [JSON.stringify(payuResponse), orderNumber]
        );

        console.log('[PayU] Order marked failed:', orderNumber);
    } catch (err) {
        console.error('[PayU] paymentFailure DB error:', err);
    }

    // Always redirect — never show raw JSON to user
    res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}`);
};

module.exports = { initiatePayment, paymentSuccess, paymentFailure };
