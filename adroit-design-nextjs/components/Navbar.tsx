"use client";
import React, { useState } from "react";
import Link from "next/link";
import AdroitIcon from "@/components/AdroitIcon";

interface NavbarProps {
  onOpenModal: () => void;
}

export default function Navbar({ onOpenModal }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-beige-100/90 backdrop-blur-md border-b border-beige-250 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link href="#hero" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-md border border-beige-250">
            <AdroitIcon width={36} height={36} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-wider text-arch-ink uppercase group-hover:text-lightblue-600 transition-colors">Adroit Design</span>
            <span className="font-mono text-[10px] tracking-widest text-arch-muted uppercase -mt-0.5">Industrial Architecture & Engineering</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#hero" className="text-sm font-medium text-arch-slate hover:text-lightblue-600 tracking-wide transition-colors py-1">Home</Link>
          <Link href="#projects" className="text-sm font-medium text-arch-slate hover:text-lightblue-600 tracking-wide transition-colors py-1">Projects</Link>
          <Link href="#process" className="text-sm font-medium text-arch-slate hover:text-lightblue-600 tracking-wide transition-colors py-1">Our Process</Link>
          <Link href="#lead-form-section" className="text-sm font-medium text-arch-slate hover:text-lightblue-600 tracking-wide transition-colors py-1">Contact</Link>
        </nav>

        {/* Right Side CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={onOpenModal} 
            className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-lightblue-500 hover:bg-lightblue-600 rounded-lg transition-all duration-200 shadow-md shadow-lightblue-500/25 hover:shadow-lg hover:shadow-lightblue-500/35 border border-lightblue-400/50 active:scale-95 cursor-pointer">
            <span>Start Your Project</span>
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-arch-slate hover:text-arch-ink hover:bg-beige-200 focus:outline-none">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-beige-250 bg-beige-50/98 px-4 pt-2 pb-6 space-y-3">
          <Link href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-arch-slate hover:text-lightblue-600 hover:bg-beige-200 rounded-md">Home</Link>
          <Link href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-arch-slate hover:text-lightblue-600 hover:bg-beige-200 rounded-md">Projects</Link>
          <Link href="#process" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-arch-slate hover:text-lightblue-600 hover:bg-beige-200 rounded-md">Our Process</Link>
          <Link href="#lead-form-section" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-arch-slate hover:text-lightblue-600 hover:bg-beige-200 rounded-md">Contact</Link>
        </div>
      )}
    </header>
  );
}
