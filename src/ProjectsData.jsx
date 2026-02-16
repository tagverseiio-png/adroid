import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

import { PROJECTS } from "@/data/projects.data";
import { CATEGORIES } from "@/data/projectCategories";

//import ProjectCard from "@/components/ProjectCard";

const ProjectDataPage = () => {
    const [activeCategory, setActiveCategory] = useState("ALL");

    const filteredProjects = useMemo(() => {
        if (activeCategory === "ALL") return PROJECTS;
        return PROJECTS.filter(
            (project) => project.category === activeCategory
        );
    }, [activeCategory]);

    return (
        <section className="px-6 md:px-12 py-12">
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-10">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition
              ${activeCategory === cat
                                ? "bg-black text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Projects Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
                <AnimatePresence>
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default ProjectDataPage;
