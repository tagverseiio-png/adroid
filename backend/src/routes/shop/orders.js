const express = require('express');
const router  = express.Router();
const {
    createOrder, getAll, getStats, getByOrderNumber,
    updateStatus, cancelOrder, triggerShipment, lookupOrder,
    generateLabelForOrder, generateInvoiceForOrder, syncShiprocketStatus
} = require('../../controllers/shop/orderController');
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

// ── Public ────────────────────────────────────────────────────────────────────

// Customer creates an order (rate limited in app.js at 20/10min)
router.post('/', createOrder);

// Customer self-lookup by order number + email — no PII leak without both
router.get('/lookup', lookupOrder);

// ── Admin Only ────────────────────────────────────────────────────────────────
// All admin routes require a valid token AND admin role

router.get('/stats',      auth, requireAdmin, getStats);
router.get('/admin/all',  auth, requireAdmin, getAll);

// Get single order — protected: must be admin OR owner (handled inside controller)
// We protect it with auth so unauthenticated strangers can't enumerate orders
router.get('/:orderNumber', auth, getByOrderNumber);

router.patch('/:id/status',          auth, requireAdmin, updateStatus);
router.patch('/:id/cancel',          auth, requireAdmin, cancelOrder);
router.post('/:id/create-shipment',  auth, requireAdmin, triggerShipment);
router.post('/:id/generate-label',   auth, requireAdmin, generateLabelForOrder);
router.post('/:id/generate-invoice', auth, requireAdmin, generateInvoiceForOrder);
router.post('/:id/sync-shiprocket',  auth, requireAdmin, syncShiprocketStatus);

module.exports = router;
