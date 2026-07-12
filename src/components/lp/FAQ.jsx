import React, { useState } from "react";
import LeadFormModal from "./LeadFormModal";

export default function FAQ({ data = {} }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    eyebrow = "FAQ",
    headline = "Frequently Asked Questions",
    items = [
      {
        question: "Does Adroit provide complete Design & Build services?",
        answer: "Yes. Our services can cover Interior Design, Engineering, MEP, Procurement, Execution, Project Management and final handover."
      },
      {
        question: "What types of projects does Adroit undertake?",
        answer: "We specialise in medium to large-scale Corporate and Commercial Interior Projects."
      },
      {
        question: "Can Adroit undertake projects across multiple locations?",
        answer: "Yes. We undertake projects across Chennai, Bengaluru and other locations based on project requirements."
      },
      {
        question: "How does Adroit manage project quality and costs?",
        answer: "Through detailed BOQs, systematic project planning, cost monitoring, QA/QC procedures and professional project management."
      }
    ],
    primary_cta = "Ask Us a Question"
  } = data;

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="faq" id="faq">
        <div className="wrap">
          <div className="section-head">
            {eyebrow && <p className="eyebrow" style={{ visibility: eyebrow ? 'visible' : 'hidden' }} dangerouslySetInnerHTML={{ __html: eyebrow }} />}
            {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
          </div>
          
          <div className="faq-list">
            {items && items.map((faq, idx) => (
              <div key={idx} className={`faq-item ${openIndex === idx ? "open" : ""}`}>
                <button className="faq-q" onClick={() => toggleFAQ(idx)}>
                  {faq.question}
                  <span className="plus">+</span>
                </button>
                <div
                  className="faq-a"
                  style={{ maxHeight: openIndex === idx ? "500px" : "0" }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>

          {primary_cta && (
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                className="btn solid"
                onClick={() => setIsModalOpen(true)}
              >
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
