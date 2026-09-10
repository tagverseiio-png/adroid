import { useState, useRef } from "react";

export default function ConsultationModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  if (!isOpen) return null;

  function validate(data) {
    const errs = {};
    const name = data.get("fullName");
    const phone = data.get("phone");
    const email = data.get("email");
    const type = data.get("projectType");
    if (!name?.trim()) errs.fullName = "Please enter your full name.";
    if (!phone?.trim() || phone.trim().length < 7) errs.phone = "Please enter a valid phone number.";
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address.";
    if (!type) errs.projectType = "Please select a project type.";
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errs = validate(data);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setErrors({});
      formRef.current?.reset();
    }, 300);
  }

  return (
    <div
      className="fixed inset-0 z-50 modal-overlay flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-[#FBF9F5] border border-[#ECE7DF] w-full max-w-xl rounded-2xl p-6 sm:p-8 shadow-2xl relative modal-enter my-auto">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#66605B] hover:text-[#2C1D11] bg-[#ECE7DF]/50 hover:bg-[#ECE7DF] p-2 rounded-full transition-colors"
          aria-label="Close Modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted ? (
          <>
            {/* Form Header */}
            <div className="text-center mb-6">
              <span className="text-[11px] font-semibold text-[#B85A32] tracking-widest uppercase block mb-1">
                START YOUR HOME PROJECT
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#2C1D11]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Get Free Consultation
              </h3>
              <p className="text-[#66605B] text-xs sm:text-sm mt-1">
                &ldquo;Tell us about your home. We&apos;ll send a plan, not a sales pitch.&rdquo;
              </p>
            </div>

            {/* Form */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#2C1D11] mb-1">
                  Full Name <span className="text-[#B85A32]">*</span>
                </label>
                <input
                  type="text" name="fullName"
                  className={`w-full bg-white border ${errors.fullName ? "border-red-500" : "border-[#ECE7DF]"} focus:border-[#B85A32] focus:ring-1 focus:ring-[#B85A32] rounded-md px-4 py-3 text-sm text-[#242220] outline-none transition-colors`}
                />
                {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#2C1D11] mb-1">
                    Phone Number <span className="text-[#B85A32]">*</span>
                  </label>
                  <input
                    type="tel" name="phone"
                    className={`w-full bg-white border ${errors.phone ? "border-red-500" : "border-[#ECE7DF]"} focus:border-[#B85A32] focus:ring-1 focus:ring-[#B85A32] rounded-md px-4 py-3 text-sm text-[#242220] outline-none transition-colors`}
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#2C1D11] mb-1">
                    Email Address <span className="text-[#B85A32]">*</span>
                  </label>
                  <input
                    type="email" name="email"
                    className={`w-full bg-white border ${errors.email ? "border-red-500" : "border-[#ECE7DF]"} focus:border-[#B85A32] focus:ring-1 focus:ring-[#B85A32] rounded-md px-4 py-3 text-sm text-[#242220] outline-none transition-colors`}
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#2C1D11] mb-1">
                  Project Type <span className="text-[#B85A32]">*</span>
                </label>
                <select
                  name="projectType"
                  className={`w-full bg-white border ${errors.projectType ? "border-red-500" : "border-[#ECE7DF]"} focus:border-[#B85A32] focus:ring-1 focus:ring-[#B85A32] rounded-md px-4 py-3 text-sm text-[#242220] outline-none transition-colors`}
                >
                  <option value="">Select project type</option>
                  <option>Independent House</option>
                  <option>Villa</option>
                  <option>Apartment Interior</option>
                  <option>Home Renovation</option>
                  <option>Turnkey Construction</option>
                  <option>Residential Architecture</option>
                </select>
                {errors.projectType && <p className="text-xs text-red-600 mt-1">{errors.projectType}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#2C1D11] mb-1">
                  Project Requirement
                </label>
                <textarea
                  name="requirement" rows={3}
                  className="w-full bg-white border border-[#ECE7DF] focus:border-[#B85A32] focus:ring-1 focus:ring-[#B85A32] rounded-md px-4 py-2.5 text-sm text-[#242220] outline-none transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-sm py-3.5 rounded-md shadow transition-all uppercase tracking-wider"
                >
                  Get Free Consultation
                </button>
              </div>
              <p className="text-center text-[11px] text-[#66605B] leading-tight mt-2">
                &ldquo;We reply within 1 business day. Your details are used only to contact you regarding this enquiry.&rdquo;
              </p>
            </form>
          </>
        ) : (
          /* Thank You Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-14 h-14 bg-[#B85A32]/10 text-[#B85A32] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#2C1D11]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Thank You!
            </h3>
            <p className="text-sm font-semibold text-[#B85A32]">Your enquiry has been received.</p>
            <p className="text-[#66605B] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              &ldquo;Thank you for contacting Adroit Designs. Our team will review your requirements and get back to you within one business day.&rdquo;
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:+919940064343"
                className="w-full sm:w-auto bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-xs px-5 py-3 rounded shadow transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now: +91 99400 64343
              </a>
              <button
                onClick={handleClose}
                className="w-full sm:w-auto border border-[#2C1D11] text-[#2C1D11] hover:bg-[#2C1D11] hover:text-white font-semibold text-xs px-5 py-3 rounded transition-all uppercase tracking-wider"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
