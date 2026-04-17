const express = require('express');
const router  = express.Router();
const { getAll, create, update, remove } = require('../../controllers/shop/pickupLocationsController');
const auth = require('../../middleware/auth');

// GET /api/shop/pickup-locations — public (needed by admin frontend initiating shipments)
router.get('/', auth, getAll);

// Admin only
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
