import React from "react";

export default function Services({ data = {} }) {
  const {
    eyebrow = "CORE SERVICES",
    headline = "Comprehensive Solutions",
    items = [
      {
        title: "Interior Design",
        desc: "Award-winning corporate and commercial interior design focusing on functionality and brand identity."
      },
      {
        title: "Turnkey Fit-Out",
        desc: "End-to-end execution of interior projects, managing everything from procurement to final installation."
      },
      {
        title: "Design & Build",
        desc: "Integrated project delivery with single-point accountability for both design and construction phases."
      }
    ]
  } = data;

  return (
    <section className="services">
      <div className="wrap">
        <div className="section-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        <div className="services-grid">
          {items && items.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="sc-icon">0{index + 1}</div>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
