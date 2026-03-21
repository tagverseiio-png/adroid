const express = require('express');
const router = express.Router();
const {
    createOrder, getAll, getStats, getByOrderNumber,
    updateStatus, cancelOrder, triggerShipment, lookupOrder
} = require('../../controllers/shop/orderController');
const auth = require('../../middleware/auth');

// Public
router.post('/', createOrder);
router.get('/lookup', lookupOrder); // ?order_number= &email=
router.get('/stats', auth, getStats);
router.get('/admin/all', auth, getAll);
router.get('/:orderNumber', getByOrderNumber);

// Admin
router.patch('/:id/status', auth, updateStatus);
router.patch('/:id/cancel', auth, cancelOrder);
router.post('/:id/create-shipment', auth, triggerShipment);

module.exports = router;
