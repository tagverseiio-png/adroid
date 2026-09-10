import React, { useState, useEffect } from "react";
import "./lp-globals.css";

// Import Landing Page Sections
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ProcessSection from "./ProcessSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
import ConsultationModal from "./ConsultationModal";
import Footer from "./Footer";

export default function LandingPageRenderer({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchData() {
      try {
        const apiUrl = (import.meta.env.VITE_API_URL || 'https://api.adroitdesigns.in').replace(/\/api\/?$/, '');
        const res = await fetch(`${apiUrl}/api/landing-pages/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Landing Page not found");
          throw new Error("Failed to load landing page");
        }
        const json = await res.json();
        
        setData(json.data);
        
        // Update document title if SEO data exists
        if (json.data?.seo?.title) {
          document.title = json.data.seo.title;
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2C1D11', color: '#B85A32' }}>
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2C1D11', color: 'white', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontFamily: "'Cormorant Garamond', serif" }}>404</h1>
        <p>{error || "Page Not Found"}</p>
        <a href="/" style={{ marginTop: '2rem', color: '#B85A32' }}>Return Home</a>
      </div>
    );
  }

  return (
    <div className="lp-scope antialiased">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />
      <main>
        {(!data.sections?.hero || data.sections.hero.enabled !== false) && (
          <HeroSection onOpenModal={() => setIsModalOpen(true)} data={data.sections?.hero?.content} />
        )}
        {(!data.sections?.process || data.sections.process.enabled !== false) && (
          <ProcessSection onOpenModal={() => setIsModalOpen(true)} data={data.sections?.process?.content} />
        )}
        {(!data.sections?.projects || data.sections.projects.enabled !== false) && (
          <ProjectsSection onOpenModal={() => setIsModalOpen(true)} data={data.sections?.projects?.content} />
        )}
        {(!data.sections?.contact || data.sections.contact.enabled !== false) && (
          <ContactSection onOpenModal={() => setIsModalOpen(true)} data={data.sections?.contact?.content} />
        )}
      </main>
      <Footer />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
