export default function ProjectsSection({ onOpenModal, data = {} }) {
  const {
    headline = "Homes We&apos;ve Designed &amp; Built",
    sub_headline = "&ldquo;A cross-section of villas, independent houses and apartment interiors delivered by Adroit Design.&rdquo;",
    featured_projects = [
      {
        id: 1,
        image: "/raghuram_residence.png",
        category: "Villa",
        title: "Raghuram Residence Villas",
      },
      {
        id: 2,
        image: "/MERLIN_RESIDENCE.jpg",
        category: "Independent House",
        title: "Merlin Residence",
      },
      {
        id: 3,
        image: "/SUNDEEP_RESIDENCE.jpg",
        category: "Villa",
        title: "Sundeep Residence",
      },
      {
        id: 4,
        image: "/raj_house.jpeg",
        category: "Renovation",
        title: "Raj House",
      },
      {
        id: 5,
        image: "/kevin_residence.jpeg",
        category: "Villa",
        title: "Kevin Residence",
      },
      {
        id: 6,
        image: "/VIJIAN_RESIDENCE.jpeg",
        category: "Independent House",
        title: "Vijian Residence",
      },
    ]
  } = data;

  // The admin panel saves image paths like '/uploads/...', so we need to prepend API URL if necessary
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('/uploads')) {
      return (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '') + url;
    }
    return url;
  };

  return (
    <section id="projects" className="py-16 lg:py-24 bg-white border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-semibold text-[#B85A32] tracking-widest uppercase block mb-2">
            SELECTED WORK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1D11] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }} dangerouslySetInnerHTML={{ __html: headline }}>
          </h2>
          <p className="text-[#66605B] text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: sub_headline }}></p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured_projects.map((project, idx) => (
            <div
              key={project.id || idx}
              className="bg-[#FBF9F5] border border-[#ECE7DF] rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-[#ECE7DF]/50 overflow-hidden">
                {project.image ? (
                  <img src={getImageUrl(project.image)}
                    alt={project.title}
                    className="object-cover transition-transform duration-500 group-hover:scale-105 absolute inset-0 w-full h-full"
                    />
                ) : (
                  <div className="w-full h-full bg-[#2C1D11] flex items-end justify-center pb-6">
                    <span className="text-[#ECE7DF] font-serif text-xl opacity-50">{project.title?.toUpperCase()}</span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-[#2C1D11] text-white text-[10px] font-semibold px-2.5 py-1 rounded tracking-widest uppercase">
                  {project.category || "Project"}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-[#B85A32]">Project 0{idx + 1}</span>
                  <h3 className="text-xl font-bold text-[#2C1D11] mt-1 mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {project.title}
                  </h3>
                  {project.services && (
                    <>
                      <p className="text-xs text-[#66605B] font-medium uppercase tracking-wider">Services:</p>
                      <p className="text-sm text-[#242220] mt-0.5">{project.services}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gallery CTA */}
        {onOpenModal && (
          <div className="mt-12 text-center">
            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-sm px-8 py-4 rounded shadow hover:shadow-md transition-all uppercase tracking-wider"
            >
              Get Free Consultation
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
