import React from "react";

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-beige-100 blueprint-grid-beige border-b border-beige-250 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-lightblue-600 block mb-3">HOW YOUR INDUSTRIAL PROJECT RUNS</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-arch-ink tracking-tight mb-4">Four Stages. One Integrated Team.</h2>
          <p className="text-base sm:text-lg text-arch-steel leading-relaxed">
            From feasibility to commissioning, every stage is coordinated by one integrated industrial engineering team.
          </p>
        </div>

        {/* Connected Journey / Timeline 01 -> 02 -> 03 -> 04 */}
        <div className="relative">
          
          {/* Desktop Connecting Line in Light Blue */}
          <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-lightblue-300 via-lightblue-500 to-lightblue-300 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            
            {/* Stage 01 */}
            <div className="bg-white rounded-xl p-6 border border-beige-250 hover:border-lightblue-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-lightblue-700 bg-lightblue-50 px-3 py-1 rounded-md border border-lightblue-200">STAGE 01</span>
                <div className="w-12 h-12 rounded-xl bg-beige-100 border border-beige-250 flex items-center justify-center text-lightblue-600 group-hover:scale-110 group-hover:bg-lightblue-500 group-hover:text-white transition-all shadow-sm">
                  {/* Geotechnical / Survey Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-arch-ink mb-3 group-hover:text-lightblue-600 transition-colors">Feasibility &amp; Site Study</h3>
              <p className="text-sm text-arch-steel leading-relaxed">
                Conduct site surveys, soil investigations, statutory checks and process requirement studies before design begins.
              </p>
            </div>

            {/* Stage 02 */}
            <div className="bg-white rounded-xl p-6 border border-beige-250 hover:border-lightblue-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-lightblue-700 bg-lightblue-50 px-3 py-1 rounded-md border border-lightblue-200">STAGE 02</span>
                <div className="w-12 h-12 rounded-xl bg-beige-100 border border-beige-250 flex items-center justify-center text-lightblue-600 group-hover:scale-110 group-hover:bg-lightblue-500 group-hover:text-white transition-all shadow-sm">
                  {/* Multidisciplinary CAD Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-arch-ink mb-3 group-hover:text-lightblue-600 transition-colors">Multidisciplinary Design</h3>
              <p className="text-sm text-arch-steel leading-relaxed">
                Architecture, civil, PEB, MEP, HVAC and fire protection systems are designed together and coordinated before construction.
              </p>
            </div>

            {/* Stage 03 */}
            <div className="bg-white rounded-xl p-6 border border-beige-250 hover:border-lightblue-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-lightblue-700 bg-lightblue-50 px-3 py-1 rounded-md border border-lightblue-200">STAGE 03</span>
                <div className="w-12 h-12 rounded-xl bg-beige-100 border border-beige-250 flex items-center justify-center text-lightblue-600 group-hover:scale-110 group-hover:bg-lightblue-500 group-hover:text-white transition-all shadow-sm">
                  {/* Compliance & Approvals Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-arch-ink mb-3 group-hover:text-lightblue-600 transition-colors">Approvals &amp; Project Management</h3>
              <p className="text-sm text-arch-steel leading-relaxed">
                Coordinate statutory requirements, fire approvals, project schedules, cost management and quality control.
              </p>
            </div>

            {/* Stage 04 */}
            <div className="bg-white rounded-xl p-6 border border-beige-250 hover:border-lightblue-400 transition-all duration-300 flex flex-col group shadow-sm hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs font-bold text-lightblue-700 bg-lightblue-50 px-3 py-1 rounded-md border border-lightblue-200">STAGE 04</span>
                <div className="w-12 h-12 rounded-xl bg-beige-100 border border-beige-250 flex items-center justify-center text-lightblue-600 group-hover:scale-110 group-hover:bg-lightblue-500 group-hover:text-white transition-all shadow-sm">
                  {/* Heavy Industrial Execution Icon */}
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
              </div>
              <h3 className="font-display text-lg font-bold text-arch-ink mb-3 group-hover:text-lightblue-600 transition-colors">Execution &amp; Commissioning</h3>
              <p className="text-sm text-arch-steel leading-relaxed">
                Manage civil construction, PEB erection, MEP, HVAC and fire protection installation, testing and final commissioning.
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
