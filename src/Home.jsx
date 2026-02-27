import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, useScroll, useTransform, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { projectsAPI, normalizeAssetUrl } from './services/api';
// import heroVideo from '/assets/hero-video.mp4';
const heroVideo = "/assets/hero-video.mp4";

// --- Assets ---
const IMAGES = {
    hero: "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop",
    interior: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2574&auto=format&fit=crop",
    exterior: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop",
    detail: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2592&auto=format&fit=crop",
    office: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
    construction: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2631&auto=format&fit=crop"
};

// --- Sub-Components ---

const Hero = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8;
        }
    }, []);

    // Parallax Effect for Text
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-[#050505] pt-20">
            {/* Video Background */}
            <motion.div
                className="absolute inset-0"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
            >
                <div className="absolute inset-0 bg-black/30 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40 z-10" />
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
            </motion.div>

            {/* Hero Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center px-6 md:px-24 text-center">
                <motion.div style={{ y: y1 }} className="flex flex-col items-center">
                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}
                            className="text-white font-logo text-4xl sm:text-6xl md:text-[8rem] leading-none tracking-[0.1em] sm:tracking-[0.2em] font-bold mix-blend-difference uppercase"
                        >
                            ADROIT DESIGN
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80px" }}
                        transition={{ delay: 1.2, duration: 1, ease: "easeInOut" }}
                        className="h-[1px] bg-[#C5A059] my-6 md:my-10"
                    />

                    <motion.p
                        initial={{ opacity: 0, letterSpacing: "0em" }}
                        animate={{ opacity: 1, letterSpacing: window.innerWidth < 768 ? "0.1em" : "0.4em" }}
                        transition={{ delay: 1.5, duration: 1.5 }}
                        className="text-white/90 text-[10px] md:text-sm uppercase font-medium tracking-[0.1em] md:tracking-[0.5em] font-sans px-4"
                    >
                        Architecture <span className="text-[#C5A059] px-1 md:px-2">|</span> Interiors <span className="text-[#C5A059] px-1 md:px-2">|</span> Construction
                    </motion.p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ y: y2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-12 left-0 right-0 z-20 flex justify-center"
            >
                <div className="flex flex-col items-center text-white/30 gap-2">
                    <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const ServicesSection = () => {
    const services = [
        { title: "Architecture", desc: "Form follows function in our comprehensive structural design process." },
        { title: "Interior Design", desc: "Curating sensory atmospheres through material, light, and spatial harmony." },
        { title: "Construction", desc: "Turnkey execution with rigorous precision and management." },
        { title: "Master Planning", desc: "Strategic development planning for large-scale communities." },
    ];

    return (
        <section className="py-20 md:py-32 bg-[#0a0a0a] text-white relative z-10">
            <div className="px-6 md:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div className="sticky lg:top-32 self-start lg:pr-10">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-[#C5A059] uppercase"
                        >
                            What We Do
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl md:text-3xl lg:text-4xl font-logo uppercase tracking-wider mt-6 md:mt-8 text-white leading-tight"
                        >
                            Comprehensive <br className="hidden lg:block" />
                            Design Solutions
                        </motion.h2>
                        <p className="mt-8 text-sm md:text-base text-stone-400 leading-relaxed font-light max-w-sm">
                            From concept to completion, we deliver integrated design services that transform spaces and create lasting impact.
                        </p>
                    </div>

                    <div className="mt-12 lg:mt-0">
                        <div className="divide-y divide-white/10">
                            {services.map((service, idx) => (
                                <motion.div
                                    key={idx}
                                    className="group py-8 cursor-pointer relative overflow-hidden"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                                >
                                    {/* Hover Background */}
                                    <div className="absolute inset-0 bg-[#C5A059]/5 -inset-x-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between">
                                        <div className="flex-1 pr-8">
                                            <h3 className="text-xl md:text-2xl font-logo uppercase tracking-wider text-white group-hover:text-[#C5A059] transition-colors duration-300 mb-3">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-stone-400 group-hover:text-black/80 transition-colors duration-300 font-light leading-relaxed">
                                                {service.desc}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#C5A059] group-hover:bg-[#C5A059] group-hover:scale-110 transition-all duration-300 flex-shrink-0 mt-4 md:mt-0">
                                            <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white" strokeWidth={2} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeaturedProjectsSection = ({ setPage }) => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchFeaturedProjects = async () => {
            try {
                const response = await projectsAPI.getFeatured(8);
                if (response.success && response.data) {
                    setProjects(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch featured projects:', error);
                // Fallback to static data if API fails
                setProjects([
                    {
                        title: "Azure Villa",
                        location: "Malibu, California",
                        cover_image: IMAGES.exterior,
                        category: "VILLAS"
                    },
                    {
                        title: "The Onyx",
                        location: "Dubai, UAE",
                        cover_image: IMAGES.interior,
                        category: "IT & ITES OFFICES"
                    },
                    {
                        title: "Serenity Spa",
                        location: "Kyoto, Japan",
                        cover_image: IMAGES.detail,
                        category: "CLUBS & RESTO BARS"
                    },
                    {
                        title: "Vanguard HQ",
                        location: "Berlin, Germany",
                        cover_image: IMAGES.office,
                        category: "IT & ITES OFFICES"
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFeaturedProjects();
    }, []);

    if (isLoading) {
        return (
            <section className="py-40 bg-[#f4f4f4]">
                <div className="px-6 md:px-24 text-center">
                    <p className="text-stone-400">Loading selected works...</p>
                </div>
            </section>
        );
    }


    return (
        <section ref={containerRef} className="py-20 md:py-40 bg-[#f4f4f4] overflow-hidden">
            <div className="px-6 md:px-24 mb-12 md:mb-16 flex justify-between items-end gap-4">
                <div>
                    <motion.span
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        className="text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase"
                    >
                        Selected Works
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
                        className="text-3xl md:text-5xl font-logo text-stone-900 uppercase tracking-widest mt-3 md:mt-4"
                    >
                        Curated Excellence
                    </motion.h2>
                </div>
                <button
                    onClick={() => setPage('Projects')}
                    className="flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase hover:text-[#C5A059] transition-colors pb-1 md:pb-2 border-b border-transparent hover:border-[#C5A059] whitespace-nowrap"
                >
                    View All <ArrowRight size={14} className="md:w-4 md:h-4 w-3 h-3" />
                </button>
            </div>

            {/* Horizontal Scroll - Native */}
            <div
                className="flex gap-8 px-6 md:px-24 overflow-x-auto scrollbar-hide pb-10 snap-x"
            >
                {projects.map((proj, idx) => (
                    <motion.div
                        key={proj.id || idx}
                        className="min-w-[85vw] md:min-w-[40vw] aspect-[16/10] relative group select-none snap-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                    >
                        <div className="w-full h-full overflow-hidden relative bg-stone-200">
                            <motion.img
                                src={normalizeAssetUrl(proj.cover_image || proj.coverImage || IMAGES.hero)}
                                alt={proj.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-500" />
                        </div>

                        <div className="mt-6 flex justify-between items-start">
                            <div>
                                <span className="text-[10px] tracking-widest uppercase text-[#C5A059] block mb-1">
                                    {proj.category}
                                </span>
                                <h3 className="text-xl font-logo uppercase tracking-wider text-stone-900">{proj.title}</h3>
                            </div>
                            <p className="text-xs text-stone-400 mt-1 font-light">{proj.location}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

const Home = ({ setPage }) => {
    return (
        <>
            <Hero />
            <ServicesSection />
            <FeaturedProjectsSection setPage={setPage} />
            {/* LeadGen Removed as requested */}
        </>
    );
};

export default Home;
