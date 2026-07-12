import React from "react";

export default function WhyUs({ data = {} }) {
  const {
    eyebrow = "WHY ADROIT?",
    headline = "The Adroit Advantage",
    items = [
      {
        title: "Single Point of Responsibility",
        desc: "We manage the entire project lifecycle, eliminating the hassle of coordinating with multiple vendors and contractors."
      },
      {
        title: "In-House Expertise",
        desc: "Our team comprises seasoned architects, interior designers, MEP engineers, and project managers under one roof."
      },
      {
        title: "Value Engineering",
        desc: "We optimize designs to deliver maximum impact within your budget, without compromising on quality."
      },
      {
        title: "Transparent Process",
        desc: "Clear timelines, detailed BOQs, and regular progress updates keep you informed at every stage."
      }
    ]
  } = data;

  return (
    <section className="why-us">
      <div className="wrap">
        <div className="section-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        <div className="why-grid">
          {items && items.map((item, index) => (
            <div className="why-card" key={index}>
              <div className="why-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="why-text">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
