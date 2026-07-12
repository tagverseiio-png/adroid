import React from "react";

export default function About({ data = {} }) {
  const {
    eyebrow = "A LEGACY OF EXCELLENCE",
    headline = "Adroit Design India Pvt. Ltd. is a multi-disciplinary architecture and interior design firm.",
    body = "Since 2003, we have successfully delivered comprehensive Design & Build solutions for leading corporate brands across India. Our expertise spans corporate offices, commercial centers, healthcare facilities, and hospitality venues.<br/><br/>With an in-house team of architects, engineers, and project managers, we ensure seamless execution from initial concept to final handover.",
    stats = [
      { num: "20+", lbl: "Years in Business" },
      { num: "500+", lbl: "Completed Projects" },
      { num: "Pan India", lbl: "Presence" }
    ],
    image_url = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop"
  } = data;

  return (
    <section className="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-content">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {headline && <h2 style={{ marginBottom: "24px" }} dangerouslySetInnerHTML={{ __html: headline }} />}
            {body && <p className="body-text" dangerouslySetInnerHTML={{ __html: body }} />}
            
            {stats && stats.length > 0 && (
              <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
                {stats.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '24px', fontFamily: 'var(--display)', color: 'var(--brass)' }}>{s.num}</div>
                    <div style={{ fontSize: '12px', opacity: 0.6 }}>{s.lbl}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="about-image">
            <img src={image_url} alt="About Us" />
          </div>
        </div>
      </div>
    </section>
  );
}
