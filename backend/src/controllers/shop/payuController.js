const crypto = require('crypto');
const { pool } = require('../../config/database');

const PAYU_KEY = process.env.PAYU_KEY || '';
const PAYU_SALT = process.env.PAYU_SALT || '';
const PAYU_BASE_URL = process.env.PAYU_BASE_URL || 'https://sandboxsecure.payu.in/_payment';
const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim();
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// ── Hash Generation ──────────────────────────────────────────────────────────

const generateHash = ({ key, txnid, amount, productinfo, firstname, email, udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '', salt }) => {
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};

const verifyReverseHash = (payuResponse) => {
    const { status, mihpayid, txnid, amount, productinfo, firstname, email, additionalCharges, hash: receivedHash } = payuResponse;
    let hashString;
    if (additionalCharges) {
        hashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${mihpayid}|${PAYU_KEY}`;
    } else {
        hashString = `${PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${mihpayid}|${PAYU_KEY}`;
    }
    const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return calculatedHash === receivedHash;
};

// ── Initiate Payment ─────────────────────────────────────────────────────────

// POST /api/shop/payu/initiate
const initiatePayment = async (req, res) => {
    try {
        const { order_id } = req.body;
        if (!order_id) return res.status(400).json({ success: false, message: 'order_id is required' });

        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE id = $1`, [order_id]);
        if (!orderRes.rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

        const order = orderRes.rows[0];

        if (order.payment_status === 'paid') {
            return res.status(400).json({ success: false, message: 'Order already paid' });
        }

        const txnid = order.order_number;
        const amount = parseFloat(order.total).toFixed(2);
        const productinfo = `Adroit Design Order ${order.order_number}`;
        const firstname = (order.customer_name.split(' ')[0] || '').trim();
        const email = (order.customer_email || '').trim();
        const phone = (order.customer_phone || '').trim();
        const udf1 = order.id.toString();

        const hash = generateHash({ key: PAYU_KEY, txnid, amount, productinfo, firstname, email, udf1, salt: PAYU_SALT });

        const payuData = {
            key: PAYU_KEY,
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            phone,
            udf1,
            hash,
            surl: `${API_URL}/shop/payu/success`,
            furl: `${API_URL}/shop/payu/failure`,
            service_provider: 'payu_paisa',
        };

        res.json({ success: true, data: { payuData, payuUrl: PAYU_BASE_URL } });
    } catch (err) {
        console.error('initiatePayment error:', err);
        res.status(500).json({ success: false, message: 'Failed to initiate payment' });
    }
};

// ── Payment Callbacks (PayU POSTs here) ──────────────────────────────────────

// POST /api/shop/payu/success
const paymentSuccess = async (req, res) => {
    try {
        const payuResponse = req.body;
        console.log('[PayU Success]', payuResponse);

        const orderNumber = payuResponse.txnid;
        const orderRes = await pool.query(`SELECT * FROM shop_orders WHERE order_number = $1`, [orderNumber]);

        if (!orderRes.rows.length) {
            return res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}`);
        }

        const order = orderRes.rows[0];

        // Verify hash
        const hashValid = verifyReverseHash(payuResponse);
        if (!hashValid) {
            console.error('[PayU] Hash verification FAILED for order:', orderNumber);
            await pool.query(
                `UPDATE shop_orders SET payment_status = 'failed', payu_response = $1, updated_at = NOW() WHERE id = $2`,
                [JSON.stringify(payuResponse), order.id]
            );
            return res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}`);
        }

        // Mark as paid
        await pool.query(
            `UPDATE shop_orders SET
                payment_status = 'paid',
                payment_txn_id = $1,
                payment_method = $2,
                payu_mihpayid = $3,
                payu_response = $4,
                order_status = 'confirmed',
                updated_at = NOW()
             WHERE id = $5`,
            [payuResponse.txnid, payuResponse.mode || 'PayU', payuResponse.mihpayid, JSON.stringify(payuResponse), order.id]
        );

        // Update total_sales on products
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
        for (const item of items) {
            await pool.query(`UPDATE shop_products SET total_sales = total_sales + $1 WHERE id = $2`, [item.qty, item.product_id]);
        }

        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-success&order=${orderNumber}`);
    } catch (err) {
        console.error('paymentSuccess error:', err);
        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=unknown`);
    }
};

// POST /api/shop/payu/failure
const paymentFailure = async (req, res) => {
    try {
        const payuResponse = req.body;
        console.log('[PayU Failure]', payuResponse);

        const orderNumber = payuResponse.txnid;
        await pool.query(
            `UPDATE shop_orders SET payment_status = 'failed', payu_response = $1, updated_at = NOW()
             WHERE order_number = $2`,
            [JSON.stringify(payuResponse), orderNumber]
        );

        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=${orderNumber}`);
    } catch (err) {
        console.error('paymentFailure error:', err);
        res.redirect(`${FRONTEND_URL}?page=Shop&sub=order-failed&order=unknown`);
    }
};

module.exports = { initiatePayment, paymentSuccess, paymentFailure };
