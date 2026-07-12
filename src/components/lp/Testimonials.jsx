import React from "react";

export default function Testimonials({ data = {} }) {
  const {
    eyebrow = "TESTIMONIALS",
    headline = "What Our Clients Say",
    items = [
      {
        quote: "Adroit Design delivered our new corporate office on time and beyond our expectations. Their attention to detail and project management skills are commendable.",
        name: "Mr. Rajeev Kumar",
        role: "Director, TechVision Solutions"
      },
      {
        quote: "The team at Adroit understood our brand identity perfectly and translated it into a stunning retail space. Highly recommended for commercial interiors.",
        name: "Ms. Ananya Sharma",
        role: "Founder, Urban Style Retail"
      }
    ]
  } = data;

  return (
    <section className="testimonials">
      <div className="wrap">
        <div className="section-head text-center">
          {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
          {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        
        <div className="testi-grid">
          {items && items.map((t, index) => (
            <div className="testi-card" key={index}>
              <div className="quote-mark">"</div>
              <p className="quote">{t.quote}</p>
              <div className="author">
                <h4>{t.name}</h4>
                <p>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
