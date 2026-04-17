const express = require('express');
const router  = express.Router();
const { create, getByProduct, getAll, approve, deleteReview } = require('../../controllers/shop/reviewController');
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

// ── Public ────────────────────────────────────────────────────────────────────
// Review creation is rate limited in app.js (20/10min)
router.post('/', create);
router.get('/product/:productId', getByProduct);

// ── Admin Only ────────────────────────────────────────────────────────────────
router.get('/admin/all',    auth, requireAdmin, getAll);
router.patch('/:id/approve',auth, requireAdmin, approve);
router.delete('/:id',       auth, requireAdmin, deleteReview);

module.exports = router;
