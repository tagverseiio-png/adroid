import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function WhyUs({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "Why Adroit",
    headline = "Built For Businesses Where Quality, Cost And Timelines Matter.",
    items = [
      {
        title: "Single-Point Accountability",
        desc: "One experienced team coordinating your project from concept to successful completion."
      },
      {
        title: "Multidisciplinary Expertise",
        desc: "Integrated Interior Design, Civil, MEP, Procurement and Project Management capabilities."
      },
      {
        title: "Transparent Project Control",
        desc: "Detailed BOQs, cost monitoring, progress tracking and systematic project management."
      },
      {
        title: "Quality-Focused Execution",
        desc: "Structured QA/QC procedures throughout project execution and final handover."
      }
    ],
    primary_cta = "Talk To Our Consultant",
    image_url = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
  } = data;

  return (
    <>
      <section className="why" id="why">
        <div className="wrap why-grid">
          <div>
            {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />}
            {headline && <h2 className="section-h2" style={{ marginBottom: "34px" }} dangerouslySetInnerHTML={{ __html: headline }} />}
            
            <div className="why-list">
              {items && items.map((item, index) => (
                <div className="why-item" key={index}>
                  <span className="mark">→</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {primary_cta && (
              <div className="why-cta-container">
                <button
                  className="btn solid"
                  onClick={() => setIsModalOpen(true)}
                >
                  {primary_cta}
                </button>
              </div>
            )}
          </div>
          
          <div className="why-visual">
            <img
              src={image_url}
              alt="Why Adroit"
              loading="lazy"
            />
          </div>
        </div>
      </section>
      
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </>
  );
}
