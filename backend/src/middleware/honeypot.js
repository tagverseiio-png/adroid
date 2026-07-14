/**
 * honeypot.js — Hidden honeypot field bot-trap middleware
 *
 * All enquiry forms include a hidden text input named "website" that is
 * invisible to human users (hidden via CSS/tabindex). Bots that auto-fill
 * forms will populate this field, triggering a silent drop here.
 *
 * The response is a fake 200 OK to confuse bots into thinking the submission
 * was successful (so they don't retry or escalate).
 */

const honeypotMiddleware = (req, res, next) => {
    const honeypotValue = req.body.website;

    // If the honeypot field was filled, this is almost certainly a bot
    if (honeypotValue && honeypotValue.trim().length > 0) {
        const ip = req.ip || req.connection.remoteAddress;
        const ua = req.headers['user-agent'] || 'unknown';
        console.warn(`[honeypot] 🤖 Bot submission detected and dropped. IP: ${ip} | UA: ${ua} | Value: "${honeypotValue.trim().substring(0, 100)}"`);

        // Return a fake success to confuse the bot (don't let it know it was blocked)
        return res.status(200).json({
            success: true,
            message: 'Inquiry submitted successfully',
        });
    }

    // Clean honeypot field from body before passing to next middleware
    delete req.body.website;

    return next();
};

module.exports = honeypotMiddleware;
