"use client";
import React, { useState } from "react";
import Image from "next/image";

interface Project {
  id: number;
  title: string;
  category: string;
  services: string;
  defaultImage: string;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "Hanon Systems Pvt Ltd",
    category: "Industrial Facility",
    services: "PEB · Civil · MEP",
    defaultImage: "/HANON SYSTEMS PVT LTD.jpg",
  },
  {
    id: 2,
    title: "Hanon Systems – MPL & IQ Lab",
    category: "Process Plant / Lab",
    services: "Civil · MEP · HVAC",
    defaultImage: "/HANON SYSTEMS - MPL & IQ LAB.jpg",
  },
  {
    id: 3,
    title: "Haystack Robotics",
    category: "Industrial Tech Facility",
    services: "Architecture · Civil · MEP",
    defaultImage: "/HAYSTACK ROBOTICS.jpg",
  },
  {
    id: 4,
    title: "Factory Main Entrance Structure",
    category: "Industrial Architecture",
    services: "Civil · Structural · Finishing",
    defaultImage: "/FACTORY MAIN ENTRANCE STRUCTURE.jpg",
  },
  {
    id: 5,
    title: "Factory Entrance Renovation",
    category: "Renovation / Façade",
    services: "Architecture · Civil · PMC",
    defaultImage: "/FACTORY ENTRANCE RENOVATION.jpg",
  },
  {
    id: 6,
    title: "Factory Admin Building Renovation",
    category: "Admin Building",
    services: "Architecture · Interior · PMC",
    defaultImage: "/FACTORY ADMIN BUILDING RENOVATION.jpg",
  },
  {
    id: 7,
    title: "SRF – Industrial Kitchen",
    category: "Specialized Industrial",
    services: "MEP · HVAC · Civil",
    defaultImage: "/SRF - INDUSTRIAL KITCHEN.jpg",
  },
];

export default function ProjectsSection() {
  // Store custom uploaded images keyed by project ID
  const [customImages, setCustomImages] = useState<Record<number, string>>({});

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setCustomImages((prev) => ({
            ...prev,
            [id]: ev.target!.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="projects" className="py-20 lg:py-28 bg-beige-200 border-b border-beige-250 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {initialProjects.map((project) => {
            const hasCustomImage = !!customImages[project.id];
            const currentImg = customImages[project.id] || project.defaultImage;

            return (
              <div key={project.id} className="group bg-white rounded-xl border border-beige-250 hover:border-lightblue-400 transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl">
                {/* Image Area */}
                <div className="relative w-full h-56 bg-beige-150 overflow-hidden border-b border-beige-250">

                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentImg}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Hover overlay: replace image button */}
                  <label
                    htmlFor={`project-file-${project.id}`}
                    className="absolute inset-0 flex items-center justify-center bg-arch-ink/0 group-hover:bg-arch-ink/40 transition-all duration-300 cursor-pointer"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/90 backdrop-blur-sm border border-beige-250 shadow text-xs font-mono font-semibold text-arch-slate">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      REPLACE IMAGE
                    </span>
                    <input
                      type="file"
                      id={`project-file-${project.id}`}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, project.id)}
                    />
                  </label>

                  {/* Badge: shows "USER IMAGE" if replaced */}
                  {hasCustomImage && (
                    <div className="absolute top-3 left-3 font-mono text-[10px] px-2 py-0.5 rounded shadow-sm font-semibold border bg-lightblue-50 text-lightblue-700 border-lightblue-400">
                      USER IMAGE
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-semibold text-lightblue-600 tracking-widest">PROJECT {String(project.id).padStart(2, '0')}</span>
                      <span className="font-mono text-[11px] px-2.5 py-0.5 rounded bg-lightblue-50 text-lightblue-700 border border-lightblue-200">{project.category}</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-arch-ink mb-2 group-hover:text-lightblue-600 transition-colors">{project.title}</h3>
                  </div>
                  <div className="pt-4 mt-4 border-t border-beige-250">
                    <div className="text-xs text-arch-muted font-mono">
                      <span className="text-arch-muted uppercase block text-[10px] tracking-wider mb-1 font-semibold">Services:</span>
                      <span className="text-arch-slate font-medium">{project.services}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
