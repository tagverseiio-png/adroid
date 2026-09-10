const steps = [
  {
    id: '01',
    phase: 'Understand',
    title: 'Project Brief & Site Assessment',
    desc: 'We begin by understanding your business requirements, project goals, operational needs and existing site conditions.',
  },
  {
    id: '02',
    phase: 'Design',
    title: 'Design Development & Cost Planning',
    desc: 'Our design team develops functional and visually compelling interiors while balancing aesthetics, usability and budget.',
  },
  {
    id: '03',
    phase: 'Engineer',
    title: 'Detailed Engineering & Procurement',
    desc: 'Technical details, engineering coordination, material specifications and procurement are carefully planned before execution.',
  },
  {
    id: '04',
    phase: 'Execute',
    title: 'Project Execution & Management',
    desc: 'Experienced project teams manage on-site execution, quality, coordination, timelines and project progress.',
  },
  {
    id: '05',
    phase: 'Deliver',
    title: 'Testing, Snag Closure & Handover',
    desc: 'Every detail is reviewed, snags are addressed and the completed commercial space is prepared for final handover.',
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="py-20 lg:py-28 bg-brand-dark relative border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center justify-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-3 h-0.5 bg-brand-gold" />
            FROM CONCEPT TO COMPLETION
            <span className="w-3 h-0.5 bg-brand-gold" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">Our Work Process</h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            A disciplined five-phase methodology refined across hundreds of projects ensures every build is delivered
            with precision, quality and accountability.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 relative">
          <div className="absolute top-11 left-[10%] right-[10%] h-[2px] bg-linear-to-r from-brand-border via-brand-gold/60 to-brand-border z-0" />
          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-14 h-14 rounded-xl bg-brand-surface border border-brand-border group-hover:border-brand-gold flex items-center justify-center font-mono font-bold text-base text-brand-gold shadow-lg mb-6 transition-all duration-300 group-hover:scale-110">
                {step.id}
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-gold mb-1">{step.phase}</span>
              <h3 className="text-base font-bold text-white mb-2 leading-snug">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="md:hidden space-y-8 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-brand-border">
          {steps.map((step) => (
            <div key={step.id} className="relative flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center font-mono font-bold text-brand-gold text-sm shadow-md">
                {step.id}
              </div>
              <div className="bg-brand-surface/70 border border-brand-border p-4 rounded-xl flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold block mb-1">{step.phase}</span>
                <h3 className="text-base font-bold text-white mb-1">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
