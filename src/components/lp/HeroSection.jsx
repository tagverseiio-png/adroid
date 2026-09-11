export default function HeroSection({ onOpenModal, data = {} }) {
  const {
    eyebrow = "Residential Construction Company",
    headline = "Residential Construction <br />Contractors Chennai",
    sub_headline = "Design &amp; Build Your Dream Home With Adroit Designs",
    body = "&ldquo;Adroit Design designs and builds homes end‑to‑end — residential architecture, interiors and turnkey construction for villas, independent houses and apartments, from the first sketch to the final handover.&rdquo;",
    stats = [
      { label: "15+ Years Experience" },
      { label: "500+ Homes Designed" },
      { label: "End-to-End Solutions" }
    ],
    tags = [
      { label: "Independent Houses" },
      { label: "Villas" },
      { label: "Apartment Interiors" },
      { label: "Home Renovation" },
      { label: "Turnkey Construction" }
    ],
    primary_cta = "Get Free Consultation",
    phone = "+91 99400 64343",
    image_url = "/hero_image.jpeg"
  } = data;

  const phoneLink = phone.replace(/[^0-9+]/g, '');

  return (
    <section id="home" className="scroll-mt-20 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">

          {/* Left: Content */}
          <div className="lg:col-span-6 flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#B85A32] shrink-0"></span>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#2C1D11]" dangerouslySetInnerHTML={{ __html: eyebrow }}></span>
            </div>

            <h1 className="font-bold text-4xl lg:text-5xl text-[#2C1D11] leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }} dangerouslySetInnerHTML={{ __html: headline }}></h1>

            <p className="text-lg font-semibold text-[#B85A32]" dangerouslySetInnerHTML={{ __html: sub_headline }}></p>

            <p className="text-base text-[#66605B] leading-relaxed border-l-4 border-[#ECE7DF] pl-4" dangerouslySetInnerHTML={{ __html: body }}></p>

            {stats && stats.length > 0 && (
              <div className="flex flex-wrap gap-6 text-sm font-semibold text-[#2C1D11] border-l-4 border-[#B85A32] pl-4 py-1">
                {stats.map((s, i) => {
                  const text = typeof s === 'string' ? s : (s.label || s.lbl || s.text || s.value || Object.values(s).find(v => typeof v === 'string') || '');
                  return <span key={i} className={i === 1 ? "text-[#B85A32]" : ""}>{text}</span>;
                })}
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, i) => {
                  const text = typeof tag === 'string' ? tag : (tag.label || tag.lbl || tag.text || tag.value || Object.values(tag).find(v => typeof v === 'string') || '');
                  return (
                    <span key={i} className="text-xs bg-[#ECE7DF]/50 text-[#242220] px-3 py-1 rounded border border-[#ECE7DF]">
                      {text}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenModal}
                className="inline-flex justify-center items-center bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-sm px-8 py-4 rounded shadow-md transition-all text-center uppercase tracking-wider"
              >
                {primary_cta}
              </button>
              <a
                href={`tel:${phoneLink}`}
                className="inline-flex justify-center items-center bg-[#2C1D11] hover:bg-[#1F140B] text-white font-semibold text-sm px-6 py-4 rounded shadow-md transition-all text-center uppercase tracking-wider gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now: {phone}
              </a>
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="lg:col-span-6 order-1 lg:order-2 group">
            <div className="relative min-h-[420px] sm:min-h-[520px] lg:min-h-[640px] w-full overflow-hidden rounded-lg shadow-2xl bg-[#ECE7DF]/30">
              <img src={image_url.startsWith('/uploads') ? (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '') + image_url : image_url}
                alt="Hero image"
                className="object-cover w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                />
              {/* Overlay badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-5 py-3 shadow-lg">
                <p className="text-base font-bold text-[#2C1D11]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>100% Turnkey</p>
                <p className="text-xs text-[#66605B]">Architectural Design to Key Handover</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
