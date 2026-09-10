'use client';

import { useState, FormEvent } from 'react';

export default function LeadFormSection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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

  return (
    <section id="lead-form-section" className="py-20 lg:py-28 bg-brand-surface/30 relative border-b border-brand-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-3 h-0.5 bg-brand-gold" />
            START YOUR PROJECT
            <span className="w-3 h-0.5 bg-brand-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Planning an Upcoming Corporate or Commercial Interior Project?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Let's discuss how Adroit can design and deliver your next project.
          </p>
        </div>

        {/* Form Card Container */}
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">

          {!isSubmitted ? (
            <form noValidate onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                  <label htmlFor="inp-fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Full Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="inp-fullName"
                    name="fullName"
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.fullName ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.fullName && <p className="text-xs text-rose-400 mt-1.5">Please enter your full name.</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="inp-companyName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Company Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="inp-companyName"
                    name="companyName"
                    placeholder="e.g. Apex Enterprise Technologies"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.companyName ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.companyName && <p className="text-xs text-rose-400 mt-1.5">Please enter your company name.</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="inp-mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Mobile Number <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="tel"
                    id="inp-mobile"
                    name="mobile"
                    placeholder="e.g. +91 98765 43210"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.mobile ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.mobile && <p className="text-xs text-rose-400 mt-1.5">Please provide a valid 10-digit phone number.</p>}
                </div>

                {/* Official Email */}
                <div>
                  <label htmlFor="inp-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Official Email <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="email"
                    id="inp-email"
                    name="email"
                    placeholder="name@company.com"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.email ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.email && <p className="text-xs text-rose-400 mt-1.5">Please enter a valid work email.</p>}
                </div>

                {/* Project Location */}
                <div>
                  <label htmlFor="inp-location" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Location <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="inp-location"
                    name="location"
                    placeholder="e.g. Bengaluru / Chennai / Hyderabad"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.location ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.location && <p className="text-xs text-rose-400 mt-1.5">Please specify the project location.</p>}
                </div>

                {/* Approximate Area */}
                <div>
                  <label htmlFor="inp-area" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Approximate Project Area (Sq.Ft.) <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    id="inp-area"
                    name="area"
                    placeholder="e.g. 15,000 Sq.Ft."
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.area ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  />
                  {errors.area && <p className="text-xs text-rose-400 mt-1.5">Please state the approximate square footage.</p>}
                </div>

                {/* Project Type */}
                <div className="sm:col-span-2">
                  <label htmlFor="inp-projectType" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Type <span className="text-brand-gold">*</span>
                  </label>
                  <select
                    id="inp-projectType"
                    name="projectType"
                    className={`w-full bg-brand-dark/90 border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors ${
                      errors.projectType ? 'border-rose-500' : 'border-brand-border'
                    }`}
                  >
                    <option value="">Select Corporate / Commercial Project Type</option>
                    <option value="Corporate Office Interior">Corporate Office Interior</option>
                    <option value="Turnkey Fit-Out & Build">Turnkey Fit-Out &amp; Build</option>
                    <option value="Commercial Retail Showroom">Commercial Retail Showroom</option>
                    <option value="Hospitality Facility">Hospitality Facility</option>
                    <option value="Healthcare Center Fit-Out">Healthcare Center Fit-Out</option>
                    <option value="Workspace Renovation & Refurbishment">Workspace Renovation &amp; Refurbishment</option>
                  </select>
                  {errors.projectType && <p className="text-xs text-rose-400 mt-1.5">Please select a commercial project type.</p>}
                </div>

                {/* Project Requirements */}
                <div className="sm:col-span-2">
                  <label htmlFor="inp-requirements" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Project Requirements
                  </label>
                  <textarea
                    id="inp-requirements"
                    name="requirements"
                    rows={3}
                    placeholder="Briefly outline your workspace goals, timelines, or specifications..."
                    className="w-full bg-brand-dark/90 border border-brand-border rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>

              </div>

              {/* Submit Button */}
              <div className="mt-8 pt-4 border-t border-brand-border flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-10 py-4 rounded-lg text-xs font-bold uppercase tracking-widest bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-all shadow-glow hover:scale-[1.01] active:scale-95"
                >
                  Discuss My Project
                </button>
              </div>
            </form>
          ) : (
            /* Thank You State */
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold text-brand-gold flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight mb-3">Thank You!</h3>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
                Your project details have been successfully submitted. Our interior execution team will contact you shortly to schedule an initial consultation.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setErrors({});
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-colors shadow-glow"
              >
                Back to Home
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
