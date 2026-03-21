const express = require('express');
const router = express.Router();
const { validate, getAll, create, update, deleteCoupon } = require('../../controllers/shop/couponController');
const auth = require('../../middleware/auth');

// Public
router.post('/validate', validate);

// Admin
router.get('/', auth, getAll);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, deleteCoupon);

module.exports = router;
