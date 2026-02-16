import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const SERVICES_DATA = [
    {
        id: 1,
        title: "ARCHITECTURAL DESIGN",
        subtitle: "Built Environments",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c",
        images: [
            "https://images.unsplash.com/photo-1503387762-592deb58ef4e",
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        ],
        sections: [
            "Residential Buildings – villas, apartments, beach houses, group housing & layouts.",
            "Commercial Buildings – IT parks, offices, shopping complexes & showrooms.",
            "Factory & Industrial Buildings – manufacturing units, warehouses & cold storages.",
            "Hospitality, Institutional & Healthcare buildings with regulatory compliance.",
        ],
    },
    {
        id: 2,
        title: "INTERIOR DESIGN",
        subtitle: "Spatial Experience",
        image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        images: [
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
            "https://images.unsplash.com/photo-1631679706909-1844bbd07221",
            "https://images.unsplash.com/photo-1497366216548-37526070297c",
        ],
        sections: [
            "Corporate offices, IT & ITES workplaces and data centres.",
            "Hotels, restaurants, food courts, banquet halls & hospitality interiors.",
            "Retail outlets, showrooms, boutiques, bars & clubs.",
            "Residential interiors – homes, villas & service apartments.",
        ],
    },
    {
        id: 3,
        title: "TURNKEY INTERIOR FIT-OUT",
        subtitle: "Design to Delivery",
        image: "https://images.unsplash.com/photo-1503389152951-9f343605f61c",
        images: [
            "https://images.unsplash.com/photo-1554995207-c18c203602cb",
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
        ],
        sections: [
            "Complete interior execution for corporate, commercial & hospitality spaces.",
            "Vendor coordination, procurement & site supervision.",
            "Strict adherence to timelines, budgets & quality benchmarks.",
        ],
    },
    {
        id: 4,
        title: "CIVIL & PEB CONSTRUCTION",
        subtitle: "Structural Excellence",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        images: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427",
            "https://images.unsplash.com/photo-1541976844346-f18aeac57b06",
            "https://images.unsplash.com/photo-1565008447742-97f6f38c985c",
        ],
        sections: [
            "Green rated homes, villas & apartment complexes.",
            "Commercial buildings, IT parks & educational institutions.",
            "Industrial buildings, warehouses & community structures.",
        ],
    },
    {
        id: 5,
        title: "BUILDING MANAGEMENT SERVICES",
        subtitle: "Integrated Engineering",
        image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b",
        images: [
            "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc",
            "https://images.unsplash.com/photo-1581091215367-59ab6c5f07a5",
            "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
        ],
        sections: [
            "MEP, HVAC, fire fighting & structural design.",
            "PEB, seismic & intelligent building systems.",
            "Security, networking, PA & AV systems integration.",
        ],
    },
    {
        id: 6,
        title: "PROJECT MANAGEMENT",
        subtitle: "End-to-End Control",
        image: "https://images.unsplash.com/photo-1503389152951-9f343605f61c",
        images: [
            "https://images.unsplash.com/photo-1557804506-669a67965ba0",
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf",
        ],
        sections: [
            "Design coordination, planning & approvals.",
            "Tendering, vendor selection & cost control.",
            "Project monitoring, execution & quality assurance.",
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
