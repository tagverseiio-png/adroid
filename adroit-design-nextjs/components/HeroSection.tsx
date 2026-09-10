"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  onOpenModal: () => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
  return (
    <section id="hero" className="relative pt-8 pb-20 lg:pt-14 lg:pb-28 overflow-hidden blueprint-grid-beige border-b border-beige-250">
      {/* Ambient Technical Light Blue Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lightblue-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-lightblue-400/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">

          {/* LEFT SIDE — INDUSTRIAL ARCHITECTURAL IMAGE */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative group">
              {/* Outer Architectural Frame Border */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-lightblue-400/40 via-beige-300 to-lightblue-500/40 opacity-70 blur-sm group-hover:opacity-100 transition duration-500"></div>

              <div className="relative rounded-xl overflow-hidden bg-white border border-beige-250 shadow-xl">
                {/* Industrial Facility Image */}
                <Image
                  src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80"
                  alt="Modern Industrial Manufacturing Plant and PEB Structure"
                  width={1400}
                  height={1000}
                  className="w-full h-[380px] sm:h-[460px] lg:h-[500px] object-cover object-center filter brightness-95 contrast-105 group-hover:scale-[1.02] transition-transform duration-700"
                  priority
                />

                {/* Corner Precision Tech HUD Marks */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur-md border border-beige-250 shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lightblue-500 animate-pulse"></span>
                  <span className="font-mono text-xs text-arch-slate tracking-wider font-semibold">ACTIVE INDUSTRIAL FACILITY</span>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur-md border border-beige-250 shadow-sm text-right">
                  <span className="font-mono text-[11px] text-lightblue-600 uppercase block font-bold">PEB · MEP · CIVIL · HVAC</span>
                  <span className="font-mono text-[10px] text-arch-muted">ENGINEERED SCALE SPECIFICATION</span>
                </div>

                {/* Subtle Technical Blueprint Coordinates */}
                <div className="absolute top-4 right-4 text-white font-mono text-xs drop-shadow-md select-none">+ 13.0827° N, 80.2707° E</div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — CONTENT */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col justify-center">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lightblue-50 border border-lightblue-200 text-lightblue-600 w-max mb-6">
              <svg className="w-3.5 h-3.5 text-lightblue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              <span className="font-mono text-xs font-semibold tracking-wider uppercase">Industrial Construction Company</span>
            </div>

            {/* Main Heading */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-arch-ink tracking-tight leading-[1.15] mb-6">
              Industrial Construction Contractors Chennai
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-arch-steel leading-relaxed font-normal mb-8">
              Adroit Design delivers integrated industrial architectural design, civil engineering, PEB, MEP, HVAC, fire protection and project management solutions — from initial feasibility and planning through execution and commissioning.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
              <button
                type="button"
                onClick={onOpenModal}
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-lightblue-500 hover:bg-lightblue-600 rounded-lg transition-all duration-200 shadow-lg shadow-lightblue-500/25 hover:shadow-xl hover:shadow-lightblue-500/35 border border-lightblue-400/50 active:scale-95 cursor-pointer">
                <span>Start Your Project</span>
                <svg className="w-5 h-5 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>

              <Link
                href="#projects"
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium text-arch-slate hover:text-arch-ink bg-white hover:bg-beige-50 rounded-lg transition-all duration-200 border border-beige-250 hover:border-lightblue-400 shadow-sm">
                <span>View Our Projects</span>
                <svg className="w-4 h-4 ml-2 text-lightblue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7-7-7-7" />
                </svg>
              </Link>
            </div>

            {/* Hero Stats Row */}
            <div className="pt-8 border-t border-beige-250 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-bold text-arch-ink tracking-tight">80+</span>
                <span className="text-xs sm:text-sm text-arch-muted font-medium mt-1">Industrial Projects</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-bold text-arch-ink tracking-tight">18 Lakh+</span>
                <span className="text-xs sm:text-sm text-arch-muted font-medium mt-1">Sq. Ft. Executed</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-bold text-arch-ink tracking-tight">8</span>
                <span className="text-xs sm:text-sm text-arch-muted font-medium mt-1">Engineering Disciplines</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-bold text-arch-ink tracking-tight">4–8 Mo</span>
                <span className="text-xs sm:text-sm text-arch-muted font-medium mt-1">Average Shed Delivery</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
