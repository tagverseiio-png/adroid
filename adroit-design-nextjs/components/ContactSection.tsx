"use client";
import React, { useState } from "react";

interface ContactSectionProps {
  onSuccess: (data: { name: string; company: string; type: string; ticket: string }) => void;
}

export default function ContactSection({ onSuccess }: ContactSectionProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

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

    if (!name || name.trim().length < 2) newErrors.fullName = "Please enter your full name.";
    if (!company || company.trim().length < 2) newErrors.companyName = "Please enter your company name.";
    if (!/^[+0-9\s-]{7,16}$/.test(phone?.trim() || "")) newErrors.phoneNumber = "Enter a valid phone number (min 7 digits).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() || "")) newErrors.workEmail = "Enter a valid work email address.";
    if (!type || type.trim() === "") newErrors.projectType = "Please select an industrial project type.";
    if (!size || size.trim().length < 1) newErrors.projectSize = "Please provide approximate square footage.";
    if (!location || location.trim().length < 2) newErrors.location = "Please enter the project location.";
    if (!req || req.trim().length < 10) newErrors.projectRequirement = "Please describe requirements (min 10 characters).";

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
    <section id="lead-form-section" className="py-20 lg:py-28 bg-beige-200 border-b border-beige-250 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-lightblue-600 block mb-3">START YOUR INDUSTRIAL PROJECT</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-arch-ink tracking-tight mb-4">Tell Us About Your Industrial Facility</h2>
          <p className="text-base sm:text-lg text-arch-steel leading-relaxed">
            Share your project requirements with our engineering team. We'll review your requirement and get back to you with the appropriate next steps.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-beige-250 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-lightblue-100/60 rounded-full blur-2xl pointer-events-none"></div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="onpage-name" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Full Name <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="text" id="onpage-name" name="fullName" placeholder="Enter your full name" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.fullName ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.fullName && <p className="text-xs text-rose-600 font-mono mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="onpage-company" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Company Name <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="text" id="onpage-company" name="companyName" placeholder="Enter your company name" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.companyName ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.companyName && <p className="text-xs text-rose-600 font-mono mt-1">{errors.companyName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="onpage-phone" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Phone Number <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="tel" id="onpage-phone" name="phoneNumber" placeholder="Enter your phone number" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.phoneNumber ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.phoneNumber && <p className="text-xs text-rose-600 font-mono mt-1">{errors.phoneNumber}</p>}
              </div>
              <div>
                <label htmlFor="onpage-email" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Work Email <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="email" id="onpage-email" name="workEmail" placeholder="Enter your business email" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.workEmail ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.workEmail && <p className="text-xs text-rose-600 font-mono mt-1">{errors.workEmail}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="onpage-type" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Project Type <span className="text-lightblue-600">*</span>
                </label>
                <select 
                  id="onpage-type" name="projectType" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.projectType ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}>
                  <option value="">Select Project Type</option>
                  <option value="Manufacturing Plant">Manufacturing Plant</option>
                  <option value="Industrial Warehouse">Industrial Warehouse</option>
                  <option value="PEB Structure">PEB Structure</option>
                  <option value="Process Facility">Process Facility</option>
                  <option value="Industrial Campus">Industrial Campus</option>
                  <option value="Utility Building">Utility Building</option>
                  <option value="Specialized Industrial Project">Specialized Industrial Project</option>
                  <option value="Other">Other</option>
                </select>
                {errors.projectType && <p className="text-xs text-rose-600 font-mono mt-1">{errors.projectType}</p>}
              </div>
              <div>
                <label htmlFor="onpage-size" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Approximate Project Size <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="text" id="onpage-size" name="projectSize" placeholder="Enter approximate sq. ft." 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.projectSize ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.projectSize && <p className="text-xs text-rose-600 font-mono mt-1">{errors.projectSize}</p>}
              </div>
              <div>
                <label htmlFor="onpage-location" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                  Location <span className="text-lightblue-600">*</span>
                </label>
                <input 
                  type="text" id="onpage-location" name="location" placeholder="Enter project location" 
                  className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm ${errors.location ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
                />
                {errors.location && <p className="text-xs text-rose-600 font-mono mt-1">{errors.location}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="onpage-req" className="block text-xs font-mono font-medium text-arch-slate uppercase tracking-wider mb-2">
                Project Requirement <span className="text-lightblue-600">*</span>
              </label>
              <textarea 
                id="onpage-req" name="projectRequirement" rows={4} placeholder="Tell us about your project requirements..." 
                className={`w-full px-4 py-3 border rounded-lg text-arch-ink placeholder-arch-muted focus:outline-none focus:border-lightblue-500 focus:ring-2 focus:ring-lightblue-200 transition-all text-sm resize-y ${errors.projectRequirement ? 'border-rose-500 bg-rose-50' : 'bg-beige-50 border-beige-250'}`}
              ></textarea>
              {errors.projectRequirement && <p className="text-xs text-rose-600 font-mono mt-1">{errors.projectRequirement}</p>}
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white bg-lightblue-500 hover:bg-lightblue-600 rounded-lg transition-all duration-200 shadow-lg shadow-lightblue-500/25 hover:shadow-xl hover:shadow-lightblue-500/35 border border-lightblue-400/50 active:scale-95 cursor-pointer">
                <span>Request a Consultation</span>
                <svg className="w-5 h-5 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
