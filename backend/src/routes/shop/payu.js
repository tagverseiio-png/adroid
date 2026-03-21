const express = require('express');
const router = express.Router();
const { initiatePayment, paymentSuccess, paymentFailure } = require('../../controllers/shop/payuController');

// POST /api/shop/payu/initiate — called from frontend before redirecting to PayU
router.post('/initiate', initiatePayment);

// PayU POSTs to these after payment
router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

module.exports = router;
