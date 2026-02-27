import React, { useRef } from "react";
import { useScroll, useTransform, useInView, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

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
        title: "Turnkey Interior Solutions",
        description: "Complete end-to-end execution for Corporate, IT/ITES, Commercial, Healthcare, Retail & Residential interiors."
    },
    {
        title: "Design–Build Expertise",
        description: "Integrated approach combining architectural design, interior design, engineering & execution under one roof."
    },
    {
        title: "Corporate & Commercial Office Specialists",
        description: "Strong capability in large-scale office fit-outs, workspace planning, and functional corporate environments."
    },
    {
        title: "Civil Construction & Structural Works",
        description: "Execution of commercial buildings and interior civil works with quality control and timeline discipline."
    },
    {
        title: "MEP & Technical Integration",
        description: "Efficient coordination of HVAC, Electrical, Plumbing, Fire & ELV systems for seamless project delivery."
    },
    {
        title: "Project Management Excellence",
        description: "Structured planning, cost control, vendor coordination, and milestone-driven execution."
    },
    {
        title: "Quality & Detail-Oriented Execution",
        description: "Focus on precision, finishing standards, and compliance with industry best practices."
    },
    {
        title: "Sustainable & Efficient Design Solutions",
        description: "Space optimization, energy efficiency, and long-term value engineering."
    }
];

const ACCOMPLISHMENTS = [
    { number: "19+", label: "Years of Excellence" },
    { number: "500+", label: "Projects Delivered" },
    { number: "3M+", label: "Sq.Ft Designed" },
    { number: "100%", label: "Client Satisfaction" },
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
        text: "A truly professional team that consistently delivers premium quality within strict timelines. Their commercial architecture expertise elevated our brand presence."
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
            <section className="relative h-[60vh] md:h-[80vh] flex items-center justify-center -mt-24 md:-mt-32">
                <motion.img
                    style={{ y: heroY, opacity: heroOpacity }}
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/75" />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="relative text-center px-6"
                >
                    <motion.span
                        variants={fadeUp}
                        className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] uppercase font-bold"
                    >
                        Adroit Design India
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        className="text-4xl sm:text-5xl md:text-7xl font-logo text-white mt-4 md:mt-6 leading-tight uppercase tracking-widest"
                    >
                        About Us
                    </motion.h1>

                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 60 }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="w-px bg-[#C5A059]/50 mx-auto mt-8 md:mt-10"
                    />
                </motion.div>
            </section>

            {/* 1. INTRODUCTION */}
            <section className="py-20 md:py-32 px-6 md:px-24 max-w-7xl mx-auto text-center">
                <Reveal>
                    <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Introduction</span>
                    <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-10">Who We Are</h2>
                    <p className="text-stone-400 text-base md:text-xl leading-relaxed max-w-4xl mx-auto font-light">
                        <strong>Adroit Design India Private Limited</strong> is a premier architecture and design firm dedicated to creating enduring, innovative, and purposeful spaces. We merge aesthetic elegance with functional brilliance, setting new benchmarks in corporate, commercial, and residential architecture. Our commitment to excellence drives us to transform visions into tangible masterpieces.
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

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center"
                    >
                        {ACCOMPLISHMENTS.map((item, i) => (
                            <motion.div key={i} variants={fadeUp} className="p-6 border border-white/10 hover:border-[#C5A059]/50 transition duration-500 bg-[#0a0a0a]">
                                <h3 className="text-4xl md:text-5xl text-[#C5A059] font-logo mb-4">{item.number}</h3>
                                <p className="text-white/60 text-sm uppercase tracking-widest font-bold">{item.label}</p>
                            </motion.div>
                        ))}
                    </motion.div>
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
                                <h3 className="text-lg md:text-xl font-logo uppercase tracking-wider group-hover:text-black text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-stone-400 group-hover:text-black/80 font-light leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. VISION & 5. MISSION */}
            <section className="py-20 bg-stone-900 border-y border-stone-800">
                <div className="max-w-7xl mx-auto px-6 md:px-24 grid md:grid-cols-2 gap-16 md:gap-24">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Vision</span>
                        <h2 className="text-3xl font-logo text-white uppercase tracking-widest mb-6">Our Vision</h2>
                        <p className="text-stone-400 text-lg leading-relaxed font-light">
                            To be the vanguard of architectural innovation globally, creating spaces that seamlessly integrate sustainability, state-of-the-art technology, and timeless aesthetics. We envision a future where our designs elevate the human experience and harmonize with their environment.
                        </p>
                    </Reveal>
                    <Reveal delay={0.2}>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Mission</span>
                        <h2 className="text-3xl font-logo text-white uppercase tracking-widest mb-6">Our Mission</h2>
                        <p className="text-stone-400 text-lg leading-relaxed font-light">
                            To deliver unparalleled architectural and interior solutions through meticulous planning, impeccable execution, and unwavering dedication to quality. We strive to exceed client expectations by fostering collaborative relationships and maintaining rigorous standards of excellence in every project.
                        </p>
                    </Reveal>
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
                                With over <strong>19 years</strong> of profound experience, he spearheads the firm's diverse portfolio encompassing Corporate, Industrial, Commercial, Institutional & Residential Architecture, including Turnkey Interiors and PEB Constructions.
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
                    <div className="max-w-6xl mx-auto h-[400px] md:h-[600px] overflow-hidden border border-white/10 group">
                        <img
                            src="/assets/Team.jpg"
                            alt="The Team"
                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
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
