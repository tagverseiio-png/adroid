import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { inquiriesAPI } from './services/api';

const Careers = () => {
    const [selectedJob, setSelectedJob] = useState(null);
    const [formState, setFormState] = useState({ name: '', email: '', portfolio: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const applicationData = {
                name: formState.name,
                email: formState.email,
                subject: `Job Application: ${selectedJob.role}`,
                message: `Portfolio: ${formState.portfolio}\n\nMessage: ${formState.message}`,
                type: 'career',
                portfolio_link: formState.portfolio,
            };

            await inquiriesAPI.create(applicationData);
            
            setIsSuccess(true);
            setFormState({ name: '', email: '', portfolio: '', message: '' });
            setTimeout(() => {
                setIsSuccess(false);
                setSelectedJob(null);
            }, 2000);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-40 px-6 md:px-24 bg-white min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-24 uppercase">
                    <h2 className="text-3xl md:text-5xl font-logo text-stone-900 tracking-wider">Join the Collective</h2>
                    <div className="h-[1px] w-12 bg-[#C5A059] mx-auto my-8"></div>
                    <p className="text-stone-500 font-light max-w-lg mx-auto leading-relaxed">
                        We are looking for visionaries to help shape the future of our built environments.
                    </p>
                </div>

                <div className="grid gap-6">
                    {[
                        { role: "Senior Architect", loc: "New York", type: "Full-Time" },
                        { role: "Interior Designer", loc: "London", type: "Full-Time" },
                        { role: "Site Engineer", loc: "Dubai", type: "Contract" }
                    ].map((job, idx) => (
                        <motion.div
                            key={idx}
                            className="group flex flex-col md:flex-row justify-between items-center p-8 border border-stone-100 hover:border-[#C5A059]/30 transition-colors duration-500 bg-stone-50 hover:bg-white cursor-pointer"
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedJob(job)}
                        >
                            <div className="text-center md:text-left">
                                <h3 className="text-lg md:text-xl font-logo text-stone-900 tracking-tight group-hover:text-[#C5A059] transition-colors uppercase">{job.role}</h3>
                                <p className="text-xs tracking-widest uppercase text-stone-400 mt-2">{job.loc} — {job.type}</p>
                            </div>
                            <span className="mt-6 md:mt-0 text-xs font-bold underline decoration-stone-300 underline-offset-4 group-hover:decoration-[#C5A059] transition-all cursor-pointer">
                                APPLY NOW
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-lg p-8 md:p-12 relative shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedJob(null)}
                                className="absolute top-6 right-6 text-stone-400 hover:text-black transition-colors"
                            >
                                <X size={24} />
                            </button>

                            {isSuccess ? (
                                <div className="text-center py-12">
                                    <h3 className="text-2xl font-serif text-[#C5A059] mb-4">Application Received</h3>
                                    <p className="text-stone-500 text-sm">Thank you for your interest. We will review your portfolio and get back to you.</p>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-logo uppercase tracking-wider mb-2">Apply Now</h3>
                                    <p className="text-xs text-stone-400 uppercase tracking-widest mb-8">Role: {selectedJob.role}</p>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <input
                                            placeholder="Full Name"
                                            required
                                            className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:outline-none focus:border-[#C5A059]"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            required
                                            className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:outline-none focus:border-[#C5A059]"
                                            value={formState.email}
                                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                        />
                                        <input
                                            placeholder="Portfolio Link (URL)"
                                            className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:outline-none focus:border-[#C5A059]"
                                            value={formState.portfolio}
                                            onChange={(e) => setFormState({ ...formState, portfolio: e.target.value })}
                                        />
                                        <textarea
                                            placeholder="Why do you want to join us?"
                                            required
                                            rows={4}
                                            className="w-full bg-stone-50 border border-stone-200 p-4 text-sm focus:outline-none focus:border-[#C5A059] resize-none"
                                            value={formState.message}
                                            onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] transition-colors flex justify-center items-center gap-2"
                                        >
                                            {isSubmitting ? 'Sending...' : 'Submit Application'}
                                            {!isSubmitting && <ArrowRight size={14} />}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Careers;
