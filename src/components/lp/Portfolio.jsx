import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Portfolio({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "PROJECTS THAT DEMONSTRATE OUR CAPABILITIES.",
    headline = "Explore projects where Adroit united design, engineering, and execution to deliver success.",
    cta_text = "See Full Portfolio",
    featured_projects = []
  } = data;

  return (
    <section className="portfolio" id="projects">
      <div className="wrap">
        <div className="section-head" style={{ maxWidth: "100%" }}>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {headline && <h2 style={{ lineHeight: 1.2, maxWidth: "100%" }} dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        
        {featured_projects && featured_projects.length > 0 ? (
          <div className="proj-grid">
            {featured_projects.map((proj, idx) => (
              <div className="proj-card" key={idx}>
                <div className="proj-thumb">
                  <img src={proj.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"} alt={proj.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {proj.category && <span className="tag">{proj.category}</span>}
                </div>
                <div className="proj-info">
                  <h4>{proj.title}</h4>
                  {proj.subtitle && <p>{proj.subtitle}</p>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--line)" }}>
            No projects selected for this campaign.
          </div>
        )}

        {/* CTA Button */}
        {cta_text && (
          <div style={{ textAlign: "center", marginTop: "48px" }}>
            <button
              className="btn solid"
              onClick={() => setIsModalOpen(true)}
            >
              {cta_text}
            </button>
          </div>
        )}
      </div>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </section>
  );
}
