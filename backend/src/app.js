const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const compression = require('compression');
const path       = require('path');
const rateLimit  = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy for accurate client IP when behind a reverse proxy (nginx/caddy)
app.set('trust proxy', process.env.TRUST_PROXY || 1);

// ── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ── CORS ─────────────────────────────────────────────────────────────────────
const corsOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

// Always allow PayU to POST to our success/failure callbacks (their servers are not in our CORS list)
const payuCallbackPaths = ['/api/shop/payu/success', '/api/shop/payu/failure'];

app.use((req, res, next) => {
    if (payuCallbackPaths.includes(req.path) && req.method === 'POST') {
        return next(); // PayU server-to-server POST — skip CORS
    }
    cors({
        origin: corsOrigins.length ? corsOrigins : false,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
        maxAge: 86400,
    })(req, res, next);
});

// ── Compression ───────────────────────────────────────────────────────────────
app.use(compression());

// ── Body Parsers ─────────────────────────────────────────────────────────────
// 64kb is more than enough for any JSON payload in this API
// File uploads use multipart (handled separately in upload routes)
app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// ── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    maxAge: '1y',
    etag: true,
}));

// ── Rate Limiting ─────────────────────────────────────────────────────────────

// Global: 100 req / 15 min per IP
const globalLimiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max:      parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Strict: 5 req / 10 min per IP — for sensitive endpoints (coupon brute-force, auth)
const strictLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max:      5,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many attempts. Please wait 10 minutes and try again.' },
});

// Moderate: 20 req / 10 min — for order creation, reviews
const moderateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max:      20,
    standardHeaders: true,
    legacyHeaders:   false,
    message: { success: false, message: 'Too many requests on this endpoint. Please slow down.' },
});

app.use('/api/', globalLimiter);

// ── Health Check ──────────────────────────────────────────────────────────────
// Does not expose environment/stack info
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: Math.floor(process.uptime()) });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/projects',  require('./routes/projects'));
app.use('/api/blog',      require('./routes/blog'));
app.use('/api/inquiries', require('./routes/inquiries'));
app.use('/api/upload',    require('./routes/upload'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/odoo',      require('./routes/odoo'));
app.use('/api/jobs',      require('./routes/jobs'));

// ── Shop API Routes ───────────────────────────────────────────────────────────
app.use('/api/shop/products',         require('./routes/shop/products'));
app.use('/api/shop/categories',       require('./routes/shop/categories'));

// Order creation: moderate rate limit (prevent order spam)
app.use('/api/shop/orders',           moderateLimiter, require('./routes/shop/orders'));

// Coupon validate: strict rate limit (prevent brute-force)
app.use('/api/shop/coupons',          require('./routes/shop/coupons'));

app.use('/api/shop/payu',             require('./routes/shop/payu'));

// Review creation: moderate rate limit
app.use('/api/shop/reviews',          moderateLimiter, require('./routes/shop/reviews'));

app.use('/api/shop/pickup-locations', require('./routes/shop/pickupLocations'));

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found', path: req.path });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
