import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ContactThanksPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-24 flex items-center justify-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10 text-center max-w-lg">
                <h3 className="text-4xl md:text-5xl font-logo text-[#C5A059] mb-6 uppercase tracking-widest">Thank You</h3>
                <p className="text-white/60 font-sans text-base md:text-lg mb-12 leading-relaxed">
                    Your submission has been received. Our team will review your inquiry and contact you shortly.
                </p>
                <a href="/" onClick={(e) => {
                    e.preventDefault();
                    window.history.pushState({}, '', '/');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                }} className="inline-flex items-center gap-3 px-8 md:px-10 py-4 bg-[#C5A059] text-black text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-white group">
                    Return to Home <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
            </motion.div>
        </div>
    );
};

export default ContactThanksPage;
