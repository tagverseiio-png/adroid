import React, { useState, useEffect } from "react";
import LeadFormModal from "./LeadFormModal";

export default function FloatingContact({ data = {} }) {
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down 500px
      if (window.scrollY > 500) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    cta_text = "Enquire Now"
  } = data;

  if (!show) return null;

  return (
    <>
      <div className="floating-cta">
        <button className="btn solid" onClick={() => setIsModalOpen(true)}>
          {cta_text}
        </button>
      </div>
      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={data} />
    </>
  );
}
