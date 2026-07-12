import React, { useState } from "react";

export default function LeadFormModal({ isOpen, onClose, data = {} }) {
  const [loading, setLoading] = useState(false);
  
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
      category: e.target.category.value,
      brief: e.target.brief.value,
      source: data?.source || 'Landing Page - Modal Form'
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
        window.location.href = "/thank-you";
      } else {
        alert("Failed to submit inquiry. Please try again or contact us directly.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

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
          {/* Row 1 */}
          <div className="qe-row">
            <div className="qe-field">
              <input type="text" name="name" placeholder="Full Name" required />
            </div>
            <div className="qe-field">
              <input type="email" name="email" placeholder="Email Address" required />
            </div>
          </div>

          {/* Row 2 */}
          <div className="qe-row">
            <div className="qe-field">
              <input type="tel" name="phone" placeholder="Phone Number" required />
            </div>
            <div className="qe-field">
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

          {/* Row 3 — full width */}
          <div className="qe-field qe-field--full">
            <textarea name="brief" placeholder="Message / Specifications" rows={4} />
          </div>

          {/* Submit */}
          <button type="submit" className="qe-submit" disabled={loading}>
            {loading ? "SENDING..." : "SEND INQUIRY →"}
          </button>
        </form>
      </div>
    </div>
  );
}
