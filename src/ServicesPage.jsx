import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

// Import images directly for production reliability
import ARCHITECTURALDESIGN from "/assets/ARCHITECTURALDESIGN.jpg";
import BUILDINGMANAGEMENTSERVICES from "/assets/BUILDINGMANAGEMENTSERVICES.jpg";
import CIVILPEBCONSTRUCTION from "/assets/CIVIL&PEBCONSTRUCTION.jpg";
import PROJECTMANAGEMENT from "/assets/PROJECTMANAGEMENT.jpg";
import TURNKEYINTERIORFITOUT from "/assets/TURNKEYINTERIORFIT-OUT.jpg";

const SERVICES_DATA = [
    {
        id: 1,
        title: "ARCHITECTURAL DESIGN",
        subtitle: "Built Environments",
        image: ARCHITECTURALDESIGN,
        images: [
            ARCHITECTURALDESIGN,
            CIVILPEBCONSTRUCTION,
            BUILDINGMANAGEMENTSERVICES,
            PROJECTMANAGEMENT,
        ],
        sections: [
            "Comprehensive Site & Context Analysis",
            "Sustainable Concept Development",
            "Technical Documentation",
            "Engineering Coordination",
        ],
    },
    {
        id: 2,
        title: "INTERIOR DESIGN",
        subtitle: "Spatial Experience",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        images: [
            TURNKEYINTERIORFITOUT,
            PROJECTMANAGEMENT,
            BUILDINGMANAGEMENTSERVICES,
            ARCHITECTURALDESIGN,
        ],
        sections: [
            "Space Planning & Concept",
            "Material & Finish Selection",
            "Integrated Systems Design",
            "Customization & Visualization",
        ],
    },
    {
        id: 3,
        title: "TURNKEY INTERIOR FIT-OUT",
        subtitle: "Design to Delivery",
        image: TURNKEYINTERIORFITOUT,
        images: [
            TURNKEYINTERIORFITOUT,
            PROJECTMANAGEMENT,
            ARCHITECTURALDESIGN,
        ],
        sections: [
            "Full Project Ownership",
            "Vendor & Resource Management",
            "Quality Control & Inspections",
            "Time & Budget Adherence",
        ],
    },
    {
        id: 4,
        title: "CIVIL & PEB CONSTRUCTION",
        subtitle: "Structural Excellence",
        image: CIVILPEBCONSTRUCTION,
        images: [
            CIVILPEBCONSTRUCTION,
            ARCHITECTURALDESIGN,
            BUILDINGMANAGEMENTSERVICES,
        ],
        sections: [
            "Structural & PEB Synergy",
            "Building Envelope Optimization",
            "Construction Administration",
            "Waste Management & Resource Conservation",
        ],
    },
    {
        id: 5,
        title: "BUILDING MANAGEMENT SERVICES",
        subtitle: "Integrated Engineering",
        image: BUILDINGMANAGEMENTSERVICES,
        images: [
            BUILDINGMANAGEMENTSERVICES,
            CIVILPEBCONSTRUCTION,
            PROJECTMANAGEMENT,
        ],
        sections: [
            "Intelligent Building Design",
            "Safety & Security Systems",
            "Performance Monitoring",
            "Interoperability Optimization",
        ],
    },
    {
        id: 6,
        title: "PROJECT MANAGEMENT",
        subtitle: "End-to-End Control",
        image: PROJECTMANAGEMENT,
        images: [
            PROJECTMANAGEMENT,
            ARCHITECTURALDESIGN,
            BUILDINGMANAGEMENTSERVICES,
        ],
        sections: [
            "Strategic Planning & Scope Establishment",
            "Interdisciplinary Team Dialogue",
            "Risk & Progress Monitoring",
            "Post-Occupancy Evaluation",
        ],
    },
];

const ServicesPage = ({ onServiceClick }) => {
    const [hovered, setHovered] = useState(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-stone-200 relative overflow-hidden">
            {SERVICES_DATA.map((s) => (
                <div
                    key={s.id}
                    className={`absolute inset-0 transition-opacity duration-700 ${hovered === s.id ? "opacity-40" : "opacity-0"
                        }`}
                >
                    <img src={s.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
            ))}

            <div className="relative z-10 px-5 md:px-24 pt-32 md:pt-40 pb-20">
                <div className="mb-16 border-b border-white/10 pb-6 uppercase">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-xs tracking-[0.5em] text-[#C5A059] font-sans font-bold"
                    >
                        Our Services
                    </motion.h1>
                </div>

                {SERVICES_DATA.map((s) => (
                    <motion.div
                        key={s.id}
                        onMouseEnter={() => setHovered(s.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => onServiceClick(s)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: s.id * 0.08 }}
                        className="border-b border-white/5 py-10 cursor-pointer group"
                    >
                        <h2 className="text-2xl md:text-4xl font-logo tracking-[0.1em] text-white/80 group-hover:text-[#C5A059] transition-colors uppercase">
                            {s.title}
                        </h2>
                        <p className="mt-3 max-w-2xl text-[10px] md:text-xs tracking-widest text-white/40 font-sans uppercase">
                            {s.subtitle}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ServicesPage;
