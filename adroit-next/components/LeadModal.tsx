'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useModal } from './ModalContext';

export default function LeadModal() {
  const { isOpen, closeModal } = useModal();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    const fields = [
      { id: 'fullName', type: 'text' },
      { id: 'companyName', type: 'text' },
      { id: 'mobile', type: 'phone' },
      { id: 'email', type: 'email' },
      { id: 'location', type: 'text' },
      { id: 'area', type: 'text' },
      { id: 'projectType', type: 'select' },
    ];

    fields.forEach((field) => {
      const val = formData.get(field.id)?.toString().trim() || '';
      let fieldValid = true;

      if (field.type === 'text' || field.type === 'select') {
        if (!val) fieldValid = false;
      } else if (field.type === 'email') {
        if (!val || !validateEmail(val)) fieldValid = false;
      } else if (field.type === 'phone') {
        if (!val || !validatePhone(val)) fieldValid = false;
      }

      if (!fieldValid) {
        newErrors[field.id] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitted(true);
    }
  };

  const handleCloseAndReset = () => {
    closeModal();
    setTimeout(() => {
      setIsSubmitted(false);
      setErrors({});
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-300" onClick={handleCloseAndReset} />

      {/* Modal Content */}
      <div className="relative z-10 bg-brand-surface border border-brand-border w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl transition-all my-8 max-h-[90vh] overflow-y-auto">
        
        <button
          type="button"
          onClick={handleCloseAndReset}
          aria-label="Close modal"
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-lg hover:bg-brand-dark/80 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!isSubmitted ? (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold block mb-1">Start Your Project</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Discuss Your Commercial Space</h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">Submit your specifications for turnkey execution and commercial fit-out consultation.</p>
            </div>

            <form noValidate onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="modal-fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-fullName"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-400 mt-1">Full name is required.</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="modal-companyName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Company Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-companyName"
                    name="companyName"
                    placeholder="e.g. Apex Enterprise Technologies"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.companyName ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.companyName && <p className="text-xs text-rose-400 mt-1">Company name is required.</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="modal-mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Mobile Number <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    id="modal-mobile"
                    name="mobile"
                    placeholder="+91 98765 43210"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.mobile ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.mobile && <p className="text-xs text-rose-400 mt-1">Valid 10-digit mobile number required.</p>}
                </div>

                {/* Official Email */}
                <div>
                  <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Official Email <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="email"
                    id="modal-email"
                    name="email"
                    placeholder="name@company.com"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1">Valid official email is required.</p>}
                </div>

                {/* Project Location */}
                <div>
                  <label htmlFor="modal-location" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Location <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-location"
                    name="location"
                    placeholder="City / Region"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.location ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.location && <p className="text-xs text-rose-400 mt-1">Project location is required.</p>}
                </div>

                {/* Approximate Area */}
                <div>
                  <label htmlFor="modal-area" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Approximate Area (Sq.Ft.) <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="modal-area"
                    name="area"
                    placeholder="e.g. 20,000 Sq.Ft."
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.area ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.area && <p className="text-xs text-rose-400 mt-1">Approximate area is required.</p>}
                </div>

                {/* Project Type */}
                <div className="sm:col-span-2">
                  <label htmlFor="modal-projectType" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Type <span className="text-brand-gold">*</span>
                  </label>
                  <select
                    id="modal-projectType"
                    name="projectType"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.projectType ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  >
                    <option value="">Select Project Type</option>
                    <option value="Corporate Office Interior">Corporate Office Interior</option>
                    <option value="Turnkey Fit-Out & Build">Turnkey Fit-Out &amp; Build</option>
                    <option value="Commercial Retail Showroom">Commercial Retail Showroom</option>
                    <option value="Hospitality Facility">Hospitality Facility</option>
                    <option value="Healthcare Center Fit-Out">Healthcare Center Fit-Out</option>
                    <option value="Workspace Renovation & Refurbishment">Workspace Renovation &amp; Refurbishment</option>
                  </select>
                  {errors.projectType && <p className="text-xs text-rose-400 mt-1">Please select a project type.</p>}
                </div>

                {/* Project Requirements */}
                <div className="sm:col-span-2">
                  <label htmlFor="modal-requirements" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Project Requirements
                  </label>
                  <textarea
                    id="modal-requirements"
                    name="requirements"
                    rows={2}
                    placeholder="Key project objectives or specifications..."
                    className="w-full bg-brand-dark/90 border border-brand-border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

              </div>

              {/* Modal Submit Button */}
              <div className="mt-6 pt-4 border-t border-brand-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseAndReset}
                  className="px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-all shadow-glow"
                >
                  Discuss My Project
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-10 px-4">
            <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold text-brand-gold flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-extrabold text-white tracking-tight mb-3">Thank You!</h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
              Thank you for reaching out to Adroit Design. Our team will review your project details and get in touch with you shortly.
            </p>
            <button
              type="button"
              onClick={handleCloseAndReset}
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-colors shadow-glow"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
