const express = require('express');
const router  = express.Router();
const {
    getAll, getBySlug, getAdminAll, create, update,
    togglePublish, toggleFeatured, deleteProduct
} = require('../../controllers/shop/productController');
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

// ── Public ────────────────────────────────────────────────────────────────────
router.get('/', getAll);
router.get('/admin/all', auth, requireAdmin, getAdminAll);
router.get('/:slug',     getBySlug);

// ── Admin: Write ──────────────────────────────────────────────────────────────
router.post('/',                  auth, requireAdmin, create);
router.put('/:id',                auth, requireAdmin, update);
router.patch('/:id/publish',      auth, requireAdmin, togglePublish);
router.patch('/:id/featured',     auth, requireAdmin, toggleFeatured);
router.delete('/:id',             auth, requireAdmin, deleteProduct);

module.exports = router;
