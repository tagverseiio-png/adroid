import React, { useState, useRef, useEffect } from "react";

// Cloudflare Turnstile site key (public key, safe to expose)
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

export default function LeadForm({ data = {}, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Optional pre-filled data passed down for context (e.g. tracking source)
  const source = data?.source || 'Landing Page - Contact Section';

  // Render Cloudflare Turnstile widget on mount
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;

    // Wait for the Turnstile script to load
    const renderWidget = () => {
      if (!window.turnstile) return;
      // Avoid double-rendering
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
      // Poll until Turnstile script loads
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if Turnstile is configured and token is present
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      alert("Please complete the security check before submitting.");
      setLoading(false);
      return;
    }

    const formData = {
      name: e.target.name.value,
      company: e.target.company.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      location: e.target.location.value,
      area: e.target.area.value,
      brief: e.target.brief.value,
      source: source,
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
        setSuccess(true);
        e.target.reset();
        setTurnstileToken('');
        // Reset Turnstile widget for next submission
        if (window.turnstile && widgetIdRef.current != null) {
          window.turnstile.reset(widgetIdRef.current);
        }
        if (onSuccess) onSuccess();
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

  if (success) {
    return <div className="qe-success" style={{ padding: '2rem', textAlign: 'center', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px' }}>Thank you! We will get in touch with you shortly.</div>;
  }

  return (
    <form className="qe-form" onSubmit={handleSubmit}>
      {/* ── Honeypot trap (hidden from real users, bots fill this) ─────────── */}
      {/* aria-hidden & tabIndex prevent screen readers / keyboard users from interacting */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', height: 0, overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="lf-website">Website</label>
        <input
          type="text"
          id="lf-website"
          name="website"
          tabIndex="-1"
          autoComplete="off"
          placeholder="Leave this blank"
        />
      </div>

      {/* Row 1 — Name | Company Name */}
      <div className="qe-row">
        <div className="qe-field">
          <input type="text" name="name" placeholder="Name" required />
        </div>
        <div className="qe-field">
          <input type="text" name="company" placeholder="Company Name" required />
        </div>
      </div>

      {/* Row 2 — Mobile | Email */}
      <div className="qe-row">
        <div className="qe-field">
          <input type="tel" name="phone" placeholder="Mobile Number" required />
        </div>
        <div className="qe-field">
          <input type="email" name="email" placeholder="Official Email" required />
        </div>
      </div>

      {/* Row 3 — Project Location */}
      <div className="qe-field qe-field--full">
        <input type="text" name="location" placeholder="Project Location" required />
      </div>

      {/* Row 4 — Project Area */}
      <div className="qe-field qe-field--full">
        <input type="text" name="area" placeholder="Approximate Project Area" />
      </div>

      {/* Row 5 — Brief Requirement */}
      <div className="qe-field qe-field--full">
        <textarea name="brief" placeholder="Brief Project Requirement" rows={4} />
      </div>

      {/* ── Cloudflare Turnstile CAPTCHA widget ────────────────────────────── */}
      {TURNSTILE_SITE_KEY && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div ref={turnstileRef} />
        </div>
      )}

      {/* Submit */}
      <button type="submit" className="qe-submit" disabled={loading || (TURNSTILE_SITE_KEY && !turnstileToken)}>
        {loading ? "SUBMITTING..." : "DISCUSS MY PROJECT"}
      </button>
    </form>
  );
}
