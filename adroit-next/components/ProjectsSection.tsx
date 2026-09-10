import Image from 'next/image';

const projects = [
  {
    id: '01',
    tag: 'Corporate Office',
    title: 'MGH Logistics Office',
    meta: 'Corporate Office Interior · Turnkey Fit-Out',
    image: '/project-01.jpg',
    alt: 'MGH Logistics Office - Corporate Interior',
  },
  {
    id: '02',
    tag: 'Logistics',
    title: 'Panalpina Logistics Office',
    meta: 'Commercial Interior · Office Fit-Out',
    image: '/project-02.jpg',
    alt: 'Panalpina Logistics Office Interior',
  },
  {
    id: '03',
    tag: 'Retail',
    title: 'Commercial Showroom Building',
    meta: 'Commercial Interior · Retail Design',
    image: '/project-03.jpg',
    alt: 'Commercial Showroom Building Interior',
  },
  {
    id: '04',
    tag: 'Commercial',
    title: 'Supermarket Building',
    meta: 'Commercial Interior · Turnkey Build',
    image: '/project-04.jpg',
    alt: 'Supermarket Building Interior',
  },
  {
    id: '05',
    tag: 'Corporate Office',
    title: 'Swagelok Corporate Office Cafeteria',
    meta: 'Corporate Interior · Cafeteria Fit-Out',
    image: '/project-05.jpg',
    alt: 'Swagelok Corporate Office Cafeteria',
  },
  {
    id: '06',
    tag: 'Corporate Office',
    title: 'IT Campus Workspace Expansion',
    meta: 'Corporate Interior · Space Planning',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
    alt: 'Project 06 - IT Campus Workspace Expansion',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-20 lg:py-28 bg-brand-surface/40 border-b border-brand-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-2 h-0.5 bg-brand-gold" />
            OUR PROJECTS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Completed Corporate &amp; Commercial Projects
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Explore projects where Adroit united design, engineering and execution to deliver high-quality commercial
            environments.
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="group bg-brand-surface rounded-xl overflow-hidden border border-brand-border hover:border-brand-gold/60 transition-all duration-300 hover:shadow-elevate hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-brand-card">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <span className="absolute top-4 left-4 bg-brand-dark/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-brand-gold border border-brand-border px-2.5 py-1 rounded">
                  {project.tag}
                </span>
                <span className="absolute top-4 right-4 text-slate-400 text-xs font-mono font-medium">
                  {project.id}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">{project.meta}</p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
