'use client';

import { useState } from 'react';
import { useModal } from './ModalContext';
import AdroitIcon from './AdroitIcon';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Our Process', href: '#process' },
  { label: 'Contact', href: '#lead-form-section' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openModal } = useModal();

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-brand-dark/90 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Brand Logo */}
        <a href="#hero" className="flex items-center gap-3 group">
          <AdroitIcon width={48} height={48} />
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white uppercase group-hover:text-brand-gold transition-colors">
              Adroit <span className="text-brand-gold font-light">Design</span>
            </span>
            <span className="text-[9px] tracking-[0.25em] text-brand-muted uppercase font-semibold">
              Corporate &amp; Commercial
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-brand-gold transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => openModal('Navbar CTA')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-all shadow-glow hover:scale-[1.02] active:scale-95"
          >
            Get a Quote
          </button>

          <button
            type="button"
            aria-label="Toggle Navigation Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-brand-surface border border-brand-border"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-surface border-b border-brand-border px-6 py-6">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-200">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMobile} className="hover:text-brand-gold py-1">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-brand-border">
            <button
              type="button"
              onClick={() => { openModal('Mobile Menu CTA'); closeMobile(); }}
              className="w-full text-center py-3 rounded-md text-xs font-bold uppercase tracking-wider bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-colors shadow-glow"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
