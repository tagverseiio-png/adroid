import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Portfolio({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "PROJECTS THAT DEMONSTRATE OUR CAPABILITIES.",
    headline = "Explore projects where Adroit united design, engineering, and execution to deliver success.",
    featured_projects = [],
    primary_cta = "See Full Portfolio"
  } = data;

  const defaultProjects = [
    {
      title: "Tech Park HQ, 28,000 sq.ft.",
      category: "Office Interior · Turnkey Fit-Out",
      tag: "Corporate Office",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Flagship Fashion Showroom",
      category: "Commercial Interior · Retail Design",
      tag: "Retail",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Financial Services Office",
      category: "Corporate Interior · Renovation",
      tag: "Corporate Office",
      image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Boutique Restaurant Interior",
      category: "Commercial Interior · Turnkey Build",
      tag: "Hospitality",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Multi-Speciality Clinic Fit-Out",
      category: "Commercial Interior · Turnkey Fit-Out",
      tag: "Healthcare",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "IT Campus Workspace Expansion",
      category: "Corporate Interior · Space Planning",
      tag: "Corporate Office",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
    }
  ];

  const projectsToDisplay = featured_projects.length > 0 ? featured_projects : defaultProjects;

  return (
    <section className="portfolio" id="projects">
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: "100%" }}>
          {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />}
          {headline && <h2 style={{ lineHeight: 1.2, maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        
        <div className="proj-grid">
          {projectsToDisplay.map((proj, idx) => (
            <div className="proj-card" key={idx}>
              <div className="proj-thumb">
                <img 
                  src={proj.image} 
                  alt={proj.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <span className="tag">{proj.tag || proj.category.split('·')[0].trim()}</span>
              </div>
              <div className="proj-info">
                <h4>{proj.title}</h4>
                <p>{proj.category}</p>
              </div>
            </div>
          ))}
        </div>

        {primary_cta && (
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button
              className="btn solid"
              onClick={() => setIsModalOpen(true)}
            >
              {primary_cta}
            </button>
          </div>
        )}
      </div>
      
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </section>
  );
}
