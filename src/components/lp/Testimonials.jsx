import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Testimonials({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "Client Feedback",
    headline = "What our clients say about working with Adroit Design",
    items = [
      {
        quote: "We handed over one brief and got back a finished office — on schedule, on budget, with none of the vendor chasing we expected.",
        author: "Operations Head, Technology Company"
      },
      {
        quote: "The design matched the render almost exactly. That alone set Adroit apart from every other contractor we spoke to.",
        author: "Director, Retail Chain"
      },
      {
        quote: "Weekly updates meant we always knew where the project stood. No surprises at handover, no last-minute cost additions.",
        author: "Founder, Financial Services Firm"
      }
    ],
    primary_cta = "Start Your Project"
  } = data;

  return (
    <>
      <section className="testimonials">
        <div className="wrap">
          <div className="section-head">
            {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />}
            {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
          </div>

          <div className="testi-grid">
            {items && items.map((item, index) => (
              <div className="testi-card" key={index}>
                <p className="quote">&quot;{item.quote}&quot;</p>
                <p className="who">{item.author}</p>
              </div>
            ))}
          </div>

          {primary_cta && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button className="btn solid" onClick={() => setIsModalOpen(true)}>
                {primary_cta}
              </button>
            </div>
          )}
        </div>
      </section>

      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </>
  );
}
