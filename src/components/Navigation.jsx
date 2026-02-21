import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { X, Instagram, Linkedin, Facebook } from 'lucide-react';

const SECTIONS = ['About Us', 'Services', 'Projects', 'Insights', 'Shop', 'Careers', 'Contact Us'];

const SOCIAL_LINKS = {
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN_URL,
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK_URL
};

const Navigation = ({ isOpen, setIsOpen, setPage }) => {
    const menuVariants = {
        closed: { x: "100%", transition: { type: "tween", duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
        open: { x: 0, transition: { type: "tween", duration: 0.8, ease: [0.76, 0, 0.24, 1] } }
    };

    const linkVariants = {
        closed: { opacity: 0, y: 50 },
        open: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.5 } })
    };

    return (
        <>
            {/* Full Screen Overlay */}
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 z-40"
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
            )}

            {/* Menu Panel */}
            <motion.div
                className="fixed top-0 right-0 h-screen w-full md:w-[55vw] bg-[#0a0a0a] z-50 flex flex-col justify-between px-12 md:px-16 py-8 shadow-2xl overflow-y-auto"
                variants={menuVariants}
                initial="closed"
                animate={isOpen ? "open" : "closed"}
            >
                {/* Header with Close Button */}
                <div className="flex justify-end items-center pb-10 border-b border-white/10">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-[#C5A059] transition-colors duration-300 cursor-pointer p-2 rounded-lg hover:bg-white/5"
                        aria-label="Close menu"
                    >
                        <X size={28} strokeWidth={1.5} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex flex-col gap-0 flex-1 justify-center">
                    {SECTIONS.map((item, i) => (
                        <motion.div
                            key={item}
                            custom={i}
                            variants={linkVariants}
                            className="group cursor-pointer py-6 border-b border-white/5 hover:border-white/10 transition-all duration-300"
                            onClick={() => { setPage(item); setIsOpen(false); }}
                        >
                            <div className="flex items-end gap-6">
                                <span className="text-sm text-[#C5A059] font-mono opacity-70">0{i + 1}</span>
                                <h2 className="text-3xl md:text-5xl font-logo text-white group-hover:text-[#C5A059] transition-colors duration-500 font-bold tracking-tight uppercase">
                                    {item}
                                </h2>
                                <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent group-hover:from-[#C5A059]/20 transition-all duration-300 mb-2" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-12 border-t border-white/10 space-y-6">
                    <p className="text-xs text-white/50 tracking-[0.2em] uppercase font-mono">Connect With Us</p>
                    <div className="flex gap-8 text-white/50">
                        {SOCIAL_LINKS.instagram && (
                            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                        {SOCIAL_LINKS.linkedin && (
                            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                        {SOCIAL_LINKS.facebook && (
                            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#C5A059] transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Navigation;
