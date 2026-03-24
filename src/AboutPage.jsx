import React, { useRef } from "react";
import { useScroll, useTransform, useInView, motion } from "framer-motion";
import { Quote, Star, Layout, Hammer, Building2, Construction, Zap, ClipboardCheck, ShieldCheck, Leaf, PenTool, Target, Compass } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
};

const imageReveal = {
    hidden: { opacity: 0, scale: 1.08 },
    visible: { opacity: 1, scale: 1 }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.08 } }
};

const CORE_COMPETENCIES = [
    {
        title: "Design–Build Expertise",
        desc: "Seamlessly bridging the gap between innovative architectural concepts and turnkey execution, ensuring design integrity at every stage.",
        icon: PenTool,
    },
    {
        title: "Interior Design & Fit-Outs",
        desc: "Crafting bespoke interior environments that balance aesthetic luxury with optimal spatial functionality and user experience.",
        icon: Layout,
    },
    {
        title: "Civil Construction & Structural Works",
        desc: "Delivering robust structural solutions with precision engineering, utilizing both traditional RCC and advanced PEB systems.",
        icon: Building2,
    },
    {
        title: "Project Management & Consultancy",
        desc: "Strategic orchestration of complex projects, prioritizing transparent communication, risk mitigation, and on-time delivery.",
        icon: ShieldCheck,
    },
];

const ACCOMPLISHMENTS = [
    { number: "20", label: "Years of Excellence" },
    { number: "100%", label: "Completion Rate" },
    { number: "500+", label: "Projects Delivered" },
    { number: "3M+", label: "Sq.Ft Designed" },
];

const REVIEWS = [
    {
        name: "Arun Kumar",
        role: "Corporate Client",
        text: "Adroit Design brought our corporate vision to life with exceptional precision. Their attention to detail and commitment to quality is truly unmatched in the industry."
    },
    {
        name: "Priya Sharma",
        role: "Homeowner",
        text: "The team beautifully blended luxury and functionality for our residence. The turnkey execution made the entire process seamless and stress-free."
    },
    {
        name: "David Chen",
        role: "Retail Director",
        text: "A truly professional team that consistently delivers premium quality within strict timelines. Their commercial Architecture expertise elevated our brand presence."
    }
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 180]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);

    return (
        <div ref={containerRef} className="bg-[#050505] text-stone-200 overflow-hidden pt-24 md:pt-32 pb-24 font-sans">

            {/* HERO */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-[#0a0a0a]">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a] z-10" />
                    <img 
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
                        alt="Hero" 
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                </div>
                
                <div className="relative z-20 text-center px-6">
                    <motion.h1 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white font-logo text-4xl md:text-7xl uppercase tracking-[0.2em] mb-6"
                    >
                        Building Excellence Through Design
                    </motion.h1>
                </div>
            </section>

            {/* 1. INTRODUCTION */}
            <section className="py-20 md:py-32 px-6 md:px-24 max-w-7xl mx-auto text-center">
                <Reveal>
                    <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Introduction</span>
                            <h2 className="text-3xl md:text-5xl font-logo uppercase tracking-widest text-white mb-8">Who We Are</h2>
                            <p className="text-stone-300 text-lg leading-relaxed font-light mb-8">
                                Adroit Design India Private Limited is a premier Architecture & Interior firm, committed to shaping spaces that resonate with functionality, aesthetic excellence, and enduring value.
                            </p>
                            <p className="text-stone-400 text-sm leading-relaxed mb-10">
                                As a lead solution provider in the built environment, we integrate architectural innovation with rigorous technical execution. Our multidisciplinary approach ensures that every project—from luxury residences to complex industrial facilities—is delivered with precision, transparency, and a focus on long-term sustainability.
                            </p>
                </Reveal>
            </section>

            {/* 2. ACCOMPLISHMENTS */}
            <section className="py-20 px-6 md:px-24 bg-white/5 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold text-center">Accomplishments</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-16 text-center">Our Milestones</h2>
                    </Reveal>

                    <div className="bg-[#111] py-24 md:py-32">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                    <h2 className="text-white font-logo text-4xl md:text-6xl uppercase tracking-widest mb-16">20 Years of Craft</h2>
                    <div className="flex flex-wrap justify-center gap-10 md:gap-20">
                        {ACCOMPLISHMENTS.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <span className={item.number === "100%" ? "text-[#C5A059] text-3xl md:text-5xl font-logo mb-2" : "text-[#C5A059] text-5xl md:text-8xl font-logo mb-2"}>{item.number}</span>
                                <span className="text-white/30 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                </div>
            </section>

            {/* 3. CORE COMPETENCIES */}
            <section className="py-20 md:py-32 px-6 md:px-24">
                <div className="max-w-7xl mx-auto text-center">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Core Competencies</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-16">Our Expertise</h2>
                    </Reveal>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {CORE_COMPETENCIES.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ y: -5 }}
                                className="p-8 border border-white/10 hover:bg-[#C5A059] hover:border-[#C5A059] transition-all duration-300 group flex flex-col justify-start text-left"
                            >
                                <div className="mb-6 text-[#C5A059] group-hover:text-black transition-colors">
                                    {item.icon && <item.icon size={32} strokeWidth={1.5} />}
                                </div>
                                <h3 className="text-lg md:text-xl font-logo uppercase tracking-wider group-hover:text-black text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-stone-400 group-hover:text-black/80 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. VISION & 5. MISSION */}
            <section className="py-20 bg-stone-900 border-y border-stone-800">
                <div className="max-w-7xl mx-auto px-6 md:px-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-16"
                    >
                        <div className="bg-white p-12 md:p-16 shadow-xl border-t-4 border-[#C5A059]">
                            <Target className="text-[#C5A059] mb-8" size={32} />
                            <h3 className="text-2xl font-logo uppercase tracking-widest text-stone-900 mb-6">Our Vision</h3>
                            <p className="text-stone-600 leading-relaxed font-light">
                                To be the global vanguard of design-build excellence, pioneering sustainable architectural innovations and high-performance spatial environments that set new benchmarks for the built industry.
                            </p>
                        </div>
                        <div className="bg-white p-12 md:p-16 shadow-xl border-t-4 border-stone-800">
                            <Compass className="text-stone-800 mb-8" size={32} />
                            <h3 className="text-2xl font-logo uppercase tracking-widest text-stone-900 mb-6">Our Mission</h3>
                            <p className="text-stone-600 leading-relaxed font-light">
                                To deliver integrated, transparent, and superior design solutions through collaborative engineering and craftsmanship, ensuring project integrity from concept to collection, while creating lasting value for our clients and the environment.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. KEY PROFILE */}
            <section className="py-20 md:py-32 px-6 md:px-24">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <Reveal>
                        <motion.div
                            variants={imageReveal}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="overflow-hidden border border-white/10 p-2"
                        >
                            <img
                                src="/assets/Founder.jpg"
                                alt="Franklin Maxwell A"
                                className="w-full h-[400px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition duration-1000"
                                onClick={(e) => {
                                    if (window.innerWidth < 1024 && e.currentTarget.classList.contains('grayscale')) {
                                        e.currentTarget.classList.remove('grayscale');
                                    }
                                }}
                            />
                        </motion.div>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">
                            Key Profile
                        </span>

                        <h3 className="text-[#C5A059] tracking-widest text-sm uppercase mb-2">Founder & Managing Director</h3>
                        <h2 className="text-3xl md:text-6xl font-logo text-white mb-8 uppercase tracking-wider">
                            Franklin Maxwell A
                        </h2>

                        <div className="space-y-6 text-stone-400 text-base md:text-lg leading-relaxed font-light">
                            <p>
                                Adroit Design India Pvt. Ltd was founded by Architect Franklin Maxwell A, holding an M.Arch in Building Management from Sathyabama University and a B.Arch from AMACE, University of Madras.
                            </p>
                            <p>
                                With over <strong>20 years</strong> of profound experience, he spearheads the firm's diverse portfolio encompassing Corporate, Industrial, Commercial, Institutional & Residential Architecture, including Turnkey Interiors and PEB Constructions.
                            </p>
                            <p>
                                His visionary leadership and relentless pursuit of perfection have cemented Adroit Design as a trusted name for premium architectural and construction solutions across the region.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* 7. THE TEAM */}
            <section className="py-20 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden px-6 md:px-24">
                <div className="max-w-7xl mx-auto mb-16 text-center">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">The Team</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-6 mt-2">
                            The Minds Behind Excellence
                        </h2>
                        <p className="text-stone-400 text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto">
                            Our team comprises over 20 skilled architects, engineers, and designers who share a singular vision: to craft spaces that inspire. With diverse expertise spanning corporate architecture, industrial design, turnkey interiors, and sustainable construction, we collaborate seamlessly to bring ambitious projects to life.
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={0.3}>
                    <div className="max-w-6xl mx-auto overflow-hidden border border-white/10 group bg-black/50">
                        <img
                            src="/assets/Team.jpg"
                            alt="The Team"
                            className="w-full h-auto object-contain grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                            onClick={(e) => {
                                if (window.innerWidth < 1024 && e.currentTarget.classList.contains('grayscale')) {
                                    e.currentTarget.classList.remove('grayscale', 'brightness-75');
                                }
                            }}
                        />
                    </div>
                </Reveal>
            </section>

            {/* 8. REVIEWS & TESTIMONIALS */}
            <section className="py-20 md:py-32 px-6 md:px-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold text-center">Reviews & Testimonials</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-16 text-center">Client Speak</h2>
                    </Reveal>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        {REVIEWS.map((review, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                className="p-10 border border-white/10 bg-white/5 relative hover:-translate-y-2 transition-transform duration-500"
                            >
                                <Quote className="text-[#C5A059] w-10 h-10 mb-6 opacity-50" />
                                <p className="text-stone-300 font-light leading-relaxed mb-8 italic">"{review.text}"</p>
                                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                                    <div>
                                        <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-1">{review.name}</h4>
                                        <p className="text-[#C5A059] text-xs uppercase tracking-widest">{review.role}</p>
                                    </div>
                                    <div className="flex gap-1 text-[#C5A059]">
                                        <Star fill="currentColor" size={14} />
                                        <Star fill="currentColor" size={14} />
                                        <Star fill="currentColor" size={14} />
                                        <Star fill="currentColor" size={14} />
                                        <Star fill="currentColor" size={14} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

        </div>
    );
}

/* Elegant reveal helper */
function Reveal({ children, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
