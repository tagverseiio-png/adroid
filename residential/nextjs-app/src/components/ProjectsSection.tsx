import Image from "next/image";

const projects = [
  {
    id: 1,
    src: "/raghuram_residence.png",
    alt: "Raghuram Residence Villas",
    badge: "Villa",
    label: "Project 01",
    title: "Raghuram Residence Villas",
    services: "Architecture · Interiors · Turnkey",
  },
  {
    id: 2,
    src: "/MERLIN_RESIDENCE.jpg",
    alt: "Merlin Residence",
    badge: "Independent House",
    label: "Project 02",
    title: "Merlin Residence",
    services: "Architecture · Construction",
  },
  {
    id: 3,
    src: "/SUNDEEP_RESIDENCE.jpg",
    alt: "Sundeep Residence",
    badge: "Villa",
    label: "Project 03",
    title: "Sundeep Residence",
    services: "Interior Design · Furnishing",
  },
  {
    id: 4,
    src: "/raj_house.jpeg",
    alt: "Raj House",
    badge: "Renovation",
    label: "Project 04",
    title: "Raj House",
    services: "Remodeling · Interiors",
  },
  {
    id: 5,
    src: "/kevin_residence.jpeg",
    alt: "Kevin Residence",
    badge: "Villa",
    label: "Project 05",
    title: "Kevin Residence",
    services: "Architecture · Landscape · Turnkey",
  },
  {
    id: 6,
    src: "/VIJIAN_RESIDENCE.jpeg",
    alt: "Vijian Residence",
    badge: "Independent House",
    label: "Project 06",
    title: "Vijian Residence",
    services: "Architecture · Turnkey Construction",
  },
];

interface ProjectsSectionProps {
  onOpenModal: () => void;
}

export default function ProjectsSection({ onOpenModal }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-16 lg:py-24 bg-white border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-[#B85A32] tracking-widest uppercase block mb-2">
            SELECTED WORK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1D11] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Homes We&apos;ve Designed &amp; Built
          </h2>
          <p className="text-[#66605B] text-base sm:text-lg">
            &ldquo;A cross-section of villas, independent houses and apartment interiors delivered by Adroit Design.&rdquo;
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#FBF9F5] border border-[#ECE7DF] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-[#ECE7DF]/50 overflow-hidden">
                {project.src ? (
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#2C1D11] flex items-end justify-center pb-6">
                    <span className="text-[#ECE7DF] font-serif text-xl opacity-50">{project.title.toUpperCase()}</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-[#2C1D11] text-white text-[10px] font-semibold px-2.5 py-1 rounded tracking-widest uppercase">
                  {project.badge}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-[#B85A32]">{project.label}</span>
                  <h3 className="text-xl font-bold text-[#2C1D11] mt-1 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#66605B] font-medium uppercase tracking-wider">Services:</p>
                  <p className="text-sm text-[#242220] mt-0.5">{project.services}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenModal}
            className="inline-flex items-center justify-center bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-sm px-8 py-4 rounded shadow hover:shadow-md transition-all uppercase tracking-wider"
          >
            Get Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
