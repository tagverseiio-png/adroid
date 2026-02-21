import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ChevronDown } from 'lucide-react';
import Lenis from 'lenis';

// --- Page Imports ---
import Home from './Home';
import ProjectsPage from './ProjectsPage';
import ServicesPage from './ServicesPage';
import ServiceDetailPage from './ServiceDetailPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import CareersPage from './CareersPage';

// --- Blog Imports ---
import BlogPage from './blog/BlogPage';
import BlogPost from './blog/BlogPost';

// --- Admin Imports ---
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ProjectManager from './admin/ProjectManager';
import BlogManager from './admin/BlogManager';
import Inquiries from './admin/Inquiries';

// --- Component Imports ---
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import AIChatbot from './components/AIChatbot';
import Footer from './components/Footer';

// --- Main App Component ---
const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedService, setSelectedService] = useState(null);
  const [contactSection] = useState('enquiry');

  // Blog State
  const [selectedPost, setSelectedPost] = useState(null);

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPage, setAdminPage] = useState('dashboard');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, adminPage, selectedPost]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Check URL for Admin Access on initial mount
  const adminCheckRef = useRef(true);
  useEffect(() => {
    if (adminCheckRef.current) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'admin') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrentPage('Admin');
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      adminCheckRef.current = false;
    }
  }, []);

  // Handle Admin Routing
  if (currentPage === 'Admin') {
    if (!isAdminLoggedIn) {
      return <Login onLogin={setIsAdminLoggedIn} />;
    }
    return (
      <AdminLayout
        currentPage={adminPage}
        onNavigate={setAdminPage}
        onLogout={() => { setIsAdminLoggedIn(false); }}
      >
        {adminPage === 'dashboard' && <Dashboard />}
        {adminPage === 'projects' && <ProjectManager />}
        {adminPage === 'blog' && <BlogManager />}
        {adminPage === 'inquiries' && <Inquiries />}
      </AdminLayout>
    );
  }

  return (
    <div className="font-sans bg-[#f4f4f4] min-h-screen selection:bg-[#C5A059] selection:text-white text-stone-900 cursor-none">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=Michroma&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Montserrat', sans-serif; }
        .font-logo { font-family: 'Michroma', sans-serif; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @media (hover: hover) and (pointer: fine) {
          body { cursor: none; }
        }
      `}</style>

      {/* Intro Loader */}
      <AnimatePresence>
        {loading && <Preloader setLoading={setLoading} />}
      </AnimatePresence>

      {/* Custom Follower Cursor */}
      {!loading && <CustomCursor />}

      {/* Header - Transparent */}
      <motion.header
        className={`fixed top-0 w-full z-30 bg-transparent py-4 md:py-5 transition-opacity duration-300 ${isNavOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 3 }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-4 md:gap-12">

          {/* Logo - Left Anchor */}
          <div
            onClick={() => setCurrentPage('Home')}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="flex flex-col">
              <div className="text-xl md:text-2xl font-logo tracking-[0.15em] font-bold text-white group-hover:text-[#C5A059] transition-colors duration-300 uppercase">
                ADROIT DESIGN
              </div>
            </div>
          </div>

          {/* Center Navigation - Primary Pages */}
          <nav className="hidden lg:flex items-center gap-10">
            <span
              onClick={() => setCurrentPage('About Us')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              About Us
            </span>
            <span
              onClick={() => setCurrentPage('Services')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Services
            </span>
            <span
              onClick={() => setCurrentPage('Projects')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Projects
            </span>
            <span
              onClick={() => setCurrentPage('Insights')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Insights
            </span>
            <span
              onClick={() => setCurrentPage('Shop')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Shop
            </span>
            <span
              onClick={() => setCurrentPage('Careers')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Careers
            </span>
          </nav>

          {/* Right CTA & Menu */}
          <div className="flex items-center gap-8 ml-auto">
            {/* Contact Us Link */}
            <button
              onClick={() => setCurrentPage('Contact Us')}
              className="hidden md:inline-flex text-xs font-medium tracking-[0.15em] uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              Contact Us
            </button>

            {/* Menu Button - Icon Only */}
            <button
              onClick={() => setIsNavOpen(true)}
              className="flex items-center justify-center w-10 h-10 text-white hover:text-[#C5A059] transition-colors duration-300 group"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </motion.header>

      <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} setPage={setCurrentPage} />

      <main>
        {currentPage === 'Home' && <Home setPage={setCurrentPage} />}
        {currentPage === 'Projects' && <ProjectsPage />}
        {currentPage === 'Services' && (
          selectedService ? (
            <ServiceDetailPage service={selectedService} onBack={() => setSelectedService(null)} />
          ) : (
            <ServicesPage onServiceClick={setSelectedService} />
          )
        )}
        {currentPage === 'Insights' && (
          selectedPost ? (
            <BlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />
          ) : (
            <BlogPage onReadMore={(post) => setSelectedPost(post)} />
          )
        )}
        {currentPage === 'About Us' && <AboutPage />}
        {currentPage === 'Contact Us' && <ContactPage initialSection={contactSection} />}
        {currentPage === 'Careers' && <CareersPage />}
        {currentPage === 'Shop' && <div className="min-h-screen pt-40 px-6 md:px-24 flex items-center justify-center text-center"><h1 className="text-3xl font-logo uppercase tracking-widest text-stone-400">Shop - Coming Soon</h1></div>}
      </main>

      <AIChatbot setPage={setCurrentPage} />
      {currentPage !== 'Contact Us' && <Footer setPage={setCurrentPage} />}
    </div>
  );
};

export default App;
