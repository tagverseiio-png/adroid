import React, { useState, useEffect, useRef, Suspense } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Lenis from 'lenis';

// --- Lazy Page Imports (Code Splitting) ---
const Home = React.lazy(() => import('./Home'));
const ProjectsPage = React.lazy(() => import('./ProjectsPage'));
const ServicesPage = React.lazy(() => import('./ServicesPage'));
const ServiceDetailPage = React.lazy(() => import('./ServiceDetailPage'));
const AboutPage = React.lazy(() => import('./AboutPage'));
const ContactPage = React.lazy(() => import('./ContactPage'));
const CareersPage = React.lazy(() => import('./CareersPage'));

// --- Lazy Shop Imports ---
const ShopPage = React.lazy(() => import('./shop/ShopPage'));
const ProductDetail = React.lazy(() => import('./shop/ProductDetail'));
const CheckoutPage = React.lazy(() => import('./shop/CheckoutPage'));
import CartDrawer from './shop/CartDrawer';
import { useCart } from './context/CartContext';
import { ShoppingBag } from 'lucide-react';

const SERVICES_QUICK_ACCESS = [
  {
    id: 1,
    title: 'Architectural Design',
    subtitle: 'Built Environments',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    sections: [
      'Comprehensive Site & Context Analysis',
      'Sustainable Concept Development',
      'Technical Documentation',
      'Engineering Coordination',
    ],
  },
  {
    id: 2,
    title: 'Interior Design',
    subtitle: 'Spatial Experience',
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    sections: [
      'Space Planning & Concept',
      'Material & Finish Selection',
      'Integrated Systems Design',
      'Customization & Visualization',
    ],
  },
  {
    id: 3,
    title: 'Turnkey Interior Fit-Out',
    subtitle: 'Design to Delivery',
    image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61c',
    sections: [
      'Full Project Ownership',
      'Vendor & Resource Management',
      'Quality Control & Inspections',
      'Time & Budget Adherence',
    ],
  },
  {
    id: 4,
    title: 'Civil & PEB Construction',
    subtitle: 'Structural Excellence',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    sections: [
      'Structural & PEB Synergy',
      'Building Envelope Optimization',
      'Construction Administration',
      'Waste Management & Resource Conservation',
    ],
  },
  {
    id: 5,
    title: 'Building Management Services',
    subtitle: 'Integrated Engineering',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b',
    sections: [
      'Intelligent Building Design',
      'Safety & Security Systems',
      'Performance Monitoring',
      'Interoperability Optimization',
    ],
  },
  {
    id: 6,
    title: 'Project Management',
    subtitle: 'End-to-End Control',
    image: 'https://images.unsplash.com/photo-1503389152951-9f343605f61c',
    sections: [
      'Strategic Planning & Scope Establishment',
      'Interdisciplinary Team Dialogue',
      'Risk & Progress Monitoring',
      'Post-Occupancy Evaluation',
    ],
  },
];

// --- Lazy Blog Imports ---
const BlogPage = React.lazy(() => import('./blog/BlogPage'));
const BlogPost = React.lazy(() => import('./blog/BlogPost'));

// --- Lazy Admin Imports ---
const Login = React.lazy(() => import('./admin/Login'));
const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const Dashboard = React.lazy(() => import('./admin/Dashboard'));
const ProjectManager = React.lazy(() => import('./admin/ProjectManager'));
const BlogManager = React.lazy(() => import('./admin/BlogManager'));
const Inquiries = React.lazy(() => import('./admin/Inquiries'));
const ProductManager = React.lazy(() => import('./admin/shop/ProductManager'));
const OrderManager = React.lazy(() => import('./admin/shop/OrderManager'));

// --- Always-loaded Component Imports ---
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
const AIChatbot = React.lazy(() => import('./components/AIChatbot'));
import Footer from './components/Footer';

// --- Suspense Fallback ---
const PageLoader = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin" />
  </div>
);

// --- Main App Component ---
const App = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('Home');
  const [selectedService, setSelectedService] = useState(null);
  const [isDesktopServicesOpen, setIsDesktopServicesOpen] = useState(false);
  const servicesMenuCloseTimeoutRef = useRef(null);
  const [contactSection] = useState('enquiry');

  // Blog State
  const [selectedPost, setSelectedPost] = useState(null);

  // Shop State
  const [selectedShopProduct, setSelectedShopProduct] = useState(null);
  const [isCheckout, setIsCheckout] = useState(false);
  const { itemCount, setIsOpen: setCartOpen } = useCart();

  // Admin State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPage, setAdminPage] = useState('dashboard');

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, adminPage, selectedPost]);

  useEffect(() => {
    // Skip smooth scroll on touch devices for better performance
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

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

    let rafId;
    function raf(time) {
      if (document.hidden) {
        rafId = requestAnimationFrame(raf);
        return;
      }
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    const applyHashRoute = () => {
      const hash = (window.location.hash || '').toLowerCase();
      if (hash === '#contact-enquiry') {
        setSelectedService(null);
        setCurrentPage('Contact Us');
        window.setTimeout(() => window.scrollTo(0, 0), 0);
      }
    };

    applyHashRoute();
    window.addEventListener('hashchange', applyHashRoute);
    return () => window.removeEventListener('hashchange', applyHashRoute);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page === 'Services') {
      setSelectedService(null);
    }
  };

  const handleServiceSelectFromMenu = (service) => {
    setCurrentPage('Services');
    setSelectedService(service);
  };

  const handleStartProjectFromService = () => {
    setSelectedService(null);
    setCurrentPage('Contact Us');
    window.location.hash = 'contact-enquiry';
  };

  const handleScheduleCallFromService = () => {
    setSelectedService(null);
    setCurrentPage('Contact Us');
    window.location.hash = 'contact-enquiry';
  };

  const openDesktopServicesMenu = () => {
    if (servicesMenuCloseTimeoutRef.current) {
      clearTimeout(servicesMenuCloseTimeoutRef.current);
      servicesMenuCloseTimeoutRef.current = null;
    }
    setIsDesktopServicesOpen(true);
  };

  const closeDesktopServicesMenuWithDelay = () => {
    if (servicesMenuCloseTimeoutRef.current) {
      clearTimeout(servicesMenuCloseTimeoutRef.current);
    }
    servicesMenuCloseTimeoutRef.current = setTimeout(() => {
      setIsDesktopServicesOpen(false);
      servicesMenuCloseTimeoutRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (servicesMenuCloseTimeoutRef.current) {
        clearTimeout(servicesMenuCloseTimeoutRef.current);
      }
    };
  }, []);

  // Handle Admin Routing
  if (currentPage === 'Admin') {
    if (!isAdminLoggedIn) {
      return <Suspense fallback={<PageLoader />}><Login onLogin={setIsAdminLoggedIn} /></Suspense>;
    }
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminLayout
          currentPage={adminPage}
          onNavigate={setAdminPage}
          onLogout={() => { setIsAdminLoggedIn(false); }}
        >
          {adminPage === 'dashboard' && <Dashboard onNavigate={setAdminPage} />}
          {adminPage === 'projects' && <ProjectManager />}
          {adminPage === 'blog' && <BlogManager />}
          {adminPage === 'inquiries' && <Inquiries />}
          {adminPage === 'shop-products' && <ProductManager />}
          {adminPage === 'shop-orders' && <OrderManager />}
        </AdminLayout>
      </Suspense>
    );
  }

  return (
    <div className="font-sans bg-[#f4f4f4] min-h-screen selection:bg-[#C5A059] selection:text-white text-stone-900 cursor-none">
      <style>{`
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
              Profile
            </span>
            <div
              className="relative"
              onMouseEnter={openDesktopServicesMenu}
              onMouseLeave={closeDesktopServicesMenuWithDelay}
            >
              <span
                onClick={() => handlePageChange('Services')}
                className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
              >
                Services
              </span>

              {isDesktopServicesOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-80"
                  onMouseEnter={openDesktopServicesMenu}
                  onMouseLeave={closeDesktopServicesMenuWithDelay}
                >
                <div className="bg-black/95 border border-white/10 backdrop-blur-md p-3 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      handlePageChange('Services');
                      setIsDesktopServicesOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-[10px] tracking-[0.2em] uppercase text-white/70 hover:text-[#C5A059] hover:bg-white/5 transition-colors"
                  >
                    View All Services
                  </button>
                  <div className="h-px bg-white/10 my-2" />
                  {SERVICES_QUICK_ACCESS.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        handleServiceSelectFromMenu(service);
                        setIsDesktopServicesOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-[11px] tracking-[0.12em] uppercase text-white/60 hover:text-[#C5A059] hover:bg-white/5 transition-colors"
                    >
                      {service.title}
                    </button>
                  ))}
                </div>
                </div>
              )}
            </div>
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
            <span
              onClick={() => setCurrentPage('Contact Us')}
              className="text-xs font-medium tracking-[0.15em] uppercase cursor-pointer text-white/70 hover:text-white transition-colors duration-300"
            >
              Contact
            </span>
          </nav>

          <div className="flex items-center gap-8 ml-auto">

            {/* Cart Button */}
            {currentPage === 'Shop' && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 text-white hover:text-[#C5A059] transition-colors duration-300 group mr-2 md:mr-4"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-0 bg-[#C5A059] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center border-2 border-[#0a0a0a]">
                    {itemCount}
                  </span>
                )}
              </button>
            )}

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

      <Navigation
        isOpen={isNavOpen}
        setIsOpen={setIsNavOpen}
        setPage={handlePageChange}
        onServiceSelect={handleServiceSelectFromMenu}
      />

      <Suspense fallback={<PageLoader />}>
        <main>
          {currentPage === 'Home' && <Home setPage={setCurrentPage} />}
          {currentPage === 'Projects' && <ProjectsPage />}
          {currentPage === 'Services' && (
            selectedService ? (
              <ServiceDetailPage
                service={selectedService}
                onBack={() => setSelectedService(null)}
                onStartProject={handleStartProjectFromService}
                onScheduleCall={handleScheduleCallFromService}
              />
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
          {currentPage === 'Shop' && (
            isCheckout ? (
              <CheckoutPage onBack={() => setIsCheckout(false)} />
            ) : selectedShopProduct ? (
              <ProductDetail product={selectedShopProduct} onBack={() => setSelectedShopProduct(null)} />
            ) : (
              <ShopPage onViewProduct={setSelectedShopProduct} />
            )
          )}
        </main>
      </Suspense>

      <CartDrawer onCheckout={() => { setIsCheckout(true); setCurrentPage('Shop'); }} />
      <Suspense fallback={null}><AIChatbot setPage={setCurrentPage} /></Suspense>
      <Footer setPage={setCurrentPage} />
    </div>
  );
};

export default App;
