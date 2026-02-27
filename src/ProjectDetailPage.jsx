import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowLeft, MapPin, Calendar, Maximize2, CheckCircle2 } from "lucide-react";
import { normalizeAssetUrl } from "./services/api";

export default function ProjectDetailPage({ project, onBack }) {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!project) return null;

    const resolveImageSrc = (image) => {
        if (!image) return image;
        if (typeof image === 'string') return normalizeAssetUrl(image);
        return normalizeAssetUrl(image.file_path || image.thumbnail_path || image.path || image.url);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#0a0a0a] text-white min-h-screen relative z-50"
        >
            {/* --- BACK BUTTON --- */}
            <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={onBack}
                className="fixed top-20 left-6 md:left-12 z-50 flex items-center gap-2 text-white/60 hover:text-[#C5A059] transition-colors group"
            >
                <div className="p-2 border border-white/30 rounded-lg group-hover:border-[#C5A059] group-hover:bg-[#C5A059]/10 transition-all">
                    <ArrowLeft size={18} />
                </div>
                <span className="text-xs uppercase tracking-[0.15em] hidden md:block">Back</span>
            </motion.button>

            {/* --- HERO SECTION --- */}
            <div ref={containerRef} className="relative h-[100vh] w-full overflow-hidden">
                <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full bg-stone-900">
                    <motion.img
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        src={normalizeAssetUrl(project.cover_image || project.coverImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920')}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920';
                        }}
                    />
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/30" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 md:pb-24 max-w-7xl mx-auto pointer-events-none">
                    <div className="overflow-hidden">
                        <motion.span
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                            className="block text-[#C5A059] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 font-sans"
                        >
                            {project.category}
                        </motion.span>
                    </div>

                    <div className="overflow-hidden">
                        <motion.h1
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                            className="text-3xl sm:text-5xl md:text-[6rem] font-logo uppercase max-w-5xl leading-[0.9] tracking-tighter"
                        >
                            {project.title}
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="flex flex-wrap gap-x-6 gap-y-4 md:gap-8 mt-10 md:mt-12 text-white/70 text-[13px] md:text-sm tracking-wide"
                    >
                        <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-[#C5A059]" /> {project.location}
                        </div>
                        <div className="flex items-center gap-2">
                            <Maximize2 size={14} className="text-[#C5A059]" /> {project.area}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-[#C5A059]" /> {project.year}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-32 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-12 md:gap-20 relative z-10 bg-[#0a0a0a]">

                {/* Left: Description & Highlights */}
                <div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-2xl md:text-5xl font-logo uppercase mb-8 md:mb-10 text-white/90 tracking-wide"
                    >
                        The Vision
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-base md:text-xl leading-relaxed text-stone-400 mb-12 md:mb-16 font-light"
                    >
                        {project.description}
                    </motion.p>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base md:text-lg font-logo uppercase mb-6 flex items-center gap-3 text-white/80 tracking-widest"
                    >
                        <CheckCircle2 size={20} className="text-[#C5A059]" /> Key Highlights
                    </motion.h3>
                    <ul className="space-y-4 mb-16">
                        {project.highlights && Array.isArray(project.highlights) && project.highlights.length > 0 ? (
                            project.highlights.map((item, idx) => (
                                <motion.li
                                    key={idx}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 + (idx * 0.1) }}
                                    className="flex items-start gap-4 text-stone-400"
                                >
                                    <span className="h-[1px] w-6 bg-[#C5A059] mt-3 opacity-50 block shrink-0" />
                                    {item}
                                </motion.li>
                            ))
                        ) : (
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-stone-500 italic"
                            >
                                Key highlights will be added soon.
                            </motion.p>
                        )}
                    </ul>
                </div>

                {/* Right: Project Data */}
                <div className="md:pt-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="bg-white/5 border border-white/10 p-8 md:p-10 backdrop-blur-sm sticky top-32"
                    >
                        <h3 className="text-[10px] tracking-[0.4em] uppercase text-[#C5A059] mb-8 pb-4 border-b border-white/10 font-sans font-bold">
                            Project Details
                        </h3>

                        <div className="space-y-8">
                            <div className="space-y-1">
                                <span className="block text-x text-white/40 uppercase tracking-widest">Client</span>
                                <p className="text-lg font-sans font-medium">{project.client || "Confidential"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-xs text-white/40 uppercase tracking-widest">Scope</span>
                                {project.scope && Array.isArray(project.scope) && project.scope.length > 0 ? (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {project.scope.map((s) => (
                                            <span key={s} className="text-xs border border-white/20 px-3 py-1 rounded-full text-white/70">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-white/50 text-sm">Scope details coming soon</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <span className="block text-xs text-white/40 uppercase tracking-widest">Design Style</span>
                                <p className="text-lg font-sans font-medium">{project.design_style || project.designStyle || "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="block text-xs text-white/40 uppercase tracking-widest">Status</span>
                                <p className="text-lg font-sans font-medium">{project.status}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* --- GALLERY --- */}
            {
                project.images && project.images.length > 0 && (
                    <section className="bg-white text-black py-16 md:py-32 px-6 md:px-12">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-12 md:mb-20 overflow-hidden">
                                <motion.div
                                    initial={{ y: "100%" }}
                                    whileInView={{ y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                >
                                    <span className="text-[#C5A059] tracking-[0.4em] uppercase text-[10px] md:text-xs font-bold font-sans">Visual Journey</span>
                                    <h2 className="text-3xl md:text-5xl font-logo uppercase mt-4 tracking-widest">Gallery</h2>
                                </motion.div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                                {project.images.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                                        className={`relative overflow-hidden group ${idx % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'}`}
                                    >
                                        <img
                                            src={resolveImageSrc(img)}
                                            alt={`${project.title} - ${idx + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>
                )
            }

            {/* --- NEXT PROJECT CTA (Optional - Placeholder) --- */}
            <div className="bg-[#0a0a0a] py-32 text-center border-t border-white/10">
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    onClick={onBack}
                    className="group relative inline-flex flex-col items-center gap-2 text-white hover:text-[#C5A059] transition-colors text-lg tracking-widest uppercase"
                >
                    <span>View All Projects</span>
                    <span className="h-[1px] w-0 bg-[#C5A059] group-hover:w-full transition-all duration-300" />
                </motion.button>
            </div>

        </motion.div >
    );
}
