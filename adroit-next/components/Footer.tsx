import AdroitIcon from './AdroitIcon';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-slate-400 text-sm border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">

          {/* Col 1: Brand & Positioning */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <AdroitIcon width={48} height={48} />
              <span className="text-xl font-extrabold text-white tracking-tight uppercase">
                Adroit <span className="text-brand-gold font-light">Design</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 pr-4">
              Corporate &amp; commercial interior design and turnkey project execution — from blueprint to built space, under one team.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-block w-2 h-2 rounded-full bg-brand-gold" />
              <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">Corporate &amp; Commercial Focus</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#projects" className="hover:text-brand-gold transition-colors">Corporate Office Interiors</a></li>
              <li><a href="#projects" className="hover:text-brand-gold transition-colors">Commercial Interior Design</a></li>
              <li><a href="#lead-form-section" className="hover:text-brand-gold transition-colors">Turnkey Fit-Outs</a></li>
              <li><a href="#lead-form-section" className="hover:text-brand-gold transition-colors">Renovation &amp; Refurbishment</a></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><a href="#hero" className="hover:text-brand-gold transition-colors">About Adroit Design</a></li>
              <li><a href="#projects" className="hover:text-brand-gold transition-colors">Our Projects</a></li>
              <li><a href="#process" className="hover:text-brand-gold transition-colors">Why Choose Us</a></li>
              <li><a href="#process" className="hover:text-brand-gold transition-colors">Our Process</a></li>
              <li><a href="#lead-form-section" className="hover:text-brand-gold transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Col 4: Contact & Locations */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact</h4>

            <div className="space-y-1.5 text-xs">
              <p className="text-slate-300 font-medium">
                <span className="text-brand-gold">Phone:</span> +91 99400 64343 &nbsp;|&nbsp; 8804736688
              </p>
              <p className="text-slate-300 font-medium">
                <span className="text-brand-gold">Email:</span> fm@adroitdesigns.in
              </p>
            </div>

            <div className="pt-3 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] leading-normal text-slate-400">
              <div>
                <p className="text-white font-semibold uppercase tracking-wider text-[10px] mb-1">Chennai Office</p>
                <p>No 8, MCN Nagar Extension, Thoraipakkam, Chennai - 97.</p>
              </div>
              <div>
                <p className="text-white font-semibold uppercase tracking-wider text-[10px] mb-1">Bengaluru Office</p>
                <p>SFD, P DOT G EMERALD, 16th A Cross Rd, Karuna Nagar, Electronic City Phase I, Doddathoguru, Bengaluru - 560100, Karnataka, India</p>
              </div>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Adroit Design. All rights reserved.</p>
          <p className="text-[11px] tracking-wider uppercase text-slate-400">Enterprise Commercial &amp; Corporate Turnkey Infrastructure</p>
        </div>
      </div>
    </footer>
  );
}
