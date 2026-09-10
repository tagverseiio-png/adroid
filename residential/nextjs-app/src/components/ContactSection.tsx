interface ContactSectionProps {
  onOpenModal: () => void;
}

export default function ContactSection({ onOpenModal }: ContactSectionProps) {
  return (
    <section id="contact" className="py-16 lg:py-24 bg-white border-b border-[#ECE7DF] scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FBF9F5] border border-[#ECE7DF] rounded-2xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          <span className="text-xs font-semibold text-[#B85A32] tracking-widest uppercase block">
            START YOUR HOME PROJECT
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#2C1D11] max-w-2xl mx-auto" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Design &amp; Build Your Dream Home?
          </h2>

          <p className="text-[#66605B] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            &ldquo;Click below to request your free architectural consultation. Our team will review your project brief and get back to you within one business day.&rdquo;
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenModal}
              className="w-full sm:w-auto bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-base px-8 py-4 rounded shadow-md transition-all uppercase tracking-wider"
            >
              Get Free Consultation
            </button>
            <a
              href="tel:+919940064343"
              className="w-full sm:w-auto bg-[#2C1D11] hover:bg-[#1F140B] text-white font-semibold text-base px-8 py-4 rounded shadow-md transition-all uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now: +91 99400 64343
            </a>
          </div>

          <div className="pt-6 border-t border-[#ECE7DF]/80 text-xs text-[#66605B]">
            Instant Response · Direct Architect Advice · Zero Spam
          </div>
        </div>
      </div>
    </section>
  );
}
