import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin, Phone, Instagram, Linkedin, Facebook, Building2, UserPlus, MessageSquare } from 'lucide-react';
import { inquiriesAPI, uploadAPI } from './services/api';

const CONTACT_SECTIONS = [
    { id: 'enquiry', label: 'Project Enquiry', icon: MessageSquare },
    { id: 'location', label: 'Office Locations', icon: MapPin },
    { id: 'vendor', label: 'Vendor Registration', icon: UserPlus },
];

const ContactPage = ({ initialSection = 'enquiry' }) => {
    const [activeSection, setActiveSection] = useState(initialSection);

    useEffect(() => {
        setActiveSection(initialSection);
    }, [initialSection]);
    const [formState, setFormState] = useState({
        name: '', email: '', subject: '', message: '', company: '', phone: '', category: '', subCategory: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const inquiryData = {
                name: formState.name,
                email: formState.email,
                phone: formState.phone || '',
                subject: activeSection === 'enquiry'
                    ? (formState.category && formState.subCategory ? `${formState.category} - ${formState.subCategory}` : 'General Inquiry')
                    : (formState.subject || (activeSection === 'vendor' ? 'Vendor Registration' : 'General Inquiry')),
                message: formState.message || (activeSection === 'vendor' ? `Company: ${formState.company}, Service: ${formState.subject}` : ''),
                type: activeSection,
                company: formState.company || null,
                portfolio_link: formState.portfolio_link || null,
            };

            await inquiriesAPI.create(inquiryData);

            setIsSuccess(true);
            setFormState({ name: '', email: '', subject: '', message: '', company: '', phone: '', category: '', subCategory: '' });
            setTimeout(() => setIsSuccess(false), 5000);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-white/30 focus:outline-none focus:border-[#C5A059] transition-colors duration-500 font-light tracking-wide text-sm";

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 md:pt-40 pb-16 md:pb-24 px-6 md:px-24 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 md:gap-12">

                    {/* Left Column: Sub-Nav */}
                    <div className="space-y-4">
                        {CONTACT_SECTIONS.map((section) => (
                            <motion.div
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`p-6 md:p-8 cursor-pointer transition-all duration-500 relative group overflow-hidden ${activeSection === section.id ? 'bg-white/10' : 'bg-white/5 hover:bg-white/8'
                                    }`}
                                whileHover={{ x: 10 }}
                            >
                                <div className="relative z-10 flex items-center justify-between">
                                    <h3 className={`text-base md:text-lg font-logo tracking-[0.2em] uppercase ${activeSection === section.id ? 'text-[#C5A059]' : 'text-white/40 group-hover:text-white/70'
                                        }`}>
                                        {section.label}
                                    </h3>
                                    <section.icon size={18} className={activeSection === section.id ? 'text-[#C5A059]' : 'text-white/20'} />
                                </div>
                                {activeSection === section.id && (
                                    <motion.div
                                        layoutId="activeContactSide"
                                        className="absolute left-0 top-0 w-1 h-full bg-[#C5A059]"
                                    />
                                )}
                            </motion.div>
                        ))}

                        <div className="pt-4">
                            <h3 className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-sans font-bold mb-6">Social Connect</h3>
                            <div className="flex gap-8">
                                {[
                                    { icon: Linkedin, url: "https://www.linkedin.com/company/adroit-design-india-pvt-ltd" }
                                ].map((item, idx) => (
                                    <motion.a
                                        key={idx}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, color: '#C5A059' }}
                                        className="text-white/30 transition-colors"
                                    >
                                        <item.icon size={20} />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Content Container */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/5 p-8 md:p-16 relative"
                    >
                        <AnimatePresence mode="wait">
                            {activeSection === 'enquiry' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl md:text-3xl font-logo uppercase tracking-widest mb-4">Quick Enquiry</h2>
                                    <p className="text-white/40 text-[13px] md:text-sm mb-10 md:mb-12 font-sans tracking-wide">
                                        If you are interested in any of our services, please submit your basic details below and we will get back to you as soon as possible!
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <input type="text" name="name" placeholder="Full Name" required value={formState.name} className={inputClasses} onChange={handleChange} />
                                            <input type="email" name="email" placeholder="Email Address" required value={formState.email} className={inputClasses} onChange={handleChange} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <input type="text" name="phone" placeholder="Phone Number" value={formState.phone} className={inputClasses} onChange={handleChange} />
                                            <select
                                                name="category"
                                                value={formState.category}
                                                className={`${inputClasses} cursor-pointer bg-transparent appearance-none`}
                                                onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value, subCategory: '' }))}
                                                required
                                            >
                                                <option value="" disabled className="bg-[#050505] text-white/50">Select Category</option>
                                                <option value="Residential" className="bg-[#050505] text-white">Residential</option>
                                                <option value="Commercial" className="bg-[#050505] text-white">Commercial</option>
                                            </select>
                                        </div>
                                        {formState.category && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                                <select
                                                    name="subCategory"
                                                    value={formState.subCategory}
                                                    className={`${inputClasses} cursor-pointer bg-transparent appearance-none`}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="" disabled className="bg-[#050505] text-white/50">Select Sub-Category</option>
                                                    <option value="Interior" className="bg-[#050505] text-white">Interior</option>
                                                    <option value="Construction" className="bg-[#050505] text-white">Construction</option>
                                                </select>
                                                <div className="hidden md:block"></div>
                                            </div>
                                        )}
                                        <textarea name="message" placeholder="Message / Specifications" rows={4} required value={formState.message} className={`${inputClasses} resize-none`} onChange={handleChange} />

                                        <button type="submit" disabled={isSubmitting} className="group relative px-8 md:px-10 py-4 md:py-5 bg-[#C5A059] text-black text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-300 hover:bg-white">
                                            <span className="flex items-center gap-3">
                                                {isSubmitting ? 'Processing...' : 'Send Inquiry'}
                                                <ArrowRight size={16} />
                                            </span>
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {activeSection === 'location' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-center">
                                    <div className="mb-12">
                                        <span className="text-[#C5A059] uppercase tracking-[0.4em] text-[10px] md:text-sm font-bold block mb-4">Locations</span>
                                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest leading-none mb-4">Our Presence</h2>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                                            <h3 className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-6 font-bold flex items-center gap-2">
                                                <Building2 size={14} /> Corporate Office (Chennai)
                                            </h3>
                                            <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed font-light mb-8">
                                                No 8, MCN Nagar Extension,<br />
                                                Thoraipakkam, Chennai - 600097.<br />
                                                Tamil Nadu, India
                                            </p>
                                            <div className="space-y-4 pt-6 border-t border-white/10">
                                                <a href="mailto:info@adroitdesigns.in" className="flex items-center gap-4 text-white/50 hover:text-[#C5A059] transition-colors text-sm font-light">
                                                    <Mail size={16} /> info@adroitdesigns.in
                                                </a>
                                                <a href="tel:+914445561113" className="flex items-center gap-4 text-white/50 hover:text-[#C5A059] transition-colors text-sm font-light">
                                                    <Phone size={16} /> (+91) 44-45561113
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 bg-white/5 border border-white/10 rounded-xl">
                                            <h3 className="text-[#C5A059] text-[10px] uppercase tracking-[0.3em] mb-6 font-bold flex items-center gap-2">
                                                <Building2 size={14} /> Branch Office (Bengaluru)
                                            </h3>
                                            <p className="font-sans text-base md:text-lg text-white/80 leading-relaxed font-light mb-8">
                                                No. 40, 2nd Floor, 3rd Main Road,<br />
                                                Vyalikaval, Bengaluru - 560003.<br />
                                                Karnataka, India
                                            </p>
                                            <div className="space-y-4 pt-6 border-t border-white/10">
                                                <a href="mailto:fm@adroitdesigns.in" className="flex items-center gap-4 text-white/50 hover:text-[#C5A059] transition-colors text-sm font-light">
                                                    <Mail size={16} /> fm@adroitdesigns.in
                                                </a>
                                                <a href="tel:+919940064343" className="flex items-center gap-4 text-white/50 hover:text-[#C5A059] transition-colors text-sm font-light">
                                                    <Phone size={16} /> (+91) 9940064343
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px] grayscale brightness-75 contrast-125 opacity-60 hover:opacity-100 transition-opacity duration-700">
                                        <div className="relative group overflow-hidden rounded-xl border border-white/10">
                                            <iframe 
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.893247493361!2d80.231902!3d12.923838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d064ca00001%3A0xc0d7197bba10dd06!2sADROIT%20DESIGN%20INDIA%20PVT%20LTD!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                                        </div>
                                        <div className="relative group overflow-hidden rounded-xl border border-white/10">
                                            <iframe 
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.35649495!2d77.5752!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae161b!2sBengaluru!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                                width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'vendor' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 className="text-2xl md:text-3xl font-logo uppercase tracking-widest mb-4">Vendor Registration</h2>
                                    <p className="text-white/40 text-[13px] md:text-sm mb-10 md:mb-12 font-sans tracking-wide">Join our network of premium suppliers and contractors.</p>

                                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <input type="text" name="company" placeholder="Company Name" required value={formState.company} className={inputClasses} onChange={handleChange} />
                                            <input type="text" name="name" placeholder="Contact Person" required value={formState.name} className={inputClasses} onChange={handleChange} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                            <input type="email" name="email" placeholder="Business Email" required value={formState.email} className={inputClasses} onChange={handleChange} />
                                            <input type="text" name="phone" placeholder="Business Phone" required value={formState.phone} className={inputClasses} onChange={handleChange} />
                                        </div>
                                        <input type="text" name="subject" placeholder="Category of Service / Products" value={formState.subject} className={inputClasses} onChange={handleChange} />
                                        
                                        <div>
                                            <label className="text-white/30 text-[10px] uppercase font-bold tracking-widest block mb-4">Portfolio Link / Attachment</label>
                                            <input 
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={async (e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const formData = new FormData();
                                                        formData.append('file', file);
                                                        formData.append('folder', 'resumes');
                                                        try {
                                                            const res = await uploadAPI.uploadPublicFile(file, 'resumes');
                                                            if (res.success) {
                                                                setFormState(prev => ({...prev, portfolio_link: res.data.path}));
                                                                alert('Portfolio uploaded successfully!');
                                                            }
                                                        } catch (err) {
                                                            alert('Upload failed. Please try again or provide a link instead.');
                                                        }
                                                    }
                                                }}
                                                className="hidden"
                                                id="portfolio-upload"
                                            />
                                            <div className="flex gap-4 items-center">
                                                <input 
                                                    type="text" 
                                                    placeholder="Or paste a link (Google Drive/Dropbox)" 
                                                    className="flex-1 bg-white/5 border-b border-white/10 py-5 text-white outline-none focus:border-[#C5A059] transition-colors"
                                                    value={formState.portfolio_link}
                                                    onChange={(e) => setFormState(prev => ({...prev, portfolio_link: e.target.value}))}
                                                />
                                                <label 
                                                    htmlFor="portfolio-upload"
                                                    className="px-6 py-3 bg-white/5 border border-white/20 text-white text-xs uppercase font-bold tracking-widest cursor-pointer hover:bg-white hover:text-black transition-all"
                                                >
                                                    {formState.portfolio_link?.startsWith('uploads/') ? 'Attached ✓' : 'Attach File'}
                                                </label>
                                            </div>
                                        </div>

                                        <button type="submit" disabled={isSubmitting} className="group relative px-8 md:px-10 py-4 md:py-5 bg-white text-black text-[10px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all duration-300 hover:bg-[#C5A059] hover:text-white">
                                            <span className="flex items-center gap-3">
                                                {isSubmitting ? 'Registering...' : 'Register as Vendor'}
                                                <UserPlus size={16} />
                                            </span>
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isSuccess && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#050505] flex items-center justify-center z-50 p-12 text-center">
                                <div>
                                    <h3 className="text-2xl font-logo text-[#C5A059] mb-4">Thank You</h3>
                                    <p className="text-white/60 font-sans">Your submission has been received. Our team will review and contact you shortly.</p>
                                    <button onClick={() => setIsSuccess(false)} className="mt-8 text-[10px] tracking-widest uppercase underline decoration-[#C5A059] underline-offset-8">Close</button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
