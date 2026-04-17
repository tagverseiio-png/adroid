const express    = require('express');
const router     = express.Router();
const rateLimit  = require('express-rate-limit');
const { validate, getAll, create, update, deleteCoupon } = require('../../controllers/shop/couponController');
const auth = require('../../middleware/auth');
const { requireAdmin } = require('../../middleware/auth');

// Targeted rate limit for coupon validation: 5 attempts per 10 minutes per IP
// Prevents brute-forcing coupon codes
const couponValidateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 min
    max:      5,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many coupon attempts. Please wait 10 minutes.' },
    keyGenerator: (req) => req.ip + (req.body?.code || ''), // Key by IP + code being tried
});

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/validate', couponValidateLimiter, validate);

// ── Admin Only ────────────────────────────────────────────────────────────────
router.get('/',      auth, requireAdmin, getAll);
router.post('/',     auth, requireAdmin, create);
router.put('/:id',   auth, requireAdmin, update);
router.delete('/:id',auth, requireAdmin, deleteCoupon);

module.exports = router;
