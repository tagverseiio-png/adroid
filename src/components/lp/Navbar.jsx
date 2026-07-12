import { useState, useEffect } from "react";
import LeadFormModal from "./LeadFormModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header style={{ boxShadow: scrolled ? "0 8px 24px rgba(0,0,0,0.25)" : "none" }}>
        <nav>
          <a href="https://www.adroitdesigns.in/" target="_blank" rel="noopener noreferrer" className="logo">
            Adroit <span>Design</span>
          </a>

          <div className="nav-cta">
            <button className="btn solid" onClick={() => setIsModalOpen(true)}>
              Get a Quote
            </button>
            <button className="menu-btn" aria-label="Menu" onClick={() => setIsOpen(!isOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
          <a href="#about" onClick={() => setIsOpen(false)}>Intro</a>
          <a href="#services" onClick={() => setIsOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
          <a href="#why" onClick={() => setIsOpen(false)}>Why Adroit</a>
          <a href="#process" onClick={() => setIsOpen(false)}>Process</a>
          <a href="#faq" onClick={() => setIsOpen(false)}>FAQ</a>
          <button
            className="btn solid"
            style={{ justifyContent: "center" }}
            onClick={() => {
              setIsOpen(false);
              setIsModalOpen(true);
            }}
          >
            Get a Quote
          </button>
        </div>
      </header>

      <LeadFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
