import React, { useRef } from "react";
import { useScroll, useTransform, useInView, motion } from "framer-motion";

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

const STRENGTHS = [
    "Passion for Design Excellence",
    "Precision in Quality Processes",
    "Timely Execution & Delivery",
    "Meticulous Project Planning",
    "Early Adoption of Technology",
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });

    const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 180]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);

    return (
        <div ref={containerRef} className="bg-[#0a0a0a] text-stone-200 overflow-hidden">

            {/* HERO */}
            <section className="relative h-[70vh] md:h-[90vh] flex items-center justify-center pt-24 md:pt-32">
                <motion.img
                    style={{ y: heroY, opacity: heroOpacity }}
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/65" />

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="relative text-center px-6"
                >
                    <motion.span
                        variants={fadeUp}
                        className="text-[#C5A059] text-[10px] md:text-xs tracking-[0.3em] uppercase font-sans font-bold"
                    >
                        About Us
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        className="text-3xl sm:text-5xl md:text-7xl font-logo text-white mt-4 md:mt-6 leading-tight uppercase tracking-[0.05em] font-light"
                    >
                        Designing<br />
                        <span className="font-light text-white/50">Enduring Architecture</span>
                    </motion.h1>

                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 60 }}
                        transition={{ duration: 1.4, ease: "easeOut" }}
                        className="w-px bg-white/30 mx-auto mt-8 md:mt-10"
                    />
                </motion.div>
            </section>

            {/* FOUNDER */}
            <section className="py-16 md:py-20 px-6 md:px-24 bg-stone-900">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-14 items-center">

                    <Reveal>
                        <motion.div
                            variants={imageReveal}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="overflow-hidden"
                        >
                            <img
                                src="/assets/Founder.jpg"
                                className="w-full h-[350px] md:h-[520px] object-cover grayscale hover:grayscale-0 transition duration-1000"
                            />
                        </motion.div>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <span className="text-[#C5A059] uppercase tracking-widest text-[10px] md:text-xs">
                            Founder & Managing Director
                        </span>

                        <h2 className="text-2xl md:text-5xl font-logo text-white mt-4 md:mt-6 uppercase tracking-wider">
                            Franklin Maxwell A
                        </h2>

                        <p className="mt-6 text-stone-400 text-base md:text-lg leading-relaxed">
                            Adroit Design India Pvt. Ltd was founded by Architect Franklin Maxwell A,
                            holding an M.Arch in Building Management from Sathyabama University and
                            a B.Arch from AMACE, University of Madras.
                        </p>

                        <p className="mt-4 text-stone-400 text-base md:text-lg leading-relaxed">
                            With over <strong>19 years</strong> of experience, he leads Corporate,
                            Industrial, Commercial, Institutional & Residential Architecture,
                            including Turnkey Interiors and PEB Constructions.
                        </p>
                    </Reveal>

                </div>
            </section>

            {/* CORE STRENGTHS */}
            <section className="py-20 px-6 md:px-24 bg-[#050505]">
                <Reveal>
                    <h2 className="text-4xl md:text-5xl font-logo text-white text-center mb-16 uppercase tracking-widest">
                        Our Core Strengths
                    </h2>
                </Reveal>

                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-10"
                >
                    {STRENGTHS.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeUp}
                            whileHover={{ y: -6 }}
                            transition={{ duration: 0.4 }}
                            className="p-10 border border-white/10 hover:border-[#C5A059]/60"
                        >
                            <h3 className="text-lg md:text-xl font-logo text-white uppercase tracking-tight">
                                {item}
                            </h3>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* TEAM - GROUP PHOTO */}
            <TeamSection />

        </div>
    );
}

/* Team Section with Group Photo */
function TeamSection() {
    const sectionRef = useRef(null);
    const imageRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const imageY = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

    return (
        <section ref={sectionRef} className="relative py-16 md:py-32 px-6 md:px-16 overflow-hidden">

            {/* Title */}
            <Reveal>
                <div className="max-w-7xl mx-auto mb-10 md:mb-16">
                    <motion.span
                        className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        The People Behind Excellence
                    </motion.span>
                    <h2 className="text-3xl md:text-7xl font-logo text-white leading-tight uppercase tracking-widest">
                        Our Team
                    </h2>
                </div>
            </Reveal>

            {/* Main Group Photo Container */}
            <div className="w-full relative">

                {/* Parallax Image Container */}
                <motion.div
                    ref={imageRef}
                    className="relative h-[80vh] md:h-[200vh] overflow-hidden"
                    initial={{ opacity: 0, scale: 1.1 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {/* Parallax Background Image */}
                    <motion.div
                        style={{ y: imageY, scale: imageScale }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <img
                            src="/assets/Team.jpg"
                            alt="Adroit Team"
                            className="w-full h-full object-contain"
                        />
                    </motion.div>

                    {/* Subtle Gradient Overlay - Lighter for better face visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>

                {/* Team Description Below Photo */}
                <Reveal delay={0.4}>
                    <div className="mt-12 md:mt-24 grid md:grid-cols-2 gap-10 md:gap-12 items-start">

                        <div>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: "100px" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.6 }}
                                className="h-px bg-gradient-to-r from-[#C5A059] to-transparent mb-6 md:mb-8"
                            />

                            <h3 className="text-2xl md:text-4xl font-logo text-white mb-4 md:mb-6 leading-tight uppercase tracking-wider">
                                United by <span className="font-light text-white/60">Excellence</span>
                            </h3>
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            <motion.p
                                className="text-stone-400 text-base md:text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                Our team comprises over <strong className="text-white">20 skilled architects,
                                    engineers, and designers</strong> who share a singular vision: to craft spaces
                                that inspire, endure, and elevate.
                            </motion.p>

                            <motion.p
                                className="text-stone-400 text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.85 }}
                            >
                                With diverse expertise spanning <strong className="text-white">corporate
                                    architecture, industrial design, turnkey interiors, and sustainable
                                    construction</strong>, we collaborate seamlessly to bring ambitious
                                projects to life with precision and artistry.
                            </motion.p>

                            <motion.p
                                className="text-stone-400 text-lg leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 1 }}
                            >
                                Every member brings a unique blend of creativity and technical mastery,
                                united by our commitment to <strong className="text-white">innovation,
                                    quality, and timely delivery</strong>.
                            </motion.p>
                        </div>

                    </div>
                </Reveal>

            </div>
        </section>
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
