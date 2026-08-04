import React, { useState, useRef, useEffect } from "react";

// Cloudflare Turnstile site key (public key, safe to expose)
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export default function LeadFormModal({ isOpen, onClose, data = {} }) {
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Render Cloudflare Turnstile widget when modal opens
  // NOTE: All hooks must be declared before any conditional return
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    if (!isOpen) return;

    const renderWidget = () => {
      if (!window.turnstile) return;
      if (widgetIdRef.current != null) return;

      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'light',
        size: 'compact',
        callback: (token) => {
          setTurnstileToken(token);
        },
        'expired-callback': () => {
          setTurnstileToken('');
        },
        'error-callback': () => {
          setTurnstileToken('');
        },
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    // Cleanup on unmount / close
    return () => {
      if (window.turnstile && widgetIdRef.current != null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Require CAPTCHA token if site key is configured
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      alert("Please complete the security check before submitting.");
      setLoading(false);
      return;
    }

    const formData = {
      name: e.target.name.value,
      company: e.target.company?.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      location: e.target.location?.value,
      area: e.target.area?.value,
      category: e.target.category.value,
      brief: e.target.brief.value,
      source: data?.source || 'Landing Page - Modal Form',
      // Honeypot field — always empty for real users
      website: e.target.website.value,
      // Turnstile CAPTCHA token
      cf_turnstile_response: turnstileToken,
    };

    try {
      const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
      const res = await fetch(`${apiUrl}/api/lp-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        e.target.reset();
        setTurnstileToken('');
        if (window.turnstile && widgetIdRef.current != null) {
          window.turnstile.reset(widgetIdRef.current);
        }
        window.location.href = "/thank-you";
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(errorData.message || "Failed to submit inquiry. Please try again or contact us directly.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Early return AFTER all hooks — this is the correct place
  if (!isOpen) return null;

  return (
    <div className="qe-overlay" onClick={onClose}>
      <div className="qe-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="qe-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <h2 className="qe-title">QUICK ENQUIRY</h2>
        <p className="qe-sub">
          If you are interested in any of our services, please submit your basic details below and we will get back to you as soon as possible!
        </p>

        {/* Form */}
        <form className="qe-form" onSubmit={handleSubmit}>
          {/* ── Honeypot trap (hidden from real users, bots fill this) ─────── */}
          <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
            <label htmlFor="lfm-website">Website</label>
            <input
              type="text"
              id="lfm-website"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              placeholder="Leave this blank"
            />
          </div>

          {/* Row 1 */}
          <div className="qe-row">
            <div className="qe-field">
              <input type="text" name="name" placeholder="Full Name" required />
            </div>
            <div className="qe-field">
              <input type="text" name="company" placeholder="Company Name" required />
            </div>
          </div>

          {/* Row 2 */}
          <div className="qe-row">
            <div className="qe-field">
              <input type="tel" name="phone" placeholder="Phone Number" required />
            </div>
            <div className="qe-field">
              <input type="email" name="email" placeholder="Official Email ID" required />
            </div>
          </div>

          {/* Row 3 */}
          <div className="qe-row">
            <div className="qe-field">
              <input type="text" name="location" placeholder="Project Location" required />
            </div>
            <div className="qe-field">
              <input type="text" name="area" placeholder="Approximate Project Area" />
            </div>
          </div>

          {/* Row 4 */}
          <div className="qe-row">
            <div className="qe-field qe-field--full">
              <select name="category" defaultValue="" required>
                <option value="" disabled>Select Category</option>
                <option value="Office Interior Design">Office Interior Design</option>
                <option value="Commercial Interior Design">Commercial Interior Design</option>
                <option value="Turnkey Fit-Out">Turnkey Fit-Out</option>
                <option value="Design & Build">Design &amp; Build</option>
                <option value="Project Management">Project Management</option>
              </select>
            </div>
          </div>

          {/* Row 5 — full width */}
          <div className="qe-field qe-field--full">
            <textarea name="brief" placeholder="Message / Specifications" rows={4} />
          </div>

          {/* ── Cloudflare Turnstile CAPTCHA widget ──────────────────────── */}
          {TURNSTILE_SITE_KEY && (
            <div style={{ marginBottom: '0.75rem' }}>
              <div ref={turnstileRef} />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="qe-submit"
            disabled={loading || (TURNSTILE_SITE_KEY && !turnstileToken)}
          >
            {loading ? "SENDING..." : "SEND INQUIRY →"}
          </button>
        </form>
      </div>
    </div>
  );
}
