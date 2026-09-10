import React from "react";
import Link from "next/link";
import AdroitIcon from "@/components/AdroitIcon";

export default function Footer() {
  return (
    <footer className="bg-beige-100 border-t border-beige-250 text-arch-slate text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Col 1: Brand & Description (4 cols) */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-md border border-beige-250">
                <AdroitIcon width={32} height={32} />
              </div>
              <span className="font-display font-bold text-xl tracking-wider text-arch-ink uppercase">Adroit Design</span>
            </div>
            <p className="text-arch-steel leading-relaxed text-sm mb-6 max-w-sm">
              Industrial architectural design, civil, PEB, MEP, HVAC, fire protection and PMC solutions — engineered and delivered through one integrated team.
            </p>
            <div className="font-mono text-xs text-lightblue-700 font-semibold tracking-wide">
              INDUSTRIAL SCALE ARCHITECTURE · ENGINEERING EXCELLENCE
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-semibold text-arch-ink uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="#hero" className="hover:text-lightblue-600 transition-colors">Home</Link></li>
              <li><Link href="#projects" className="hover:text-lightblue-600 transition-colors">Projects</Link></li>
              <li><Link href="#process" className="hover:text-lightblue-600 transition-colors">Our Process</Link></li>
              <li><Link href="#lead-form-section" className="hover:text-lightblue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Col 3: Capabilities (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs font-semibold text-arch-ink uppercase tracking-widest mb-4">Capabilities</h3>
            <ul className="space-y-2 text-xs text-arch-steel">
              <li className="hover:text-lightblue-600 transition-colors">Industrial Architecture</li>
              <li className="hover:text-lightblue-600 transition-colors">Civil Engineering</li>
              <li className="hover:text-lightblue-600 transition-colors">PEB Structures</li>
              <li className="hover:text-lightblue-600 transition-colors">MEP Engineering</li>
              <li className="hover:text-lightblue-600 transition-colors">HVAC</li>
              <li className="hover:text-lightblue-600 transition-colors">Fire Protection Systems</li>
              <li className="hover:text-lightblue-600 transition-colors">PMC</li>
              <li className="hover:text-lightblue-600 transition-colors">Specialized Industrial Projects</li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="font-mono text-xs font-semibold text-arch-ink uppercase tracking-widest mb-4">Contact</h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block text-arch-muted font-mono text-[10px] uppercase font-semibold">Phone</span>
                <a href="tel:+919940064343" className="text-arch-ink hover:text-lightblue-600 font-medium transition-colors">+91 99400 64343</a>
                {" / "}
                <a href="tel:+918804736688" className="text-arch-ink hover:text-lightblue-600 font-medium transition-colors">+91 88047 36688</a>
              </div>

              <div>
                <span className="block text-arch-muted font-mono text-[10px] uppercase font-semibold">Email</span>
                <a href="mailto:fm@adroitdesigns.in" className="block text-arch-steel hover:text-lightblue-600 transition-colors mt-0.5">fm@adroitdesigns.in</a>
              </div>

              {/* Chennai Office */}
              <div className="pt-2 border-t border-beige-250">
                <span className="block text-lightblue-600 font-mono text-[10px] uppercase font-bold">Chennai Office</span>
                <address className="not-italic text-arch-steel text-[11px] leading-relaxed mt-0.5">
                  No 8, MCN Nagar Extension,<br />
                  Thoraipakkam, Chennai - 97.
                </address>
              </div>

              {/* Bengaluru Office */}
              <div className="pt-2 border-t border-beige-250">
                <span className="block text-lightblue-600 font-mono text-[10px] uppercase font-bold">Bengaluru Office</span>
                <address className="not-italic text-arch-steel text-[11px] leading-relaxed mt-0.5">
                  SFD, P DOT G EMERALD, 16th A Cross Rd,<br />
                  Karuna Nagar, Electronic City Phase I,<br />
                  Doddathoguru, Bengaluru - 560100, Karnataka, India
                </address>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-beige-250 flex flex-col sm:flex-row items-center justify-between text-xs text-arch-muted gap-4">
          <p>&copy; {new Date().getFullYear()} Adroit Design. All Rights Reserved. Industrial Architecture &amp; Engineering Solutions.</p>
          <div className="font-mono text-[11px] text-arch-muted">
            STRUCTURAL STABILITY · STATUTORY COMPLIANCE · ISO STANDARDS
          </div>
        </div>
      </div>
    </footer>
  );
}
