import React, { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, useInView, motion } from "framer-motion";
import { Quote, Star, Layout, Hammer, Building2, Construction, Zap, ClipboardCheck, ShieldCheck, Leaf, PenTool, Target, Compass } from "lucide-react";

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

const CORE_COMPETENCIES = [
    {
        title: "Design–Build Expertise",
        desc: "Seamlessly bridging the gap between innovative architectural concepts and turnkey execution, ensuring design integrity at every stage.",
        icon: PenTool,
    },
    {
        title: "Interior Design & Fit-Outs",
        desc: "Crafting bespoke interior environments that balance aesthetic luxury with optimal spatial functionality and user experience.",
        icon: Layout,
    },
    {
        title: "Civil, PEB, Fire, HVAC, Security, IBMS, MEP & Design Works",
        desc: "Integrating advanced civil engineering and PEB structures with intelligent MEP and life-safety systems for seamless, turnkey execution.",
        icon: Building2,
    },
    {
        title: "Project Management & Consultancy",
        desc: "Strategic orchestration of complex projects, prioritizing transparent communication, risk mitigation, and on-time delivery.",
        icon: ShieldCheck,
    },
];

const ACCOMPLISHMENTS = [
    { number: "20", label: "Years of Excellence" },
    { number: "500+", label: "Projects Delivered" },
    { number: "5M+", label: "Sq.Ft Designed" },
    { number: "5", label: "continent" }
];

const REVIEWS = [
    {
        name: "SAMIR JOSHI [cite: 33]",
        role: "Project Management Consultant (PMC), Indian Diamond Institute [cite: 29, 34]",
        text: "This is to certify that M/s. Adroit Design India Pvt. Ltd., awarded with the execution of the interior work of CFC-Kolkata vide Lol released in favour of M/s Adroit Design India Pvt. Ltd dated 26.02.2020 by the Gem & Jewellery Export Promotion Council, had successfully execute, delivered and completed the interiors work at CFC-Kolkata site in line with items and specification as mentioned in the Bill Of Quantity (BoQ.) Interior work at CFC-Kolkata in line with the approved BoQ was successfully completed as on 17.03.2021 so that centre could be made operational on installation of the machines. However, list of some miscellaneous items not affecting the operation of the centre & snag list work pending for delivery/execution was informed to representative of M/s. Adroit Design India Pvt. Ltd., which was also completed successfully. [cite: 18, 19, 20, 21, 22, 23]"
    },
    {
        name: "SAMIR JOSHI [cite: 70]",
        role: "Project Management Consultant (PMC), Indian Diamond Institute [cite: 62, 66]",
        text: "This is to certify that M/s. Adroit Design India Pvt. Ltd., awarded with the execution of the interior work of CFC-Hyderabad vide Lol released in favour of M/s. Adroit Design India Pvt. Ltd dated 07.08.2020 by the Gem & Jewellery Export Promotion Council, had successfully execute, delivered and completed the interiors work at CFC-Hyderabad site in line with items and specification as mentioned in the Bill Of Quantity (BoQ.) Interior work at CFC-Hyderabad in line with the approved BoQ was successfully completed as on 29.03.2021 so that centre could be made operational on installation of the machines. However, list of some miscellaneous items not affecting the operation of the centre & snag list work pending for delivery/execution was informed to representative of M/s Adroit Design India Pvt. Ltd., which was also completed successfully. [cite: 54, 55, 56, 57, 58, 59]"
    },
    {
        name: "SAMIR JOSHI [cite: 100]",
        role: "Project Management Consultant (PMC), Indian Diamond Institute [cite: 94, 101]",
        text: "This is to certify that M/s. Adroit Design India Pvt. Ltd., awarded with the execution of the interior work of CFC-Coimbatore vide Lol released in Favour of M/s. Adroit Design India Pvt. Ltd dated 09.10.2019 by the Gem & Jewellery Export Promotion Council, had successfully execute, delivered and completed the interiors work at CFC-Coimbatore site in line with items and specification as mentioned in the Bill Of Quantity (BoQ.) Interior work at CFC-Coimbatore in line with the approved BoQ was successfully completed as on 19.02.2021 so that centre could be made operational on installation of the machines. However, list of some miscellaneous items not affecting the operation of the centre & snag list work pending for delivery/execution was informed to representative of M/s. Adroit Design India Pvt. Ltd., which was also completed successfully. [cite: 85, 86, 87, 88, 89, 90]"
    },
    {
        name: "Authorised Signatory [cite: 111]",
        role: "The Gem & Jewellery Export Promotion Council [cite: 123]",
        text: "It is certified that M/s Adroit Design India Pvt Ltd, Chennai has installed, tested and commissioned TRUNKEY INTERIOR WORK against CONTRACT No. GJEPC/RO-Chennai/2018-19, amounting of Rs 43,02,685/- in Feb 2019 at satisfactory level. The workmanship and speed of completion of work is reasonable. We wish them best in their future assignment. [cite: 108, 109, 110]"
    },
    {
        name: "Saravanan Palaniappan [cite: 145]",
        role: "AGM HR & General Admin, Relevantz [cite: 136, 146]",
        text: "On behalf of Relevantz, I'm writing to express my gratitude for finishing the 30,000 sq. ft. turnkey project (Design & Build) new office block in Chennai one corporate office interior works in the allowed 100 working days and for the project's total cost of Rs. 3,76,34,092/- Your use of facts and numbers throughout this project is really superb. I sincerely appreciate the time and work you spent on the job. I genuinely appreciate all that you and your team have done for Relevantz. Because everything was completed promptly and accurately, I greatly appreciate the work that you and your staff did. Our organization has chosen to give you a couple of additional projects as a result of how well you performed. I want to thank you once again and congratulate you for your devotion and hard work. I hope your spirit holds strong in all of your next endeavors. I wish you nothing but success in the future. [cite: 136, 137, 138, 139, 140, 141, 142, 143, 144]"
    },
    {
        name: "Signature with Stamp [cite: 206]",
        role: "Petregaz Krishnapatnam Private Limited [cite: 208]",
        text: "The above Work Completion Certificate is being issued to the Turnkey Architects M/s Adroit Design India Pvt Ltd for the Design & Build of the Admin Building Interior Fitout Works including Partition, Doors, UPVC Windows. Paneling & Allied Works. Furniture Works, Chairs & Sofa, False Ceiling Works. Painting & Allied Works, Flooring Works, Handrail Works, Plumbing & Allied Works, Internal Pipe Line Works. External Pipe Line Works. OHT Pipe Line Works. Electrical & Allied Works, Networking & Allied Works. Civil Works. External Facade Works. ACP Cladding Works. Exterior Painting. Signage Works & Canopy Works. The certificate is given without any prejudice to rights and remedies available to M/s Petregaz under the law. Contract or otherwise. [cite: 194, 195, 196, 197, 198, 199, 200]"
    },
    {
        name: "V.Pajanivelou [cite: 233]",
        role: "Geenral Manager Plant Engineering & Maintenance, Hanon Automotive systems India Pvt. Ltd [cite: 234, 235]",
        text: "We would like to Congratulate & appreciate sincerely the team of M/s Adroit Design India Pvt Ltd, Chennai for completing our Chennai Main Office Interior Renovation Works of 5000 Sft for a value of Rs 1,05,19,103/- at M/s Hanon Automotive systems India Pvt. Ltd, Maraimalai Nagar, Chennai in a record time of 30 Working days. We appreciate your efforts, momentum & coordination from the start of this project in understanding our requirements and executing the same Fitout Works on time. We congratulate your entire Project team comprising of Design, Purchase, Project Architect & Site Engineers for their remarkable performance in executing the Turnkey Interior Fitout works with full passion & enthusiasm. We would like to express our sincere gratitude to you as well, for making this Project a success & wish to continue this good spirit in the upcoming projects and hope to have a long-term association with you. Wishing you all the best and good luck ahead. [cite: 225, 226, 227, 228, 229, 230]"
    },
    {
        name: "Saravanan Palaniappan [cite: 267]",
        role: "Manager-HR/GA/GR/Travel desk/IMO, Object-Frontier India Private Limited [cite: 267]",
        text: "I am writing this letter on behalf of OFS to extend our appreciation towards for successful completion of our Ascendas Zenith building new office set-up (15,000 Sq.feet) and our Agate Old office complete revamp (14,400 Sq.feet) within the committed time and that too with great efficacy. The fact and figures presented by you in the completion of this Two project is truly commendable. I really appreciate your efforts and professionalism by which you have completed the project well on time. I really want to congratulate you and your entire team on behalf of OFS for this remarkable performance. I really appreciate your work because the entire work done by your team is 100% accurate and before the given time slot. Considering you this performance our company has decided to give you few more projects for which we will have a business meeting as soon as possible in our office. Appreciate and congratulate all your team members of ADROIT on behalf of me. I, once again would like to thank you and congratulate you for your hard work and dedication. I wish that you continue your spirit in all your upcoming projects Wishing you all the best and good luck ahead. [cite: 256, 257, 258, 259, 260, 261, 262, 263, 264, 265]"
    },
    {
        name: "Devaraj Sreeram [cite: 299]",
        role: "Raqmiyat [cite: 285]",
        text: "I am writing this mail after 3.6 years to say to you and your team a \"Good Job\". We are really happy with all the design & build interior works done for our new Chennai office premises at Purva Primus for 9000Sft well within the given budget. The entire theme, designs, color combinations, project coordination and execution were absolutely fantastic. Despite of the cyclone and flood during the execution time, you had completed your job prior to the handover date. We had plans for shifting after Pongal (15th Jan), but you have handed over the place to us before New year itself. (31st Dec 2015) I really appreciate your efforts & professionalism by which you have completed the project well on time and I congratulate you and your entire team on behalf of M/S.RAQMIYAT for this remarkable performance and dedication. You and your team have renewed our faith in the right way of conducting business by a professional company. Again, thank you very much for a job well done. We wish you all the success. [cite: 289, 290, 291, 292, 293, 294, 295, 296, 297]"
    },
    {
        name: "For Forbes Marshall Ltd [cite: 323]",
        role: "Forbes Marshall Ltd, Pune [cite: 315]",
        text: "We are writing this letter on behalf of M/s Forbes Marshall Ltd, Pune to express our warm congratulations and sincere appreciation to M/s Adroit Design India Pvt Ltd, Chennai headed by Mr Franklin Maxwell for completing our Delhi Regional Office at D109/110, Okhla Industrial Estate, Phase 1, New Delhi 110020. We appreciate your efforts from the start of this project in understanding our requirements and doing the Interior Design & 3D renderings to our satisfaction with full Professionalism. We really want to congratulate your entire Project team comprising of Purchase, Design, Site Engineers for this remarkable performance in executing the Turnkey Interior Fitout Contract of Rs 1,53,14,578/- in 100 days as mutually agreed by us. The entire work done by your team and their coordination was commendable. We would like to express our sincere gratitude to you as well, for making this Project a successful one for us. We wish that you continue this good spirit in the upcoming projects and hope to have a long-term association with you. Wishing you all the best and good luck ahead. [cite: 315, 316, 317, 318, 319, 320, 321]"
    }
];

const REVIEWS_MARQUEE = [...REVIEWS, ...REVIEWS];

export default function AboutPage() {
    const containerRef = useRef(null);
    const [isReviewsPaused, setIsReviewsPaused] = useState(false);
    const reviewsTrackRef = useRef(null);
    const reviewsSectionRef = useRef(null);
    const isReviewsSectionInView = useInView(reviewsSectionRef, { margin: "-120px" });
    const { scrollYProgress } = useScroll({ target: containerRef });

    const heroY = useTransform(scrollYProgress, [0, 0.35], [0, 180]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.6]);

    useEffect(() => {
        const container = reviewsTrackRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (prefersReducedMotion || isMobile || !isReviewsSectionInView || document.hidden) {
            return;
        }

        let rafId;
        let lastTs = 0;

        const step = (ts) => {
            if (!lastTs) lastTs = ts;
            const dt = ts - lastTs;
            lastTs = ts;

            const speed = 0.045; // px per ms

            if (!isReviewsPaused) {
                const half = container.scrollWidth / 2;
                container.scrollLeft += dt * speed;
                if (container.scrollLeft >= half) {
                    container.scrollLeft -= half;
                }
            }

            rafId = requestAnimationFrame(step);
        };

        rafId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafId);
    }, [isReviewsPaused, isReviewsSectionInView]);

    const nudgeReviews = (direction = 1) => {
        const container = reviewsTrackRef.current;
        if (!container) return;

        const offset = Math.max(280, Math.floor(container.clientWidth * 0.35));
        container.scrollBy({ left: direction * offset, behavior: 'smooth' });
    };

    return (
        <div ref={containerRef} className="bg-[#050505] text-stone-200 overflow-hidden pt-24 md:pt-32 pb-24 font-sans">

            {/* HERO */}
            <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-[#0a0a0a]">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a] z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-40 grayscale"
                    />
                </div>

                <div className="relative z-20 text-center px-6">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white font-logo text-2xl sm:text-4xl md:text-7xl uppercase tracking-[0.15em] md:tracking-[0.2em] mb-6 px-2"
                    >
                        Building Excellence Through Design
                    </motion.h1>
                </div>
            </section>

            {/* 1. INTRODUCTION */}
            <section className="py-20 md:py-32 px-6 md:px-24 max-w-7xl mx-auto text-center">
                <Reveal>
                    <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold"></span>
                    <h2 className="text-3xl md:text-5xl font-logo uppercase tracking-widest text-white mb-8">Who We Are</h2>
                    <p className="text-stone-300 text-lg leading-relaxed font-light mb-8">
                        Adroit Design India Private Limited is a premier Architecture & Interior firm, committed to shaping spaces that resonate with functionality, aesthetic excellence, and enduring value.
                    </p>
                    <p className="text-stone-400 text-sm leading-relaxed mb-10">
                        As a lead solution provider in the built environment, we integrate architectural innovation with rigorous technical execution. Our multidisciplinary approach ensures that every project—from luxury residences to complex industrial facilities—is delivered with precision, transparency, and a focus on long-term sustainability.
                    </p>
                </Reveal>
            </section>

            {/* 2. ACCOMPLISHMENTS */}
            <section className="py-24 md:py-36 px-6 md:px-24 bg-black border-y border-white/10">
                <div className="max-w-[1600px] mx-auto">
                    <div className="bg-black py-16 md:py-24 border border-[#191919]">
                        <Reveal>
                            <div className="px-4 md:px-10 flex flex-col items-center text-center">
                                

                                <div className="grid grid-cols-2 gap-x-10 gap-y-12 w-full md:hidden">
                                    {ACCOMPLISHMENTS.map((item, idx) => (
                                        <div key={idx} className="flex flex-col items-center">
                                            <AnimatedStat
                                                value={item.number}
                                                className="whitespace-nowrap tabular-nums text-5xl font-logo tracking-normal mb-3 leading-none bg-gradient-to-b from-[#edd9a2] via-[#c9a35f] to-[#9f7733] bg-clip-text text-transparent"
                                            />
                                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.28em] mt-1 whitespace-nowrap">{item.label.toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="hidden md:flex items-start justify-between w-full gap-24 lg:gap-40 xl:gap-52">
                                    {ACCOMPLISHMENTS.map((item, idx) => (
                                        <div key={idx} className="flex-1 min-w-[180px] flex flex-col items-center">
                                            <AnimatedStat
                                                value={item.number}
                                                className="whitespace-nowrap tabular-nums text-7xl lg:text-8xl font-logo tracking-normal mb-4 leading-none bg-gradient-to-b from-[#edd9a2] via-[#c9a35f] to-[#9f7733] bg-clip-text text-transparent"
                                            />
                                            <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-1 whitespace-nowrap">{item.label.toUpperCase()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* 3. CORE COMPETENCIES */}
            <section className="relative py-20 md:py-32 px-6 md:px-24 overflow-hidden border-y border-white/5">
                {/* Pictorial Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    {/* Gradient Overlay to ensure text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/80 to-[#050505] z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                        alt="Architecture Background"
                        className="w-full h-full object-cover grayscale opacity-30"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto text-center">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">Core Competencies</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-16">Our Expertise</h2>
                    </Reveal>

                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {CORE_COMPETENCIES.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeUp}
                                whileHover={{ y: -5 }}
                                className="p-8 bg-black/40 backdrop-blur-md border border-white/10 hover:bg-[#C5A059] hover:border-[#C5A059] transition-all duration-300 group flex flex-col justify-start text-left"
                            >
                                <div className="mb-6 text-[#C5A059] group-hover:text-black transition-colors">
                                    {item.icon && <item.icon size={32} strokeWidth={1.5} />}
                                </div>
                                <h3 className="text-lg md:text-xl font-logo uppercase tracking-wider group-hover:text-black text-white mb-4">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-stone-400 group-hover:text-black/80 font-light leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 4. VISION & 5. MISSION */}
            <section className="py-20 md:py-32 bg-[#050505] border-y border-white/10">
                <div className="max-w-7xl mx-auto px-6 md:px-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
                    >
                        {/* Vision Card */}
                        <div className="bg-[#0a0a0a] p-10 md:p-16 border border-white/5 border-t-4 border-t-[#C5A059] hover:-translate-y-2 transition-transform duration-500">
                            <Target className="text-[#C5A059] mb-8" size={32} />
                            <h3 className="text-2xl font-logo uppercase tracking-widest text-white mb-6">Our Vision</h3>
                            <p className="text-stone-400 text-justify leading-relaxed font-light">
                                To lead the way in sustainable architecture and interior design, delivering world-class turnkey solutions that bring our clients' dreams to life. We aim to inspire industry peers, set new benchmarks, and build a unicorn from India for the world.
                            </p>
                        </div>
                        
                        {/* Mission Card */}
                        <div className="bg-[#0a0a0a] p-10 md:p-16 border border-white/5 border-t-4 border-t-stone-600 hover:-translate-y-2 transition-transform duration-500 group">
                            <Compass className="text-stone-400 group-hover:text-white transition-colors mb-8" size={32} />
                            <h3 className="text-2xl font-logo uppercase tracking-widest text-white mb-6">Our Mission</h3>
                            <p className="text-stone-400 text-justify leading-relaxed font-light">
                                To be a globally recognized leader and the preferred partner for our clients by helping them realize their infrastructure goals. We are committed to empowering individuals to grow into professionals, fostering core values, and always striving to Rise to Raise.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. KEY PROFILE */}
            <section className="py-20 md:py-32 px-6 md:px-24">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <Reveal>
                        <motion.div
                            variants={imageReveal}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="overflow-hidden border border-white/10 p-2"
                        >
                            <img
                                src="/assets/Founder.jpg"
                                alt="Franklin Maxwell A"
                                className="w-full h-[400px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition duration-1000"
                                onClick={(e) => {
                                    if (window.innerWidth < 1024 && e.currentTarget.classList.contains('grayscale')) {
                                        e.currentTarget.classList.remove('grayscale');
                                    }
                                }}
                            />
                        </motion.div>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">
                            Key Profile
                        </span>

                        <h3 className="text-[#C5A059] tracking-widest text-sm uppercase mb-2">Founder & Managing Director</h3>
                        <h2 className="text-3xl md:text-6xl font-logo text-white mb-8 uppercase tracking-wider">
                            Franklin Maxwell A
                        </h2>

                        <div className="space-y-6 text-stone-400 text-base md:text-lg leading-relaxed font-light">
                            <p>
                                Adroit Design India Pvt. Ltd was founded by Architect Franklin Maxwell A, holding an M.Arch in Building Management from Sathyabama University and a B.Arch from AMACE, University of Madras.
                            </p>
                            <p>
                                With over <strong>20 years</strong> of profound experience, he spearheads the firm's diverse portfolio encompassing Corporate, Industrial, Commercial, Institutional & Residential Architecture, including Turnkey Interiors and PEB Constructions.
                            </p>
                            <p>
                                His visionary leadership and relentless pursuit of perfection have cemented Adroit Design as a trusted name for premium architectural and construction solutions across the region.
                            </p>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* 7. THE TEAM */}
            <section className="py-20 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden px-6 md:px-24">
                <div className="max-w-7xl mx-auto mb-16 text-center">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold">The Team</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-6 mt-2">
                            The Minds Behind Excellence
                        </h2>
                        <p className="text-stone-400 text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto">
                            Our team comprises over 20 skilled architects, engineers, and designers who share a singular vision: to craft spaces that inspire. With diverse expertise spanning corporate architecture, industrial design, turnkey interiors, and sustainable construction, we collaborate seamlessly to bring ambitious projects to life.
                        </p>
                    </Reveal>
                </div>

                <Reveal delay={0.3}>
                    <div className="max-w-6xl mx-auto overflow-hidden border border-white/10 group bg-black/50">
                        <img
                            src="/assets/Team.jpg"
                            alt="The Team"
                            className="w-full h-auto object-contain grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                            onClick={(e) => {
                                if (window.innerWidth < 1024 && e.currentTarget.classList.contains('grayscale')) {
                                    e.currentTarget.classList.remove('grayscale', 'brightness-75');
                                }
                            }}
                        />
                    </div>
                </Reveal>
            </section>

            {/* 8. REVIEWS & TESTIMONIALS */}
            <section ref={reviewsSectionRef} className="py-20 md:py-32 px-6 md:px-24 bg-[#050505]">
                <div className="max-w-7xl mx-auto">
                    <Reveal>
                        <span className="text-[#C5A059] uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 block font-bold text-center">Reviews & Testimonials</span>
                        <h2 className="text-3xl md:text-5xl font-logo text-white uppercase tracking-widest mb-16 text-center">Client Speak</h2>
                    </Reveal>

                    <div className="flex items-center justify-end gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => nudgeReviews(-1)}
                            className="w-10 h-10 border border-white/20 text-white/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                            aria-label="Scroll testimonials left"
                        >
                            &#8592;
                        </button>
                        <button
                            type="button"
                            onClick={() => nudgeReviews(1)}
                            className="w-10 h-10 border border-white/20 text-white/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors"
                            aria-label="Scroll testimonials right"
                        >
                            &#8594;
                        </button>
                    </div>

                    <div
                        className="relative overflow-hidden"
                        onMouseEnter={() => setIsReviewsPaused(true)}
                        onMouseLeave={() => setIsReviewsPaused(false)}
                    >
                        <div
                            ref={reviewsTrackRef}
                            className="flex gap-4 md:gap-8 w-full overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing px-4 md:px-0"
                            onTouchStart={() => setIsReviewsPaused(true)}
                            onTouchEnd={() => setIsReviewsPaused(false)}
                        >
                            {REVIEWS_MARQUEE.map((review, i) => (
                                <div
                                    key={i}
                                    className="w-[85vw] sm:w-[320px] md:w-[440px] flex-shrink-0 p-6 md:p-10 border border-white/10 bg-white/5 relative hover:-translate-y-2 transition-transform duration-500"
                                >
                                    <Quote className="text-[#C5A059] w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6 opacity-50" />
                                    <p className="text-stone-300 font-light leading-relaxed mb-6 md:mb-8 italic text-sm md:text-base">"{review.text}"</p>
                                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4 md:pt-6">
                                        <div>
                                            <h4 className="text-white font-bold tracking-wide uppercase text-sm mb-1">{review.name}</h4>
                                            <p className="text-[#C5A059] text-xs uppercase tracking-widest">{review.role}</p>
                                        </div>
                                        <div className="flex gap-1 text-[#C5A059]">
                                            <Star fill="currentColor" size={14} />
                                            <Star fill="currentColor" size={14} />
                                            <Star fill="currentColor" size={14} />
                                            <Star fill="currentColor" size={14} />
                                            <Star fill="currentColor" size={14} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-24 bg-gradient-to-r from-[#050505] to-transparent" />
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-24 bg-gradient-to-l from-[#050505] to-transparent" />
                    </div>

                    <style>{`
                        .no-scrollbar {
                            -ms-overflow-style: none;
                            scrollbar-width: none;
                        }

                        .no-scrollbar::-webkit-scrollbar { display: none; }
                    `}</style>
                </div>
            </section>

        </div>
    );
}

function AnimatedStat({ value, className }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        if (!isInView) return;

        const parsed = parseStatValue(value);
        if (!parsed) {
            setDisplay(value);
            return;
        }

        const duration = 1200;
        const start = performance.now();
        let rafId;

        const frame = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = parsed.target * eased;
            setDisplay(formatStatValue(current, parsed));

            if (progress < 1) {
                rafId = requestAnimationFrame(frame);
            }
        };

        rafId = requestAnimationFrame(frame);
        return () => cancelAnimationFrame(rafId);
    }, [isInView, value]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
}

function parseStatValue(raw) {
    if (!raw || typeof raw !== "string") return null;

    const hasPlus = raw.endsWith("+");
    const base = hasPlus ? raw.slice(0, -1) : raw;
    const isMillion = /m$/i.test(base);
    const numericPart = isMillion ? base.slice(0, -1) : base;
    const target = Number.parseFloat(numericPart);

    if (Number.isNaN(target)) return null;

    return { target, hasPlus, isMillion };
}

function formatStatValue(current, parsed) {
    const rounded = parsed.isMillion
        ? `${Math.round(current)}M`
        : `${Math.round(current)}`;

    return parsed.hasPlus ? `${rounded}+` : rounded;
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
