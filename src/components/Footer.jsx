import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowUp, Instagram, Linkedin, Facebook } from 'lucide-react';
import { inquiriesAPI } from '../services/api';

const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS;
const CONTACT_EMAILS = import.meta.env.VITE_CONTACT_EMAILS;
const CONTACT_PHONES = import.meta.env.VITE_CONTACT_PHONES;
const MAPS_EMBED_URL = import.meta.env.VITE_MAPS_EMBED_URL;
const SOCIAL_LINKS = {
    facebook: import.meta.env.VITE_SOCIAL_FACEBOOK_URL,
    instagram: import.meta.env.VITE_SOCIAL_INSTAGRAM_URL,
    linkedin: import.meta.env.VITE_SOCIAL_LINKEDIN_URL
};

const Footer = ({ setPage }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.email) {
            setSubmitMessage('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await inquiriesAPI.create({
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                subject: 'Quick Enquiry from Footer',
                message: 'Quick enquiry submitted from footer',
                type: 'enquiry'
            });

            if (response.success) {
                setSubmitMessage('✓ Thank you! We will get back to you soon.');
                setFormData({ name: '', phone: '', email: '' });
                setTimeout(() => setSubmitMessage(''), 3000);
            }
        } catch (error) {
            console.error('Failed to submit inquiry:', error);
            setSubmitMessage('✗ Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const emailList = CONTACT_EMAILS
        ? CONTACT_EMAILS.split(',').map((item) => item.trim()).filter(Boolean)
        : [];
    const phoneList = CONTACT_PHONES
        ? CONTACT_PHONES.split(',').map((item) => item.trim()).filter(Boolean)
        : [];

    return (
        <footer className="bg-[#050505] text-white pt-16 md:pt-24 pb-10 md:pb-12 px-6 md:px-12 border-t border-white/5 cursor-default relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">

                {/* QUICK LINKS */}
                <div>
                    <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em] mb-6 md:mb-8 font-sans">Quick Links</h4>
                    <ul className="space-y-4 text-xs tracking-widest text-white/60 font-light font-sans uppercase">
                        <li className="hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => setPage('Projects')}>Architecture Projects</li>
                        <li className="hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => setPage('Projects')}>Interiors Projects</li>
                        <li className="hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => setPage('Projects')}>Ongoing Projects</li>
                        <li className="hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => setPage('Shop')}>Shop</li>
                    </ul>
                </div>

                {/* QUICK ENQUIRY */}
                <div className="lg:col-span-1 bg-[#0f0f0f] p-6 rounded-lg border border-[#C5A059]/20">
                    <h4 className="text-[#C5A059] text-sm font-bold uppercase tracking-[0.2em] mb-4 font-sans">Get in Touch</h4>
                    <p className="text-sm leading-relaxed text-white/75 mb-6 font-sans font-medium">
                        Let us know your project needs. We'll respond within 24 hours.
                    </p>
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full bg-white px-3 py-3 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-sm transition-all"
                            required
                        />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            className="w-full bg-white px-3 py-3 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-sm transition-all"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full bg-white px-3 py-3 text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-sm transition-all"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#C5A059] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                        >
                            {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
                        </button>
                        {submitMessage && (
                            <p className="text-sm text-center mt-2 font-medium" style={{ color: submitMessage.includes('✓') ? '#10b981' : '#ef4444' }}>
                                {submitMessage}
                            </p>
                        )}
                    </form>
                </div>

                {/* CONTACT US */}
                <div className="lg:col-span-2">
                    <h4 className="text-[#C5A059] text-xs font-bold uppercase tracking-[0.2em] mb-8 font-sans">Contact Us</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {CONTACT_ADDRESS && (
                                <p className="text-[11px] leading-relaxed text-white/80 font-sans tracking-wide">
                                    {CONTACT_ADDRESS}
                                </p>
                            )}
                            {emailList.length > 0 && (
                                <p className="text-[11px] text-white/60 font-sans tracking-wide break-words">
                                    {emailList.join(', ')}
                                </p>
                            )}
                            {phoneList.length > 0 && (
                                <p className="text-[11px] text-white/60 font-sans tracking-wide">
                                    {phoneList.join(', ')}
                                </p>
                            )}
                        </div>
                        <div className="aspect-video bg-white/5 border border-white/5 overflow-hidden">
                            {MAPS_EMBED_URL ? (
                                <iframe
                                    title="footer-map"
                                    src={MAPS_EMBED_URL}
                                    className="w-full h-full border-0 grayscale brightness-90"
                                    loading="lazy"
                                ></iframe>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs text-white/50">
                                    Map unavailable
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="max-w-7xl mx-auto pt-10 md:pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 md:gap-8 relative">

                {/* Copyright */}
                <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#C5A059] flex items-center justify-center text-[#C5A059] font-bold text-lg md:text-xl">
                        C
                    </div>
                    <p className="text-[9px] lg:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-white/40 font-bold font-sans max-w-[250px] md:max-w-none">
                        © 2021 ADROIT DESIGNS INDIA PRIVATE LIMITED
                    </p>
                </div>

                {/* Social Icons */}
                <div className="flex gap-4">
                    {[
                        { icon: Facebook, url: SOCIAL_LINKS.facebook },
                        { icon: Instagram, url: SOCIAL_LINKS.instagram },
                        { icon: Linkedin, url: SOCIAL_LINKS.linkedin }
                    ]
                        .filter((item) => item.url)
                        .map((item, idx) => (
                            <a
                                key={idx}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-[#C5A059] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                <item.icon size={18} fill="currentColor" className="opacity-90" />
                            </a>
                        ))}
                </div>

                {/* Back to top button */}
                <div
                    onClick={scrollToTop}
                    className="static md:absolute md:-right-4 md:-top-6 bg-[#2563eb] text-white p-3 cursor-pointer hover:bg-[#1d4ed8] transition-colors shadow-xl rounded-sm"
                >
                    <ArrowUp size={20} />
                </div>
            </div>

        </footer>
    );
};

export default Footer;
