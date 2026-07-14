/**
 * captcha.js — Cloudflare Turnstile server-side verification middleware
 *
 * Reads cf_turnstile_response from the request body, verifies it against
 * the Cloudflare siteverify endpoint using the secret key, and rejects
 * requests that fail verification.
 *
 * Set CAPTCHA_ENABLED=false in .env to disable in development.
 */

const https = require('https');
const querystring = require('querystring');

/**
 * Verify a Cloudflare Turnstile token server-side.
 * @param {string} token - The cf-turnstile-response token from the client
 * @param {string} remoteip - The submitter's IP address (optional but recommended)
 * @returns {Promise<{success: boolean, 'error-codes': string[]}>}
 */
function verifyTurnstileToken(token, remoteip) {
    return new Promise((resolve, reject) => {
        const secret = process.env.TURNSTILE_SECRET_KEY || '';

        const postData = querystring.stringify({
            secret,
            response: token,
            remoteip,
        });

        const options = {
            hostname: 'challenges.cloudflare.com',
            port: 443,
            path: '/turnstile/v0/siteverify',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error('Invalid JSON from Turnstile API'));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy(new Error('Turnstile API request timed out'));
        });
        req.write(postData);
        req.end();
    });
}

/**
 * Express middleware that enforces Cloudflare Turnstile CAPTCHA verification.
 * Token must be sent as `cf_turnstile_response` in the request body.
 */
const captchaMiddleware = async (req, res, next) => {
    // Allow bypass in development or if explicitly disabled
    if (process.env.CAPTCHA_ENABLED === 'false' || process.env.NODE_ENV === 'development') {
        console.log('[captcha] Skipped (CAPTCHA_ENABLED=false or dev mode)');
        return next();
    }

    // If no secret key configured, skip with a warning
    if (!process.env.TURNSTILE_SECRET_KEY) {
        console.warn('[captcha] TURNSTILE_SECRET_KEY not set — skipping captcha check');
        return next();
    }

    const token = req.body.cf_turnstile_response;

    if (!token) {
        console.warn('[captcha] Missing cf_turnstile_response token from', req.ip);
        return res.status(403).json({
            success: false,
            message: 'CAPTCHA verification required. Please complete the security check and try again.',
        });
    }

    try {
        const remoteip = req.ip || req.connection.remoteAddress;
        const result = await verifyTurnstileToken(token, remoteip);

        if (!result.success) {
            const codes = (result['error-codes'] || []).join(', ');
            console.warn(`[captcha] Verification failed from ${remoteip}. Codes: ${codes}`);
            return res.status(403).json({
                success: false,
                message: 'CAPTCHA verification failed. Please refresh the page and try again.',
            });
        }

        console.log(`[captcha] Verified successfully for ${remoteip}`);
        // Remove token from body to keep payloads clean
        delete req.body.cf_turnstile_response;
        return next();
    } catch (err) {
        // If Cloudflare is unreachable, fail open with a warning log (avoid blocking real users)
        console.error('[captcha] Turnstile API error:', err.message);
        // Fail open — let request through but log it
        return next();
    }
};

module.exports = captchaMiddleware;
