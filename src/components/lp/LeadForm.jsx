import React, { useState } from "react";

export default function LeadForm({ onSuccess, landingPageSlug, data = {} }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { cta_text = "DISCUSS MY PROJECT" } = data;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.target);
    const payload = {
      landing_page_slug: landingPageSlug || window.__landingPageSlug || "unknown",
      name: formData.get("name"),
      company: formData.get("company"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: `Location: ${formData.get("location") || "-"} | Area: ${formData.get("area") || "-"} | ${formData.get("message") || ""}`.trim(),
      source: typeof window !== "undefined" ? window.location.href : "",
    };

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://api.adroitdesigns.in";
      const res = await fetch(`${apiUrl}/api/lp-leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit form.");
      
      if (onSuccess) {
        onSuccess();
      } else {
        alert("Thank you! Your details have been submitted successfully.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="qe-form" onSubmit={handleSubmit}>
      <div className="qe-row">
        <div className="qe-field">
          <input type="text" name="name" placeholder="Name" required />
        </div>
        <div className="qe-field">
          <input type="text" name="company" placeholder="Company Name" required />
        </div>
      </div>
      <div className="qe-row">
        <div className="qe-field">
          <input type="tel" name="phone" placeholder="Mobile Number" required />
        </div>
        <div className="qe-field">
          <input type="email" name="email" placeholder="Official Email" required />
        </div>
      </div>
      <div className="qe-field qe-field--full">
        <input type="text" name="location" placeholder="Project Location" required />
      </div>
      <div className="qe-field qe-field--full">
        <input type="text" name="area" placeholder="Approximate Project Area" />
      </div>
      <div className="qe-field qe-field--full">
        <textarea name="message" placeholder="Brief Project Requirement" rows={4} />
      </div>
      {error && <p style={{ color: "#c0392b", fontSize: "13px", marginTop: "-8px" }}>{error}</p>}
      <button type="submit" className="qe-submit" disabled={loading}>
        {loading ? "SENDING…" : cta_text}
      </button>
    </form>
  );
}
