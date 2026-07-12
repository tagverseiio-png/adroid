import React, { useState } from "react";

export default function FAQ({ data = {} }) {
  const [openIndex, setOpenIndex] = useState(0);

  const {
    eyebrow = "FAQ",
    headline = "Frequently Asked Questions",
    items = [
      {
        question: "What is a Design & Build contract?",
        answer: "In a Design & Build contract, Adroit Design takes full responsibility for both the architectural/interior design and the construction/fit-out execution. This ensures a single point of contact, better cost control, and faster project delivery."
      },
      {
        question: "Do you handle statutory approvals?",
        answer: "Yes, our team assists in obtaining necessary statutory approvals and NOCs required for commercial and corporate interior projects."
      },
      {
        question: "What is the typical timeline for an office interior project?",
        answer: "Timelines vary based on project scale and complexity. However, a standard 10,000 sq.ft. corporate office fit-out typically takes 45 to 60 days from design sign-off."
      }
    ]
  } = data;

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  return (
    <section className="faq bg-paper" id="faq">
      <div className="wrap">
        <div className="section-head text-center">
          {eyebrow && <p className="eyebrow justify-center">{eyebrow}</p>}
          {headline && <h2 dangerouslySetInnerHTML={{ __html: headline }} />}
        </div>
        <div className="faq-list">
          {items && items.map((faq, i) => (
            <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
              <button className="faq-q" onClick={() => toggle(i)}>
                {faq.question}
                <span className="faq-icon"></span>
              </button>
              <div className="faq-a">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
