// data/projects.data.js
import { ASSETS } from "./ProjectAssets";

const createProject = ({
    id,
    title,
    category,
    location,
    year,
    area,
    assets,
    description,
    highlights = [],
    scope = [],
    client = "",
    status = "Completed",
    designStyle = "",
    type = "INTERIOR", // Default to Interior
}) => ({
    id,
    title,
    category,
    type,
    location,
    year,
    area,
    status,
    client,
    designStyle,
    coverImage: assets[0],
    images: assets,
    description,
    highlights,
    scope,
});

export const PROJECTS = [
    /* ================= IT / ITES ================= */

    createProject({
        id: "relevantz-technologies",
        title: "M/s Relevantz Technologies",
        category: "IT & ITES OFFICES",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "60,000 Sq.Ft",
        client: "Relevantz Technologies Pvt Ltd",
        designStyle: "Contemporary Corporate",
        assets: ASSETS.RELEVANTZ,
        description:
            "A contemporary IT workspace designed to promote collaboration, agility, and employee well-being.",
        highlights: [
            "Collaborative open office planning",
            "Biophilic design elements",
            "Energy-efficient lighting",
            "Flexible work zones",
        ],
        scope: ["Interior Design", "MEP Coordination", "Turnkey Execution"],
    }),

    createProject({
        id: "emerson-process-management",
        title: "M/s Emerson Process Management",
        category: "IT & ITES OFFICES",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2023",
        area: "45,000 Sq.Ft",
        client: "Emerson",
        designStyle: "Global Corporate",
        assets: ASSETS.EMERSON,
        description:
            "Corporate office interiors reflecting global brand standards and operational efficiency.",
        highlights: [
            "Brand-aligned interiors",
            "Efficient space planning",
            "High-performance workstations",
        ],
        scope: ["Interior Design", "Project Management"],
    }),

    createProject({
        id: "ofs-technologies",
        title: "M/s OFS Technologies",
        category: "IT & ITES OFFICES",
        type: "INTERIOR",
        location: "Bangalore, India",
        year: "2022",
        area: "38,000 Sq.Ft",
        designStyle: "Modern Tech Office",
        assets: ASSETS.OFS,
        description:
            "Technology-driven office interiors supporting high-performance teams.",
        highlights: [
            "Optimized workstation layouts",
            "Collaboration hubs",
            "Minimal modern palette",
        ],
        scope: ["Space Planning", "Interior Design"],
    }),

    /* ================= COMMERCIAL ================= */

    createProject({
        id: "forbes-marshall",
        title: "M/s Forbes Marshall – Regional Office",
        category: "IT & ITES OFFICES",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2023",
        area: "25,000 Sq.Ft",
        client: "Forbes Marshall",
        designStyle: "Corporate Modern",
        assets: ASSETS.FORBES,
        description:
            "Regional corporate office designed for leadership presence and functional clarity.",
        highlights: [
            "Executive office planning",
            "Brand identity integration",
        ],
        scope: ["Interior Design", "Brand Integration"],
    }),

    createProject({
        id: "panalpina",
        title: "M/s Panalpina World Transport",
        category: "IT & ITES OFFICES",
        type: "INTERIOR",
        location: "Mumbai, India",
        year: "2022",
        area: "28,000 Sq.Ft",
        designStyle: "Corporate Industrial",
        assets: ASSETS.PANALPINA,
        description:
            "Logistics corporate office balancing operations and administration.",
        highlights: [
            "Functional zoning",
            "Durable material palette",
        ],
        scope: ["Interior Design"],
    }),

    /* ================= CLUBS ================= */

    createProject({
        id: "al-saraya-club",
        title: "M/s Al Saraya Corniche Club",
        category: "CLUBS & RESTO BARS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.ALSARAYA,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    /* ================= WAREHOUSE ================= */

    createProject({
        id: "dcp-warehouse",
        title: "M/s DCP Warehouse",
        category: "WAREHOUSE & FACTORY BUILDINGS",
        type: "ARCHITECTURE",
        location: "Oragadam, India",
        year: "2023",
        area: "1,80,000 Sq.Ft",
        designStyle: "Industrial Functional",
        assets: ASSETS.DCP,
        description:
            "Large-scale warehouse optimized for logistics and storage efficiency.",
        highlights: [
            "Efficient vehicular movement",
            "Optimized structural spans",
        ],
        scope: ["Architecture", "Execution"],
    }),

    createProject({
        id: "blaack-forest",
        title: "M/s Blaack Forest",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.BLAACK,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "coastal-taste",
        title: "M/s Coastal Taste Restaurants",
        category: "RESTAURANTS & KIOSKS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.COASTAL,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "decathlon",
        title: "M/s Decathlon",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.DECATHLON,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "srss",
        title: "M/s SRSS",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.SRSS,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "srf",
        title: "M/s SRF",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.SRF,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "srf2",
        title: "M/s SRF2",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.SRF2,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "phoenix",
        title: "M/s Phoenix",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.PHOENIX,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "mds",
        title: "M/s MDS",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.MDS,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "kalpadruma",
        title: "M/s Kalpadruma",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.KALPADRUMA,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "watch",
        title: "M/s Watch",
        category: "SHOWROOM & RETAIL OUTLETS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.WATCH,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),

    createProject({
        id: "SRSS",
        title: "M/s SRSS",
        category: "RESTAURANTS & KIOSKS",
        type: "INTERIOR",
        location: "Chennai, India",
        year: "2024",
        area: "18,000 Sq.Ft",
        designStyle: "Luxury Contemporary",
        assets: ASSETS.SRSS,
        description:
            "Premium club interiors blending luxury with vibrant social spaces.",
        highlights: [
            "Mood lighting design",
            "High-end material palette",
        ],
        scope: ["Interior Design", "Lighting"],
    }),
];
