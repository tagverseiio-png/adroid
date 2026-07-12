import React, { useState, useEffect } from "react";
import "./lp-globals.css";

// Import Landing Page Sections
import Hero from "./Hero";
import About from "./About";
import Services from "./Services";
import Portfolio from "./Portfolio";
import WhyUs from "./WhyUs";
import Process from "./Process";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Contact from "./Contact";
import FloatingContact from "./FloatingContact";

export default function LandingPageRenderer({ slug }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    
    async function fetchData() {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "https://api.adroitdesigns.in";
        const res = await fetch(`${apiUrl}/api/landing-pages/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Landing Page not found");
          throw new Error("Failed to load landing page");
        }
        const json = await res.json();
        setData(json.data);
        
        // Update document title if SEO data exists
        if (json.data.seo?.title) {
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
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: '#c5a059' }}>
        Loading...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', color: 'white', flexDirection: 'column' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
        <p>{error || "Page Not Found"}</p>
        <a href="/" style={{ marginTop: '2rem', color: '#c5a059' }}>Return Home</a>
      </div>
    );
  }

  // Component Mapping
  const sectionMap = {
    hero: Hero,
    about: About,
    services: Services,
    portfolio: Portfolio,
    why_us: WhyUs,
    process: Process,
    testimonials: Testimonials,
    faq: FAQ,
    contact: Contact,
  };

  return (
    <div className="lp-scope">
      <main>
        {data.sections_order.map((key) => {
          const sectionConfig = data.sections[key];
          // Check if section exists in map and is enabled
          if (sectionMap[key] && sectionConfig?.enabled) {
            const Component = sectionMap[key];
            return <Component key={key} data={sectionConfig.content} />;
          }
          return null;
        })}
      </main>
      <FloatingContact data={data.sections.contact?.content || {}} />
    </div>
  );
}
