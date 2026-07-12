import React from "react";

export default function Process({ data = {} }) {
  const {
    eyebrow = "HOW WE WORK",
    headline = "The Design & Build Process",
    steps = [
      {
        title: "Briefing & Concept",
        desc: "We understand your brand, workflow, and requirements to develop an initial spatial concept."
      },
      {
        title: "Design Development",
        desc: "Detailed 3D visualizations, material selection, and comprehensive working drawings."
      },
      {
        title: "Procurement & Approvals",
        desc: "Sourcing materials, finalizing vendors, and obtaining necessary statutory approvals."
      },
      {
        title: "Execution & Monitoring",
        desc: "On-site construction and fit-out with strict quality control and timeline management."
      },
      {
        title: "Handover & Support",
        desc: "Final walkthrough, defect snagging, project handover, and post-occupancy support."
      }
    ]
  } = data;

  return (
    <section className="process">
      <div className="wrap">
        <div className="section-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        
        <div className="process-timeline">
          {steps && steps.map((step, index) => (
            <div className="process-step" key={index}>
              <div className="step-num">0{index + 1}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
