const express = require('express');
const router  = express.Router();
const { getAll, create, update, remove } = require('../../controllers/shop/pickupLocationsController');
const { getPickupLocations } = require('../../controllers/shop/shiprocketController');
const auth = require('../../middleware/auth');

// GET /api/shop/pickup-locations — public (needed by admin frontend initiating shipments)
router.get('/', auth, getAll);

// GET /api/shop/pickup-locations/shiprocket — fetch live from Shiprocket API
router.get('/shiprocket', auth, getPickupLocations);

// Admin only
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
