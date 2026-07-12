import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Services({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "ONE PARTNER. COMPLETE PROJECT DELIVERY.",
    headline = "Corporate & Commercial Interior Services",
    items = [
      {
        title: "Corporate & Commercial Interior Design",
        desc: "Functional, efficient and inspiring workplaces designed around your business requirements, operations and brand identity."
      },
      {
        title: "Design & Build",
        desc: "Integrated design, engineering, procurement and execution under a single point of responsibility."
      },
      {
        title: "Turnkey Interior Execution",
        desc: "End-to-end execution covering interiors, civil works, MEP, furniture, specialist installations and final handover."
      },
      {
        title: "Project Management",
        desc: "Professional planning, cost control, quality management and project monitoring for predictable outcomes."
      }
    ],
    primary_cta = "Request a Free Site Visit"
  } = data;

  return (
    <>
      <section className="services" id="services">
        <div className="wrap">
          <div className="section-head">
            {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />}
            {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
          </div>
          
          <div className="svc-grid">
            {items && items.map((service, index) => (
              <div className="svc-card" key={index}>
                <span className="idx">{String(index + 1).padStart(2, '0')}</span>
                <h3>{service.title}</h3>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "48px" }}>
            {primary_cta && (
              <button
                className="btn solid"
                onClick={() => setIsModalOpen(true)}
              >
                {primary_cta}
              </button>
            )}
          </div>
        </div>
      </section>
      
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </>
  );
}
