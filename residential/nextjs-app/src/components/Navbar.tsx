"use client";
import { useState } from "react";
import AdroitIcon from "./AdroitIcon";

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1F140B] bg-[#2C1D11]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-24">

          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-3 shrink-0">
            <AdroitIcon width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-bold text-lg lg:text-xl tracking-wider text-white uppercase" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Adroit Designs
              </span>
              <p className="text-[9px] font-semibold tracking-[0.15em] text-[#B85A32] uppercase leading-none">
                Residential Architecture &amp; Build
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["home", "projects", "process", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                className="text-sm font-semibold capitalize tracking-wide text-[#ECE7DF] hover:text-white transition-colors"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenModal}
              className="hidden md:inline-flex items-center justify-center bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-xs px-5 py-2.5 rounded shadow transition-all uppercase tracking-wider"
            >
              Get Free Consultation
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 space-y-1">
            {["home", "projects", "process", "contact"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-[#ECE7DF] hover:text-white hover:bg-white/10 rounded transition-colors capitalize"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </a>
            ))}
            <div className="pt-3 px-3">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenModal(); }}
                className="w-full bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-xs py-3 rounded shadow transition-all uppercase tracking-wider"
              >
                Get Free Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
