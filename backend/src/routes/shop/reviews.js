const express = require('express');
const router = express.Router();
const { create, getByProduct, getAll, approve, deleteReview } = require('../../controllers/shop/reviewController');
const auth = require('../../middleware/auth');

// Public
router.post('/', create);
router.get('/product/:productId', getByProduct);

// Admin
router.get('/admin/all', auth, getAll);
router.patch('/:id/approve', auth, approve);
router.delete('/:id', auth, deleteReview);

module.exports = router;
