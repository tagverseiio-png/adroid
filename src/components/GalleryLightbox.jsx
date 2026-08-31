import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryLightbox({ images, currentIndex, isOpen, onClose, onNavigate }) {
    const goPrev = useCallback(() => {
        if (currentIndex > 0) onNavigate(currentIndex - 1);
    }, [currentIndex, onNavigate]);

    const goNext = useCallback(() => {
        if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    }, [currentIndex, images.length, onNavigate]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
        };
        document.addEventListener("keydown", handleKey);

        // Disable body scroll
        document.body.style.overflow = "hidden";

        // Also stop Lenis smooth scroll if available
        if (window.__lenis) {
            window.__lenis.stop();
        }

        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
            if (window.__lenis) {
                window.__lenis.start();
            }
        };
    }, [isOpen, onClose, goPrev, goNext]);

    if (!images || images.length === 0) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
                    style={{ isolation: "isolate" }}
                    onClick={onClose}
                    data-lenis-prevent
                >
                    {/* Close */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-10 p-2 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>

                    {/* Counter */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/50 text-xs tracking-[0.3em] uppercase font-sans select-none">
                        {currentIndex + 1} / {images.length}
                    </div>

                    {/* Prev */}
                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-2 md:left-6 z-10 p-3 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={28} />
                        </button>
                    )}

                    {/* Next */}
                    {currentIndex < images.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-2 md:right-6 z-10 p-3 text-white/70 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                            aria-label="Next image"
                        >
                            <ChevronRight size={28} />
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="flex items-center justify-center"
                        style={{ width: "100%", height: "100%", padding: "60px 80px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex]}
                                alt={`Gallery image ${currentIndex + 1}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25 }}
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "calc(100vh - 120px)",
                                    width: "auto",
                                    height: "auto",
                                    objectFit: "contain",
                                    display: "block",
                                    userSelect: "none",
                                    margin: "auto",
                                }}
                                draggable={false}
                            />
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
