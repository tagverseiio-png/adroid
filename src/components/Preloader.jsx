import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const Preloader = ({ setLoading }) => {
    return (
        <motion.div
            className="fixed inset-0 z-[60] bg-[#050505] flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 0.6, delay: 1.2, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => setLoading(false)}
        >
            <div className="overflow-hidden relative">
                <motion.h1
                    className="text-white font-logo text-4xl md:text-6xl tracking-[0.4em] uppercase font-bold"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                >
                    ADROIT
                </motion.h1>
            </div>
            <motion.div
                className="absolute bottom-10 w-full flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="w-64 h-[1px] bg-white/20 overflow-hidden">
                    <motion.div
                        className="h-full bg-[#C5A059]"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Preloader;
