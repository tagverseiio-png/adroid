import React, { useState } from "react";

export default function LeadForm({ data = {}, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Optional pre-filled data passed down for context (e.g. tracking source)
  const source = data?.source || 'Landing Page - Contact Section';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = {
      name: e.target.name.value,
      company: e.target.company.value,
      phone: e.target.phone.value,
      email: e.target.email.value,
      location: e.target.location.value,
      area: e.target.area.value,
      brief: e.target.brief.value,
      source: source
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
        if (onSuccess) onSuccess();
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

  if (success) {
    return <div className="qe-success" style={{ padding: '2rem', textAlign: 'center', background: '#e8f5e9', color: '#2e7d32', borderRadius: '8px' }}>Thank you! We will get in touch with you shortly.</div>;
  }

  return (
    <form className="qe-form" onSubmit={handleSubmit}>
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

      {/* Submit */}
      <button type="submit" className="qe-submit" disabled={loading}>
        {loading ? "SUBMITTING..." : "DISCUSS MY PROJECT"}
      </button>
    </form>
  );
}
