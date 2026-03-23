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
    if (isTouch) return;

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
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
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
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600&family=Michroma&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&display=swap');
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

      <Navigation isOpen={isNavOpen} setIsOpen={setIsNavOpen} setPage={setCurrentPage} />

      <Suspense fallback={<PageLoader />}>
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
      {currentPage !== 'Contact Us' && <Footer setPage={setCurrentPage} />}
    </div>
  );
};

export default App;
