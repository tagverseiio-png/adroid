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

  const projectsToDisplay = featured_projects || [];

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
