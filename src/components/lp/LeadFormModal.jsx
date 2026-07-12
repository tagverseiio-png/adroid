import React from "react";
import LeadForm from "./LeadForm";

export default function LeadFormModal({ isOpen, onClose, data }) {
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

        {/* Form component */}
        <LeadForm 
          onSuccess={() => {
            onClose();
            alert("Thank you! Your details have been submitted successfully.");
          }} 
          data={data} 
        />
      </div>
    </div>
  );
}
