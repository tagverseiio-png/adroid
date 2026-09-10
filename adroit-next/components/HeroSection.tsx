'use client';

import Image from 'next/image';
import { useModal } from './ModalContext';

export default function HeroSection() {
  const { openModal } = useModal();

  return (
    <section
      id="hero"
      className="relative pt-28 pb-16 lg:pt-36 lg:pb-28 bg-brand-dark bg-grid-pattern border-b border-brand-border/60 overflow-hidden"
    >
      {/* Ambient Backdrops */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* LEFT: Hero Image */}
          <div className="lg:col-span-6 order-1 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-brand-border/80 bg-brand-surface shadow-2xl shadow-black/80 aspect-[4/3] sm:aspect-[16/11]">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80"
                alt="Adroit Design - Corporate Workspace Interior"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-brand-dark/80 via-transparent to-black/20 pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-brand-dark/85 backdrop-blur-md border border-brand-border/80 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-gold">Turnkey Execution Benchmark</p>
                  <p className="text-xs text-slate-300 font-medium">Precision fit-outs &amp; enterprise spaces</p>
                </div>
              </div>
            </div>
            {/* Corner Frames */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand-gold rounded-tl-sm pointer-events-none" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-brand-gold rounded-br-sm pointer-events-none" />
          </div>

          {/* RIGHT: Content */}
          <div className="lg:col-span-6 order-2 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-surface border border-brand-border text-brand-gold text-xs font-bold tracking-widest uppercase mb-5 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
              Commercial Construction Company
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Commercial Building {' '}
              <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-gold via-yellow-200 to-brand-gold-hover">
                Contractors Chennai.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 font-normal">
              Integrated Interior Design, Design &amp; Build and Turnkey Project Solutions — from concept development to
              successful project handover.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 border-y border-brand-border/80 mb-8 bg-brand-surface/40 rounded-xl px-4">
              <div className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">20+</p>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider text-brand-muted font-medium mt-1">Years Experience</p>
              </div>
              <div className="text-center sm:text-left border-x border-brand-border/60 px-2 sm:px-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-brand-gold tracking-tight">1.2M+</p>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider text-brand-muted font-medium mt-1">Sq.Ft. Delivered</p>
              </div>
              <div className="text-center sm:text-left pl-2 sm:pl-4">
                <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">500+</p>
                <p className="text-[11px] sm:text-xs uppercase tracking-wider text-brand-muted font-medium mt-1">Projects</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => openModal('Hero Primary CTA')}
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-gold text-brand-dark hover:bg-brand-gold-hover transition-all shadow-glow hover:scale-[1.02] active:scale-95"
              >
                Discuss Your Project
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-brand-surface text-slate-200 border border-brand-border hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                View Our Projects
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
