"use client";
import React, { useState, useEffect } from "react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { name: string; company: string; type: string; ticket: string }) => void;
}

export default function LeadModal({ isOpen, onClose, onSuccess }: LeadModalProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, string> = {};

    const name = formData.get("fullName") as string;
    const company = formData.get("companyName") as string;
    const phone = formData.get("phoneNumber") as string;
    const email = formData.get("workEmail") as string;
    const type = formData.get("projectType") as string;
    const size = formData.get("projectSize") as string;
    const location = formData.get("location") as string;
    const req = formData.get("projectRequirement") as string;

    if (!name || name.trim().length < 2) newErrors.fullName = "Required";
    if (!company || company.trim().length < 2) newErrors.companyName = "Required";
    if (!/^[+0-9\s-]{7,16}$/.test(phone?.trim() || "")) newErrors.phoneNumber = "Invalid phone";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || "")) newErrors.workEmail = "Invalid email";
    if (!type || type.trim() === "") newErrors.projectType = "Required";
    if (!size || size.trim().length < 1) newErrors.projectSize = "Required";
    if (!location || location.trim().length < 2) newErrors.location = "Required";
    if (!req || req.trim().length < 10) newErrors.projectRequirement = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const ticket = "ADR-IND-" + Math.floor(1000 + Math.random() * 9000);
    onSuccess({ name: name.trim(), company: company.trim(), type, ticket });
    e.currentTarget.reset();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white border border-beige-250 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl p-6 sm:p-8">
          
          {/* Close Button */}
          <button 
            type="button" 
            onClick={onClose} 
            className="absolute top-5 right-5 text-arch-muted hover:text-arch-ink p-2 rounded-lg hover:bg-beige-100 transition-colors focus:outline-none"
            aria-label="Close modal">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Modal Header */}
          <div className="mb-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-lightblue-600 block mb-1">START YOUR INDUSTRIAL PROJECT</span>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-arch-ink tracking-tight">Tell Us About Your Industrial Facility</h2>
            <p className="text-sm text-arch-steel mt-1">
              Share your project requirements with our engineering team. We'll review your requirement and get back to you with the appropriate next steps.
            </p>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-name" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Full Name *</label>
                <input type="text" id="modal-name" name="fullName" placeholder="Enter your full name" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.fullName ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
              <div>
                <label htmlFor="modal-company" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Company Name *</label>
                <input type="text" id="modal-company" name="companyName" placeholder="Enter your company name" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.companyName ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="modal-phone" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Phone Number *</label>
                <input type="tel" id="modal-phone" name="phoneNumber" placeholder="Enter your phone number" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.phoneNumber ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
              <div>
                <label htmlFor="modal-email" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Work Email *</label>
                <input type="email" id="modal-email" name="workEmail" placeholder="Enter your business email" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.workEmail ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="modal-type" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Project Type *</label>
                <select id="modal-type" name="projectType" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.projectType ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}>
                  <option value="">Select Type</option>
                  <option value="Manufacturing Plant">Manufacturing Plant</option>
                  <option value="Industrial Warehouse">Industrial Warehouse</option>
                  <option value="PEB Structure">PEB Structure</option>
                  <option value="Process Facility">Process Facility</option>
                  <option value="Industrial Campus">Industrial Campus</option>
                  <option value="Utility Building">Utility Building</option>
                  <option value="Specialized Industrial Project">Specialized Project</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="modal-size" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Approx Size (sq. ft.) *</label>
                <input type="text" id="modal-size" name="projectSize" placeholder="Approx. sq. ft." className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.projectSize ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
              <div>
                <label htmlFor="modal-location" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Location *</label>
                <input type="text" id="modal-location" name="location" placeholder="Project location" className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 ${errors.location ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`} />
              </div>
            </div>

            <div>
              <label htmlFor="modal-req" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-1">Project Requirement *</label>
              <textarea id="modal-req" name="projectRequirement" rows={3} placeholder="Tell us about your project requirements..." className={`w-full px-3.5 py-2.5 border rounded-lg text-arch-ink placeholder-arch-muted text-sm focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 resize-y ${errors.projectRequirement ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}></textarea>
            </div>

            <div className="pt-3">
              <button 
                type="submit" 
                className="w-full inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-lightblue-500 hover:bg-lightblue-600 rounded-lg transition-all shadow-lg shadow-lightblue-500/25 border border-lightblue-400/50 active:scale-95 cursor-pointer">
                <span>Request a Consultation</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
