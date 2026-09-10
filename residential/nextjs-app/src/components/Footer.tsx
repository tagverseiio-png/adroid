import AdroitIcon from "./AdroitIcon";

export default function Footer() {
  return (
    <footer className="bg-[#2C1D11] text-[#ECE7DF] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <AdroitIcon width={40} height={40} className="w-10 h-10" />
              <div>
                <span className="text-2xl font-bold tracking-wider text-white uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Adroit Designs
                </span>
                <p className="text-[9px] font-semibold tracking-[0.15em] text-[#B85A32] uppercase leading-none">
                  Residential Architecture &amp; Build
                </p>
              </div>
            </div>
            <p className="text-sm text-[#ECE7DF]/80 leading-relaxed max-w-sm">
              &ldquo;Residential architectural design, interiors and turnkey construction — from floor plan to finished home, under one accountable team.&rdquo;
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B85A32]">Navigation</h4>
            <ul className="space-y-2 text-sm">
              {["home", "projects", "process", "contact"].map((item) => (
                <li key={item}>
                  <a href={`#${item}`} className="hover:text-white transition-colors capitalize">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B85A32]">Services</h4>
            <ul className="space-y-2 text-sm text-[#ECE7DF]/80">
              <li>Architectural Design</li>
              <li>Home Interiors</li>
              <li>Turnkey Construction</li>
              <li>Renovation</li>
            </ul>
          </div>

          {/* Contact & Offices */}
          <div className="lg:col-span-4 space-y-4 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B85A32]">Contact &amp; Offices</h4>
            <div className="space-y-1">
              <p className="font-semibold text-white">Phone:</p>
              <p>
                <a href="tel:+919940064343" className="hover:underline">+91 99400 64343</a>
                {" / "}
                <a href="tel:+918804736688" className="hover:underline"> 8804736688</a>
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-white">Email:</p>
              <p>
                <a href="mailto:fm@adroitdesigns.in" className="hover:underline">fm@adroitdesigns.in</a>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <p className="font-semibold text-white mb-1">Chennai Office</p>
                <p className="text-[#ECE7DF]/70">No 8, MCN Nagar Extension,<br />Thoraipakkam, Chennai - 97.</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Bengaluru Office</p>
                <p className="text-[#ECE7DF]/70">SFD, P DOT G EMERALD, 16th A Cross Rd, Karuna Nagar, Electronic City Phase 1, Bengaluru - 560100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 text-center sm:text-left text-xs text-[#ECE7DF]/60 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 Adroit Design. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">Residential Construction &amp; Turnkey Architecture</p>
        </div>
      </div>
    </footer>
  );
}


