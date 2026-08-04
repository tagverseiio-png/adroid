import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Process({ data = {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "FROM CONCEPT TO COMPLETION.",
    headline = "Our Process",
    sub_headline = "A disciplined five-phase methodology — refined across hundreds of projects — ensures every build is delivered with precision, on time, and on budget.",
    steps = [
      {
        title: "Understand",
        desc: "Project Brief & Site Assessment",
        detail: "We listen first. Every project begins with a deep-dive into your vision, goals, and site conditions.",
      },
      {
        title: "Design",
        desc: "Design Development & Cost Planning",
        detail: "Our architects craft detailed designs, balancing aesthetics with budget precision.",
      },
      {
        title: "Engineer",
        desc: "Detailed Engineering & Procurement",
        detail: "Structural and MEP engineers resolve every technical detail before ground breaks.",
      },
      {
        title: "Execute",
        desc: "Project Execution & Management",
        detail: "On-site teams led by experienced project managers keep quality and timelines tight.",
      },
      {
        title: "Deliver",
        desc: "Testing, Snag Closure & Handover",
        detail: "We don't leave until every snag is resolved and you're fully satisfied.",
      },
    ],
    primary_cta = "Discuss Your Project"
  } = data;

  return (
    <>
      <section className="process" id="process">
        <div className="wrap">
          <div className="process-header">
            {eyebrow && <p className="eyebrow" dangerouslySetInnerHTML={{ __html: eyebrow }} />}
            {headline && <h2 className="section-title" dangerouslySetInnerHTML={{ __html: headline }} />}
            {sub_headline && (
              <p className="process-subtitle" dangerouslySetInnerHTML={{ __html: sub_headline }} />
            )}
          </div>

          <div className="process-timeline">
            {steps && steps.map((step, i) => (
              <div className="pstep" key={i}>
                <div className="pstep-dot"></div>
                <div className="pstep-inner">
                  <div className="step-no">{String(i + 1).padStart(2, '0')}</div>
                  <h4>{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                  <p className="step-detail">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {primary_cta && (
            <div style={{ textAlign: "center", marginTop: "56px" }}>
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
