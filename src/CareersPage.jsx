import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { jobsAPI } from './services/api';
import BackButton from './components/BackButton';

const Careers = () => {
    const [formState, setFormState] = useState({ 
        name: '', 
        email: '', 
        phone: '', 
        applicantType: '', 
        role: '', 
        portfolio: '', 
        message: '',
        resume: null
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('name', formState.name);
        formData.append('email', formState.email);
        formData.append('phone', formState.phone);
        formData.append('type', formState.applicantType);
        formData.append('roles', formState.role);
        formData.append('portfolio_link', formState.portfolio);
        formData.append('message', formState.message);
        if (formState.resume) {
            formData.append('resume', formState.resume);
        }

        try {
            await jobsAPI.apply(formData);
            setIsSuccess(true);
            setFormState({ 
                name: '', email: '', phone: '', 
                applicantType: '', role: '', 
                portfolio: '', message: '', 
                resume: null 
            });
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error('Submission error:', error);
            alert(error.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-40 px-6 md:px-24 bg-[#050505] text-white min-h-screen relative overflow-hidden">
            <BackButton />
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#C5A059]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16 uppercase">
                    <h2 className="text-3xl md:text-5xl font-logo text-white tracking-widest uppercase">Join the Collective</h2>
                    <div className="h-[1px] w-12 bg-[#C5A059] mx-auto my-8"></div>
                    <p className="text-white/60 font-light max-w-lg mx-auto leading-relaxed">
                        We are looking for visionaries to help shape the future of our built environments.
                    </p>
                </div>

                {isSuccess ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 max-w-2xl mx-auto backdrop-blur-md">
                        <h3 className="text-3xl font-logo uppercase text-[#C5A059] mb-4">Application Received</h3>
                        <p className="text-white/60 font-light tracking-wide">Thank you for your interest. We will review your application and get back to you.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto bg-white/5 p-8 md:p-12 border border-white/10 backdrop-blur-md">
                        <h3 className="text-2xl font-logo uppercase tracking-widest mb-8 text-center text-white">Application Form</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <select
                                required
                                className="w-full bg-[#050505] border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] cursor-pointer appearance-none text-white/70 tracking-wide"
                                value={formState.applicantType}
                                onChange={(e) => setFormState({ ...formState, applicantType: e.target.value })}
                            >
                                <option value="" disabled>Select Application Type</option>
                                <option value="Internship">Internship</option>
                                <option value="Career">Career / Full-Time</option>
                            </select>

                            <select
                                required
                                className="w-full bg-[#050505] border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] cursor-pointer appearance-none text-white/70 tracking-wide"
                                value={formState.role}
                                onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                            >
                                <option value="" disabled>Select Job Role</option>
                                <option value="Admin">Admin</option>
                                <option value="HR">HR</option>
                                <option value="Accounts">Accounts</option>
                                <option value="Architect">Architect</option>
                                <option value="Designer">Designer</option>
                                <option value="Site Engineer">Site Engineer</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="Purchase Executive">Purchase Executive</option>
                                <option value="Business Development">Business Development</option>
                                <option value="Quantity Surveyor">Quantity Surveyor</option>
                                <option value="MEP Engineer">MEP Engineer</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                placeholder="Full Name"
                                required
                                className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] text-white placeholder-white/40 tracking-wide font-sans"
                                value={formState.name}
                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            />
                            <input
                                type="email"
                                placeholder="Email Address"
                                required
                                className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] text-white placeholder-white/40 tracking-wide font-sans"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                placeholder="Phone Number"
                                required
                                className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] text-white placeholder-white/40 tracking-wide font-sans"
                                value={formState.phone}
                                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            />
                            <div className="space-y-1 relative">
                                <span className="absolute -top-2 left-3 bg-[#050505] px-2 text-[10px] text-[#C5A059] uppercase tracking-widest z-10">Upload Resume</span>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    required={!formState.portfolio}
                                    className="w-full bg-transparent border border-white/20 p-[13px] text-xs focus:outline-none focus:border-[#C5A059] text-white/50 file:mr-4 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-white/10 file:text-white"
                                    onChange={(e) => setFormState({ ...formState, resume: e.target.files[0] })}
                                />
                            </div>
                        </div>

                        <input
                            placeholder="Portfolio Link (URL) - Recommended for Designers/Architects"
                            className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] text-white placeholder-white/40 tracking-wide"
                            value={formState.portfolio}
                            onChange={(e) => setFormState({ ...formState, portfolio: e.target.value })}
                        />

                        <textarea
                            placeholder="Cover Letter / Why do you want to join us?"
                            required
                            rows={5}
                            className="w-full bg-transparent border border-white/20 p-4 text-sm focus:outline-none focus:border-[#C5A059] resize-none text-white placeholder-white/40 tracking-wide"
                            value={formState.message}
                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#C5A059] text-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-white transition-colors flex justify-center items-center gap-3 mt-4 group"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            {!isSubmitting && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default Careers;
