import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { MAIN_DIVISIONS, ARCHITECTURE_CATEGORIES, INTERIOR_CATEGORIES } from "./data/projectCategories";
import ProjectDetailPage from "./ProjectDetailPage";
import { projectsAPI, normalizeAssetUrl } from "./services/api";

export default function ProjectsPage() {
  const [selectedDivision, setSelectedDivision] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeProject, setActiveProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoadingProject, setIsLoadingProject] = useState(false);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      if (response.success) {
        // Filter for featured/selected projects only
        setProjects(response.data.filter(p => p.published && p.is_featured));
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      // Fallback data for testing/dev if API is blocked
      setProjects([
        { id: 1, title: "Modernist Villa", location: "Chennai", area: "4500 sqft", type: "ARCHITECTURE", category: "VILLAS", slug: "modernist-villa", published: true, is_featured: true, status: "COMPLETED" },
        { id: 2, title: "Penthouse Suite", location: "Bangalore", area: "3200 sqft", type: "INTERIOR", category: "RESIDENTIAL INTERIORS", slug: "penthouse-suite", published: true, is_featured: true, status: "COMPLETED" },
        { id: 3, title: "Tech Hub HQ", location: "Hyderabad", area: "15000 sqft", type: "ARCHITECTURE", category: "COMMERCIAL BUILDINGS", slug: "tech-hub-hq", published: true, is_featured: true, status: "ONGOING" }
      ]);
    }
  };

  const fetchProjectDetails = async (slug) => {
    setIsLoadingProject(true);
    try {
      const response = await projectsAPI.getBySlug(slug);
      if (response.success) {
        setActiveProject(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    } finally {
      setIsLoadingProject(false);
    }
  };

  useEffect(() => {

    fetchProjects();

    // Check if a project was selected from chatbot
    if (window.projectToLoad) {
      const slug = window.projectToLoad;
      delete window.projectToLoad;
      fetchProjectDetails(slug);
    }
  }, []);

  if (isLoadingProject) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading project...</p>
        </div>
      </div>
    );
  }

  if (activeProject) {
    return (
      <ProjectDetailPage
        project={activeProject}
        onBack={() => setActiveProject(null)}
      />
    );
  }

  const filtered = projects.filter((project) => {
    if (selectedDivision === "ALL") {
      return selectedCategory === "ALL" || project.category === selectedCategory;
    }

    if (selectedDivision === "ONGOING") {
      return project.status === "ONGOING";
    }

    const matchesDivision = project.type === selectedDivision;
    const matchesCategory = selectedCategory === "ALL" || project.category === selectedCategory;

    return matchesDivision && matchesCategory;
  });

  const getSubCategories = () => {
    if (selectedDivision === "ARCHITECTURE") return ARCHITECTURE_CATEGORIES;
    if (selectedDivision === "INTERIOR") return INTERIOR_CATEGORIES;
    return []; // Return empty or a combined list if "ALL" is selected
  };

  const subCategories = getSubCategories();

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen px-6 md:px-12 pt-24 md:pt-40 pb-20 md:pb-32">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-24 overflow-hidden">
        <motion.h1
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
          className="text-4xl sm:text-5xl md:text-[6rem] font-logo leading-[0.9] uppercase tracking-tight"
        >
          Our <br />
          <span className="font-light text-white/40 block origin-left" >Projects</span>
        </motion.h1>
      </div>

      {/* DIVISIONS FILTER */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex gap-10 border-b border-white/10 pb-4">
          {MAIN_DIVISIONS.map((div) => (
            <button
              key={div}
              onClick={() => {
                setSelectedDivision(div);
                setSelectedCategory("ALL"); // Reset category when division changes
              }}
              className={`text-sm tracking-[0.3em] font-sans font-bold uppercase transition-colors ${selectedDivision === div ? "text-[#C5A059]" : "text-stone-500 hover:text-white"
                }`}
            >
              {div}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER */}
      {subCategories.length > 0 && (
        <div className="sticky top-20 z-30 bg-[#0a0a0a]/90 backdrop-blur border-b border-white/10 mb-20">
          <div className="flex gap-8 py-5 overflow-x-auto scrollbar-hide">
            {subCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="relative text-xs tracking-[0.25em] uppercase whitespace-nowrap py-2"
              >
                <span className={`relative z-10 transition-colors duration-300 ${selectedCategory === cat ? "text-black" : "text-stone-500 hover:text-white"
                  }`}
                >
                  {cat}
                </span>
                {selectedCategory === cat && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-[#C5A059] -skew-x-12"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* GRID */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="group cursor-pointer"
              onClick={() => fetchProjectDetails(project.slug)}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-200">
                <motion.img
                  src={normalizeAssetUrl(project.cover_image || project.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800')}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.7 }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-500 p-6 flex flex-col justify-end">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] translate-y-4 group-hover:translate-y-0 transition duration-500 delay-75">
                    {project.category}
                  </span>

                  <h3 className="text-xl font-logo uppercase tracking-wider mt-2 translate-y-4 group-hover:translate-y-0 transition duration-500 delay-100 text-white">
                    {project.title}
                  </h3>

                  <div className="flex justify-between text-[10px] text-white/60 mt-4 border-t border-white/20 pt-3 translate-y-4 group-hover:translate-y-0 transition duration-500 delay-150">
                    <span>{project.location}</span>
                    <span>{project.area}</span>
                  </div>
                </div>

                {/* Icon */}
                <div className="absolute top-4 right-4 bg-white w-11 h-11 rounded-full flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition duration-300 scale-50 group-hover:scale-100">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
