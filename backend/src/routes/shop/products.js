const express = require('express');
const router = express.Router();
const {
    getAll, getBySlug, getAdminAll, create, update,
    togglePublish, toggleFeatured, deleteProduct
} = require('../../controllers/shop/productController');
const auth = require('../../middleware/auth');

// Public
router.get('/', getAll);
router.get('/admin/all', auth, getAdminAll);
router.get('/:slug', getBySlug);

// Admin
router.post('/', auth, create);
router.put('/:id', auth, update);
router.patch('/:id/publish', auth, togglePublish);
router.patch('/:id/featured', auth, toggleFeatured);
router.delete('/:id', auth, deleteProduct);

module.exports = router;
