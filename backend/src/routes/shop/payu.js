const express = require('express');
const router = express.Router();
const { initiatePayment, paymentSuccess, paymentFailure, verifyPaymentStatus, markOrderPaid } = require('../../controllers/shop/payuController');
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

// POST /api/shop/payu/initiate — called from frontend before redirecting to PayU
router.post('/initiate', initiatePayment);

// PayU POSTs to these after payment
router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

// ── Admin Only ────────────────────────────────────────────────────────────────
// GET  /api/shop/payu/verify/:orderNumber  — query PayU live and auto-fix DB if needed
router.get('/verify/:orderNumber',     auth, requireAdmin, verifyPaymentStatus);
// POST /api/shop/payu/mark-paid/:orderNumber — manually override payment to paid
router.post('/mark-paid/:orderNumber', auth, requireAdmin, markOrderPaid);

module.exports = router;
