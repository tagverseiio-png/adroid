import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award, Users, TrendingUp, Hammer, Building2, Cog, ShieldCheck, Leaf, Zap, ClipboardCheck } from "lucide-react";
import BackButton from "./components/BackButton";

// SERVICE-SPECIFIC UNIQUE CONTENT
const SERVICE_CONTENT = {
  1: { // ARCHITECTURAL DESIGN
    philosophy: {
      title: "Context-Driven Architecture",
      text: "We believe great architecture begins with understanding the site, climate, culture and functional purpose of a space. Our architectural design approach focuses on site-responsive architecture, sustainable building design and climate-sensitive planning to create environments that are both efficient and timeless. From building orientation and material selection to spatial planning, every design decision ensures harmony between modern architecture, environmental sustainability, and functional design, delivering high-performance residential, commercial and institutional spaces.",
    },
    scope: [
      { title: "Residential Architecture", desc: "Design and construction of modern villas, farm houses, luxury apartments, beach houses, gated communities and residential layouts." },
      { title: "Commercial Architecture", desc: "Planning and development of IT parks, corporate offices, shopping complexes, commercial showrooms and commercial buildings." },
      { title: "Industrial & Warehouse Buildings", desc: "Industrial architecture for manufacturing units processing units, warehouses, logistics hubs and cold storage facilities." },
      { title: "Institutional, Healthcare & Hospitality Buildings", desc: "Architectural design for star hotels, motels, serviced apartments, educational institutions, schools, colleges, churches, auditoriums, hospitals and healthcare facilities with full regulatory compliance." }
    ],
    deliverables: [
      "Conceptual architectural design with detailed site analysis and massing studies",
      "Professional architectural drawings and realistic 3D visualizations",
      "Sustainable material selection and eco-friendly design specifications",
      "Government approvals and statutory regulatory clearances",
      "Complete construction documentation and site coordination",
      "Integrated MEP engineering and structural design collaboration"
    ],
    process: [
      { step: "01", title: "Site Analysis & Project Brief", desc: "Detailed site evaluation, regulatory review, and project requirement analysis to establish design direction." },
      { step: "02", title: "Concept Design Development", desc: "Innovative architectural concepts balancing aesthetics, functionality, sustainability, and project budget." },
      { step: "03", title: "Technical Design & Execution", desc: "Comprehensive architectural documentation, consultant coordination, and seamless project execution." }
    ],
    features: []
  },
  2: { // INTERIOR DESIGN
    philosophy: {
      title: "Human-Centered Interior Design That Transforms How You Live & Work",
      text: "At Adroit Designs, every interior begins with people — how natural light moves through a space, how materials feel underfoot, how rooms adapt to evolving lifestyles and business needs. We blend precise functionality with rich sensory design, crafting interiors that inspire, comfort and perform beautifully for years to come.",
    },
    features: [
      { icon: Award, title: "Bespoke Solutions", desc: "Fully Custom Furnitures, Lighting & Fixture Design. Every element — from furniture to light fittings — is custom-designed to suit your space, style and budget. Nothing off-the-shelf. Everything made for you!" },
      { icon: Users, title: "Collaborative Process", desc: "Client-First Design Partnership. We work in close partnership with you and our skilled artisans at every step — ensuring your vision stays at the heart of every design decision." },
      { icon: TrendingUp, title: "300+ Interiors Delivered", desc: "From Boutique Homes to Corporate Headquarters. With over 300 successful interior projects across India and Qatar — we bring proven experience to every space, big or small." }
    ],
    scope: [
      { title: "Commercial & Office Spaces", desc: "Corporate Offices, IT & ITES Offices, Commercial Offices, Factory Offices." },
      { title: "Hospitality & Institutional Spaces", desc: "Data Centres, Food Courts, Hospitals, Hotels, Restaurants, Banquet Halls." },
      { title: "Retail & Lifestyle Spaces", desc: "Showrooms, Retail Outlets, Boutiques, Bars, Clubs." },
      { title: "Residential Spaces", desc: "Homes, Villas & Service Apartments." }
    ],
    deliverables: [
      "Space Planning & Functional Layout Design",
      "Custom Furniture Design & Shop Drawings",
      "Complete Interior & Civil Works Execution",
      "Custom Furniture, Fixtures & Efficient Installation",
      "MEP, Fire Fighting, HVAC & Security Systems Execution"
    ],
    process: [
      { step: "01", title: "Research & Goal Setting", desc: "We begin with a thorough site analysis and define your project goals — scope, budget, timeline, and sustainability targets — before a single line is drawn." },
      { step: "02", title: "Integrated Design & Concept Development", desc: "Our interdisciplinary team brainstorms and develops conceptual proposals using advanced digital modelling and simulations — giving you a clear picture before construction begins." },
      { step: "03", title: "Design Refinement", desc: "We iterate and refine concepts based on your feedback, optimizing material selection for durability, aesthetics, and cost-efficiency." },
      { step: "04", title: "Smart Systems & Technology Integration", desc: "From intelligent lighting and HVAC to waste management systems — we integrate smart building technology seamlessly into your interior design." },
      { step: "05", title: "Documentation & Specification", desc: "Detailed construction drawings, material specifications, and sustainable finish schedules are prepared with precision — ensuring zero ambiguity on site." },
      { step: "06", title: "Construction Administration & Site Supervision", desc: "Our team conducts regular site visits and quality inspections to ensure every element of the fit-out matches the approved design intent and our strict quality standards." },
      { step: "07", title: "Post-Occupancy Evaluation & Improvement", desc: "After handover, we monitor occupant satisfaction, gather feedback, and document lessons learned — continuously improving our process for future projects." }
    ]
  },
  3: { // TURNKEY INTERIOR FIT-OUT
    philosophy: {
      title: "Seamless Design-Build Integration — Zero Gaps, Zero Compromises",
      text: "At Adroit Designs, our proven turnkey model eliminates fragmented workflows and contractor confusion. We take complete ownership — orchestrating design intent, vendor execution and quality benchmarks from day one to final handover — delivering predictable outcomes without compromising on creativity, craft or cost.",
    },
    features: [
      { icon: Award, title: "Single-Point Accountability", desc: "One Team. One Timeline. One Commitment. No juggling multiple contractors. No miscommunication. Just one dedicated team responsible for every aspect of your project." },
      { icon: Users, title: "500+ Skilled Workers", desc: "In-House Execution Teams for Unmatched Quality Control. We maintain direct control over workmanship, timelines, and material quality." },
      { icon: TrendingUp, title: "98% On-Time Delivery", desc: "Proven Track Record Across Residential, Commercial & Industrial Sectors. Our 98% on-time delivery rate is a commitment backed by hundreds of successfully completed projects." }
    ],
    scope: [
      { title: "Commercial & Office Spaces", desc: "Corporate Offices, IT & ITES Offices, Commercial Offices, Factory Offices." },
      { title: "Hospitality & Institutional Spaces", desc: "Data Centres, Food Courts, Hospitals, Hotels, Restaurants, Banquet Halls." },
      { title: "Retail & Lifestyle Spaces", desc: "Showrooms, Retail Outlets, Boutiques, Bars, Clubs." },
      { title: "Residential Spaces", desc: "Homes, Villas & Service Apartments." }
    ],
    deliverables: [
      "End-to-End Project Planning & Interior Design",
      "Vendor Sourcing & Material Procurement Management",
      "Complete Interior Works & Civil Works Execution",
      "Furniture, Fixtures & Efficient On-Site Installation",
      "MEP, Fire Fighting, HVAC & Security Systems Execution",
      "Warranty Coverage & Post-Handover Support"
    ],
    process: [
      { step: "01", title: "Research & Goal Setting", desc: "We conduct thorough project site research and define clear goals, budget constraints, and realistic timelines before a single rupee is spent." },
      { step: "02", title: "Integrated Concept Development", desc: "Our cross-disciplinary team facilitates collaborative brainstorming sessions, developing concept proposals and bringing them to life through advanced 3D digital modeling." },
      { step: "03", title: "Design Refinement", desc: "We iterate on design concepts based on your feedback, optimizing material selection, construction techniques, and spatial efficiency at every revision." },
      { step: "04", title: "Smart System Integration", desc: "We incorporate intelligent building systems — coordinating with engineers on lighting design, HVAC, and waste management — for a future-ready, energy-efficient space." },
      { step: "05", title: "Documentation & Specification", desc: "Precise construction drawings, BOQ specifications, and sustainable material and finish schedules are prepared — ensuring on-site execution is seamless and dispute-free." },
      { step: "06", title: "Execution & On-Site Oversight", desc: "We take complete ownership of vendor selection, procurement, project monitoring, and daily site inspections — ensuring every detail meets our strict quality benchmarks." },
      { step: "07", title: "Final Handover & Post-Occupancy Evaluation", desc: "We manage a structured final handover process, conduct occupant satisfaction reviews, and monitor building performance." }
    ]
  },
  4: { // CIVIL & PEB CONSTRUCTION
    philosophy: {
      title: "Engineering as a Craft — Built to Last, Built Responsibly",
      text: "At Adroit Designs, we treat every construction project as a work of structural art. Combining rigorous engineering precision, smart material efficiency and deep environmental responsibility — whether it's traditional RCC construction or modern Pre-Engineered Buildings (PEB) — our focus remains unwavering: longevity, site safety and a minimal ecological footprint for every structure we build.",
    },
    features: [
      { icon: ShieldCheck, title: "Zero Accident Record", desc: "Industry-Leading Safety Standards Across All Construction Sites. Safety is not a checklist at Adroit Designs — it's a culture." },
      { icon: Leaf, title: "Green Rated Buildings", desc: "Eco-Friendly, Sustainable & Energy-Efficient Construction. We design and build Green Rated structures that meet LEED and IGBC standards." },
      { icon: TrendingUp, title: "5M+ Sq. Ft. Built", desc: "Across Residential, Commercial & Industrial Sectors. Over 5 million square feet of successfully constructed space across India and Qatar." }
    ],
    scope: [
      { title: "Residential Construction", desc: "Green Rated Homes, Individual Villas, Apartments." },
      { title: "Commercial & Institutional Construction", desc: "Commercial Buildings, IT Parks, Schools & Colleges, Office Buildings." },
      { title: "Industrial & Public Infrastructure", desc: "Industrial Buildings, Community Buildings, Public Buildings." }
    ],
    deliverables: [
      "Structural Design & Engineering Analysis",
      "Foundation, RCC Framing & Pre-Engineered Building (PEB) Structures",
      "Facade Systems & Building Envelope Detailing",
      "Waterproofing, Insulation & Premium Finishes",
      "Site Management & Strict Safety Protocols",
      "Green Building Certification Support (LEED / IGBC)"
    ],
    process: [
      { step: "01", title: "Research & Goal Setting", desc: "We conduct thorough site condition analysis and local regulatory review — defining clear sustainability goals, budget constraints, and project timelines." },
      { step: "02", title: "Integrated Engineering & Collaboration", desc: "Our architects and structural engineers engage in deep interdisciplinary dialogue — exploring synergies between RCC methods and modern PEB systems." },
      { step: "03", title: "Design Refinement & Optimization", desc: "Using advanced digital modeling and BIM tools, we optimize the building envelope and construction techniques." },
      { step: "04", title: "Smart Systems Integration", desc: "We incorporate intelligent building technologies, smart automation systems, and fully coordinated MEP solutions." },
      { step: "05", title: "Documentation & Specification", desc: "Comprehensive construction documents, BOQ schedules, and sustainable material specifications are prepared with engineering precision." },
      { step: "06", title: "Execution Management & Quality Control", desc: "We take complete ownership of vendor selection, material procurement, project monitoring, and construction waste management." },
      { step: "07", title: "Handover & Long-Term Performance Evaluation", desc: "We manage a transparent handover process, then monitor long-term performance and occupant satisfaction." }
    ]
  },
  5: { // BUILDING MANAGEMENT SERVICES
    philosophy: {
      title: "Modern Buildings Deserve Modern Intelligence",
      text: "Today's buildings are complex, living ecosystems — interconnected networks of mechanical, electrical, plumbing, fire safety and digital systems working in perfect harmony. At Adroit Designs, we engineer fully integrated smart building solutions that optimize energy consumption, occupant comfort, operational safety and long-term efficiency — future-proofing your infrastructure investment for decades to come.",
    },
    features: [
      { icon: Zap, title: "Energy Optimization", desc: "30–50% Reduction in Operational Costs. Our intelligent MEP and BMS designs are engineered to slash energy consumption." },
      { icon: ClipboardCheck, title: "24/7 Support", desc: "Round-the-Clock Post-Installation Monitoring & Maintenance. We provide continuous 24/7 remote monitoring and rapid response support." },
      { icon: TrendingUp, title: "Smart Building Expertise", desc: "IoT-Enabled Automation, Analytics & Intelligent Control. From IoT sensors to AI-driven analytics dashboards." }
    ],
    scope: [
      { title: "Engineering Design Services", desc: "MEP Design, Fire Fighting Design, Structural & Seismic Design, PEB Design." },
      { title: "HVAC & Climate Control", desc: "Heating, Ventilation & Air Conditioning (HVAC) Design & Engineering." },
      { title: "Smart & Digital Building Systems", desc: "Networking Design, Security Systems, Public Address (PA) & Audio-Visual (AV) Systems, Intelligent Building Management Systems (IBMS)." }
    ],
    deliverables: [
      "Mechanical, Plumbing, Electrical, Fire Fighting, Safety, Security & Digital Systems",
      "HVAC Zoning, VRV & VRF System Design & Installation",
      "Fire Detection, Suppression & Alarm Systems",
      "BMS / IBMS Integration & Full Building Automation",
      "Network Infrastructure Design & Security Systems",
      "Preventive Maintenance Planning & Scheduling"
    ],
    process: [
      { step: "01", title: "Systems Research & Site Analysis", desc: "We conduct comprehensive site research and environmental analysis — determining the precise systems required for optimal performance." },
      { step: "02", title: "Goal Setting & Performance Targets", desc: "Clear targets are established upfront — covering energy efficiency, indoor environmental quality, and resource conservation." },
      { step: "03", title: "Integrated Systems Design", desc: "Our engineers collaborate closely — engineering synergies between lighting, HVAC, and waste management systems." },
      { step: "04", title: "Advanced Technology Integration", desc: "We incorporate the latest smart building technologies — IoT sensors, building automation controllers, and renewable energy solutions." },
      { step: "05", title: "Interoperability Optimization", desc: "Every building system is engineered for full interoperability and cross-system communication." },
      { step: "06", title: "Technical Documentation & Specification", desc: "Detailed engineering drawings and technical requirements are prepared for all intelligent systems." },
      { step: "07", title: "Implementation Support & Site Coordination", desc: "Our engineers conduct regular inspections ensuring every system is installed correctly and commissioned to specification." },
      { step: "08", title: "Post-Occupancy Performance Monitoring", desc: "We continuously track energy usage and system health — identifying optimization opportunities." }
    ]
  },
  6: { // PROJECT MANAGEMENT
    philosophy: {
      title: "Delivering Excellence Through Strategic Project Leadership",
      text: "Successful project outcomes are the result of disciplined planning, structured communication, and systematic risk governance — not coincidence. At Adroit Designs, we assume the role of a strategic project advisor, ensuring complete alignment among all stakeholders, maintaining rigorous cost controls and implementing proactive risk mitigation frameworks — from project initiation through to final handover and beyond.",
    },
    features: [
      { icon: Users, title: "92% Client Retention Rate", desc: "Long-Term Partnerships Built on Trust, Transparency & Results. 92% of our clients return for their next project." },
      { icon: Award, title: "PMI Certified Professionals", desc: "Globally Recognized Project Management Expertise. Our project managers bring proven best practices to every project." },
      { icon: TrendingUp, title: "₹500 Cr+ Managed", desc: "Across Diverse Sectors & Geographies. Over ₹500 Crores worth of projects successfully managed spanning across India and Qatar." }
    ],
    scope: [
      { title: "Complete Project Ownership", desc: "Full ownership from concept to completion — covering both civil construction and interior fit-out works under a single point of accountability." },
      { title: "Planning, Tendering & Execution", desc: "Design & Planning Management, Tendering & Vendor Selection, Project Monitoring & Execution Oversight." },
      { title: "Quality & Handover", desc: "Rigorous Quality Assurance processes and structured on-time final handover — every project, every time." }
    ],
    deliverables: [
      "Feasibility Study & Project Charter Development",
      "Master Scheduling & Milestone Planning",
      "Budget Estimation & Ongoing Cost Control",
      "Contractor Tendering, Evaluation & Appointment",
      "Weekly Progress Reporting & Live Project Dashboards",
      "Risk Management, Issue Tracking & Conflict Resolution"
    ],
    process: [
      { step: "01", title: "Establishment of Goals & Scope", desc: "We begin by defining clear project parameters — including budget ceilings, milestone timelines, and stakeholder expectations." },
      { step: "02", title: "Integrated Team Dialogue & Alignment", desc: "We facilitate structured interdisciplinary communication — aligning every team member around a shared project vision." },
      { step: "03", title: "Design Refinement & Performance Simulation", desc: "Using advanced digital modeling, we iteratively refine project concepts — validating efficiency and durability before execution." },
      { step: "04", title: "Systems Coordination & Technology Integration", desc: "We manage the seamless integration of advanced building technologies, coordinating closely with MEP engineers." },
      { step: "05", title: "Detailed Documentation & Specification Management", desc: "Our team oversees the preparation of comprehensive construction drawings and BOQ schedules." },
      { step: "06", title: "Execution Ownership & Vendor Management", desc: "We take full responsibility for contractor tendering, vendor selection, resource allocation, and rigorous site inspections." },
      { step: "07", title: "Construction Monitoring & Budget Control", desc: "Real-time progress monitoring, construction waste management, and schedule adherence controls ensure your project stays on track." },
      { step: "08", title: "Post-Occupancy Evaluation & Continuous Improvement", desc: "We conduct structured performance monitoring and collect occupant feedback for continuous process improvement." }
    ]
  }
};
const ServiceDetailPage = ({ service, setPage, onBack, onStartProject, onScheduleCall }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => window.scrollTo(0, 0), []);

  const content = SERVICE_CONTENT[service.id] || SERVICE_CONTENT[1];
  const scopeItems = Array.isArray(content.scope) ? content.scope : [];

  return (
    <div ref={ref} className="relative bg-[#f6f5f3] text-stone-800">

      {/* Mobile-only back button */}
      <BackButton onBack={() => {
        if (onBack) {
          onBack();
          return;
        }
        if (setPage) setPage('Services');
      }} />

      {/* HERO SECTION - Enhanced with parallax */}
      <section className="relative h-[75vh] md:h-[90vh] overflow-hidden">
        <motion.img
          src={service.image}
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="absolute bottom-16 md:bottom-32 left-6 md:left-20 right-6 md:right-20 max-w-5xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 text-[10px] md:text-xs tracking-widest mb-4 md:mb-6">
              {service.subtitle}
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-logo uppercase leading-[1.1] tracking-tight">
              {service.id === 3 ? (
                <>
                  <span className="block">Turnkey Interior</span>
                  <span className="block">Fit-Out</span>
                </>
              ) : service.id === 5 ? (
                <>
                  <span className="block">Building Management</span>
                  <span className="block">Services</span>
                </>
              ) : service.id === 6 ? (
                <>
                  <span className="block">Project</span>
                  <span className="block">Management</span>
                </>
              ) : (
                service.title
              )}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY - Split Layout */}
      <section className="px-6 md:px-20 py-16 md:py-32 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-5xl font-logo uppercase leading-tight mb-6 md:mb-8 tracking-wide">
              {content.philosophy.title}
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#C5A059] to-transparent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl leading-relaxed text-stone-600 pt-0"
          >
            {content.philosophy.text}
          </motion.p>
        </div>
      </section>

      {/* FEATURES - Icon Cards */}
      {content.features && content.features.length > 0 && (<section className="px-5 md:px-20 py-16 bg-white border-y border-stone-200">
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 ${content.features.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-10 md:gap-16`}>
          {content.features && content.features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#C5A059] to-[#9d7e3a] text-white mb-5">
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl md:text-2xl font-logo uppercase tracking-tight mb-2">{feature.title}</h3>
                <p className="text-stone-600">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>)}

      {/* SCOPE OF SERVICES */}
      <CompactSection title="Scope of Services">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {scopeItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-white border border-stone-200 p-8 md:p-10 min-h-[200px] rounded-2xl flex items-center justify-center text-center hover:border-[#C5A059] transition-all duration-300 hover:shadow-lg overflow-hidden"
            >
              <span className="absolute top-6 right-6 text-5xl md:text-6xl font-logo text-stone-200 group-hover:text-[#C5A059]/20 transition-colors uppercase pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative z-10 flex flex-col items-center justify-center gap-3 w-full">
                <h4 className="font-bold text-lg md:text-xl uppercase tracking-wider text-stone-900 group-hover:text-[#C5A059] transition-colors">{item.title}</h4>
                <p className="text-sm md:text-base text-stone-600 leading-relaxed text-center w-full">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CompactSection>

      {/* KEY DELIVERABLES */}
      <CompactSection title="Key Deliverables">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {content.deliverables.map((d, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 group"
            >
              <CheckCircle2
                size={20}
                className="mt-1 text-[#C5A059] flex-shrink-0 group-hover:scale-110 transition-transform"
              />
              <p className="text-base md:text-lg text-stone-700 leading-relaxed">{d}</p>
            </motion.div>
          ))}
        </div>
      </CompactSection>

      {/* PROCESS */}
      <section className="px-6 md:px-20 py-16 md:py-20 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-logo uppercase tracking-widest mb-12 md:mb-16 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 md:gap-10">
            {content.process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative min-w-0"
              >
                <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[#C5A059] to-transparent opacity-30" />
                <span className="text-5xl md:text-6xl font-logo text-[#C5A059]/20 leading-none uppercase">
                  {p.step}
                </span>
                <h4 className="mt-4 text-base md:text-lg xl:text-xl font-logo mb-3 md:mb-4 uppercase tracking-tight leading-tight">{p.title}</h4>
                <p className="text-stone-600 text-sm md:text-base leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-20 pb-20 md:pb-32 pt-10 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto border-t border-stone-300 pt-12 md:pt-16"
        >
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-end">
            <div>
              <h3 className="text-2xl md:text-5xl font-logo uppercase leading-tight tracking-tight">
                Let's create something exceptional.
              </h3>
              <p className="mt-4 md:mt-6 text-base md:text-xl text-stone-600 leading-relaxed max-w-xl">
                Whether you're planning a new build, renovation, or seeking expert consultation—our team is ready to bring your vision to life with precision and care.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <button
                type="button"
                onClick={() => {
                  if (onStartProject) {
                    onStartProject();
                    return;
                  }
                  if (setPage) setPage('Contact Us');
                  window.location.hash = 'contact-enquiry';
                }}
                className="px-6 py-3.5 md:px-8 md:py-4 bg-stone-900 text-white hover:bg-[#C5A059] transition-colors duration-300 text-sm md:text-lg"
              >
                Start a Project
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onScheduleCall) {
                    onScheduleCall();
                    return;
                  }
                  if (setPage) setPage('Contact Us');
                  window.location.hash = 'contact-enquiry';
                }}
                className="px-6 py-3.5 md:px-8 md:py-4 border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm md:text-lg"
              >
                Schedule Call
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

const CompactSection = ({ title, children }) => (
  <section className="px-6 md:px-20 py-12 md:py-24 max-w-7xl mx-auto">
    {title && (
      <h2 className="text-2xl md:text-5xl font-logo uppercase mb-10 md:mb-16 tracking-widest">
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default ServiceDetailPage;
