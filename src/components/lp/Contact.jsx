import React from "react";
import LeadForm from "./LeadForm";

export default function Contact({ data = {} }) {
  const {
    eyebrow = "Start a Project",
    headline = "Planning An Upcoming Corporate Or Commercial Interior Project?",
    body = "Let’s discuss how Adroit can deliver your project."
  } = data;

  return (
    <section className="cta" id="contact">
      <div className="wrap">
        {eyebrow && (
          <p className="eyebrow" style={{ color: "#050505", visibility: eyebrow ? "visible" : "hidden" }} dangerouslySetInnerHTML={{ __html: eyebrow }} />
        )}
        
        {headline && (
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)" }} dangerouslySetInnerHTML={{ __html: headline }} />
        )}
        
        {body && (
          <p className="cta-sub" dangerouslySetInnerHTML={{ __html: body }} />
        )}
        
        <LeadForm data={data} />
      </div>
    </section>
  );
}
