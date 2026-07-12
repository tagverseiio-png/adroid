import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Hero({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "Corporate & Commercial Interiors",
    headline = "Designed to <em>Perform.</em><br />Delivered with <em>Accountability.</em>",
    sub_headline = "Integrated Interior Design, Design & Build and Turnkey Project Solutions<br />from concept development to successful project handover.",
    primary_cta = "Discuss Your Project",
    secondary_cta = "View Our Projects",
    stats = [
      { num: "20+", lbl: "Years of Experience" },
      { num: "1.2M+", lbl: "Sq.Ft. Delivered" },
      { num: "500+", lbl: "Projects" },
    ],
    image_url = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop",
  } = data;

  return (
    <>
      <section className="hero" id="top">
        <div className="wrap hero-wrap">
          <div className="hero-content">
            {eyebrow && <p className="eyebrow hero-eyebrow">{eyebrow}</p>}
            <h1 className="hero-h1" dangerouslySetInnerHTML={{ __html: headline }} />
            <p className="lead" dangerouslySetInnerHTML={{ __html: sub_headline }} />
            <div className="hero-ctas">
              {primary_cta && (
                <button className="btn solid" onClick={() => setIsModalOpen(true)}>
                  {primary_cta}
                </button>
              )}
              {secondary_cta && (
                <a href="#projects" className="btn">
                  {secondary_cta}
                </a>
              )}
            </div>
            {stats && stats.length > 0 && (
              <div className="hero-stats">
                {stats.map((s, i) => (
                  <div key={i}>
                    <span className="num">{s.num}</span>
                    <span className="lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="hero-image-wrapper">
            <img
              src={image_url}
              alt="Hero"
              className="hero-building-img"
            />
          </div>
        </div>
      </section>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </>
  );
}
