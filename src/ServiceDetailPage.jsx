import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award, Users, TrendingUp, Hammer, Building2, Cog } from "lucide-react";
import BackButton from "./components/BackButton";

// SERVICE-SPECIFIC UNIQUE CONTENT
const SERVICE_CONTENT = {
  1: { // ARCHITECTURAL DESIGN
    philosophy: {
      title: "Context-Driven Architecture",
      text: "We believe architecture emerges from careful observation of site, climate, culture, and purpose. Every design decision—from orientation to material—is rooted in creating harmony between built form and its environment. Our approach balances timeless principles with contemporary needs.",
    },
    deliverables: [
      "Conceptual Design With Site Analysis & Massing Studies",
      "Detailed Architectural Drawings & 3D Visualizations",
      "Material Palette & Sustainability Specifications",
      "Regulatory Approvals & Statutory Clearances",
      "Construction Documentation & Site Coordination",
      "Mep Integration & Structural Collaboration",
    ],
    process: [
      {
        step: "01",
        title: "Research & Analysis",
        desc: "Conduct site, climate, and regulatory research while analyzing environmental factors.",
      },
      {
        step: "02",
        title: "Goal Setting",
        desc: "Define sustainability targets, project scope, budget, and timelines.",
      },
      {
        step: "03",
        title: "Integrated Design",
        desc: "Use interdisciplinary charrettes to brainstorm innovative, high-performance solutions.",
      },
      {
        step: "04",
        title: "Concept Development",
        desc: "Create proposals using digital modeling to integrate passive design and biophilic elements.",
      },
      {
        step: "05",
        title: "Refinement & Optimization",
        desc: "Iterate designs based on stakeholder feedback and performance simulations.",
      },
      {
        step: "06",
        title: "Systems Integration",
        desc: "Incorporate advanced building technologies and efficient HVAC, water, and waste systems.",
      },
      {
        step: "07",
        title: "Documentation",
        desc: "Prepare detailed drawings and specify sustainable materials for construction.",
      },
      {
        step: "08",
        title: "Administration & Evaluation",
        desc: "Oversee construction quality and monitor post-occupancy performance for continuous improvement.",
      },
    ],
    features: [
      { icon: Hammer, title: "15+ MEP Engineers", desc: "Highly skilled multidisciplinary team." },
      { icon: Building2, title: "15+ Architects", desc: "Design-led approach with diverse expertise." },
      { icon: TrendingUp, title: "200+ Projects Delivered", desc: "Across Residential, Commercial, Institutional, Industrial Typologies." }
    ],
  },
  2: { // INTERIOR DESIGN
    philosophy: {
      title: "Human-Centered Spatial Design",
      text: "Our interiors prioritize user experience—how light falls, how materials feel, how spaces adapt to changing needs. We blend functionality with sensory richness, creating environments that inspire, comfort, and perform across years of use.",
    },
    deliverables: [
      "Space Planning & Functional Layouts",
      "Custom Furniture Design & Detailing",
      "All Interior Works And Civil Works Execution",
      "All Custom Furniture, Fixtures And Efficient Installation",
      "MEP Works, Fire Fighting Works, HVAC Work And Security Works Execution",
    ],
    process: [
      {
        step: "01",
        title: "Research & Goal Setting",
        desc: "Perform site analysis and define project goals, including scope, budget, and sustainability targets.",
      },
      {
        step: "02",
        title: "Integrated Design & Concept",
        desc: "Brainstorm with interdisciplinary teams to develop conceptual proposals using digital modeling and simulations.",
      },
      {
        step: "03",
        title: "Design Refinement",
        desc: "Iterate on concepts based on stakeholder feedback and optimize material selection for efficiency and durability.",
      },
      {
        step: "04",
        title: "Systems & Technology",
        desc: "Integrate smart systems and coordinate efficient lighting, HVAC, and waste management designs.",
      },
      {
        step: "05",
        title: "Documentation & Specification",
        desc: "Prepare detailed construction drawings and specify sustainable finishes and products.",
      },
      {
        step: "06",
        title: "Construction Administration",
        desc: "Conduct site visits and inspections to ensure the interior fit-out matches the design intent and quality standards.",
      },
      {
        step: "07",
        title: "Evaluation & Improvement",
        desc: "Monitor occupant satisfaction after move-in and document lessons learned for future projects.",
      },
    ],
    features: [
      { icon: Award, title: "Bespoke Solutions", desc: "Custom-designed furniture, lighting, and fixtures" },
      { icon: Users, title: "Collaborative Process", desc: "Close partnership with clients and artisans" },
      { icon: TrendingUp, title: "300+ Interiors", desc: "From boutique homes to corporate headquarters" },
    ],
  },
  3: { // TURNKEY INTERIOR FIT-OUT
    philosophy: {
      title: "Seamless Design-Build Integration",
      text: "Our turnkey model eliminates fragmented workflows. From concept to completion, we orchestrate design intent, vendor execution, and quality benchmarks—delivering predictable outcomes without compromise on creativity or craft.",
    },
    deliverables: [
      "End-To-End Project Planning & Design",
      "Vendor Sourcing & Material Procurement",
      "All Interior Works And Civil Works Execution",
      "All Furniture, Fixtures, and Efficient Installation",
      "MEP Works, Fire Fighting Works, HVAC Work and Security Works Execution",
      "Warranty & Post-Handover Support",
    ],
    process: [
      {
        step: "01",
        title: "Research & Goal Setting",
        desc: "Conduct project site research and define clear goals, budget constraints, and timelines.",
      },
      {
        step: "02",
        title: "Integrated Concept Development",
        desc: "Facilitate interdisciplinary brainstorming to develop conceptual proposals and visualize them using digital modeling.",
      },
      {
        step: "03",
        title: "Design Refinement",
        desc: "Iterate on concepts based on feedback to optimize material selection and construction techniques.",
      },
      {
        step: "04",
        title: "System Integration",
        desc: "Incorporate smart systems and collaborate with engineers on lighting, HVAC, and waste management.",
      },
      {
        step: "05",
        title: "Documentation & Specification",
        desc: "Prepare detailed construction drawings and specify sustainable materials and finishes.",
      },
      {
        step: "06",
        title: "Execution & Oversight",
        desc: "Take complete ownership of vendor selection, project monitoring, and site inspections to ensure quality.",
      },
      {
        step: "07",
        title: "Final Handover & Evaluation",
        desc: "Manage the final delivery to the client and monitor occupant satisfaction and building performance.",
      },
    ],
    features: [
      { icon: Award, title: "Single-Point Accountability", desc: "One team, one timeline, one commitment" },
      { icon: Users, title: "500+ Skilled Workers", desc: "In-house execution teams for quality control" },
      { icon: TrendingUp, title: "98% On-Time Delivery", desc: "Proven track record across sectors" },
    ],
  },
  4: { // CIVIL & PEB CONSTRUCTION
    philosophy: {
      title: "Precision Engineering & Sustainability",
      text: "We approach construction as a craft—combining structural integrity, material efficiency, and environmental responsibility. Whether traditional RCC or modern PEB, our focus is longevity, safety, and minimal ecological footprint.",
    },
    deliverables: [
      "Structural Design & Engineering Analysis",
      "Foundation, RCC Framing & PEB Structures",
      "Facade Systems & Envelope Detailing",
      "Waterproofing, Insulation & Finishes",
      "Site Management & Safety Protocols",
      "Green Building Certification Support",
    ],
    process: [
      {
        step: "01",
        title: "Research & Goal Setting",
        desc: "Perform thorough research on site conditions and local regulations while defining clear sustainability goals, budget constraints, and project timelines.",
      },
      {
        step: "02",
        title: "Integrated Engineering",
        desc: "Facilitate interdisciplinary dialogue between architects and structural engineers to explore synergies in PEB (Pre-Engineered Building) systems.",
      },
      {
        step: "03",
        title: "Design Refinement",
        desc: "Use digital modeling tools to optimize the building envelope and construction techniques for maximum energy efficiency and durability.",
      },
      {
        step: "04",
        title: "Systems Integration",
        desc: "Incorporate advanced building technologies, smart systems, and efficient MEP (Mechanical, Electrical, and Plumbing) solutions.",
      },
      {
        step: "05",
        title: "Documentation & Specification",
        desc: "Prepare detailed construction documents and specify sustainable materials that meet high-performance environmental standards.",
      },
      {
        step: "06",
        title: "Execution Management",
        desc: "Take complete ownership of vendor selection, project monitoring, site inspections, and construction waste management.",
      },
      {
        step: "07",
        title: "Handover & Evaluation",
        desc: "Ensure a seamless final handover to the client and monitor long-term building performance and occupant satisfaction.",
      },
    ],
    features: [
      { icon: Award, title: "Zero Accident Record", desc: "Safety-first approach across all sites" },
      { icon: Award, title: "Green Rated Building", desc: "Ecofriendly, Sustainable and Efficient Buildings" },
      { icon: TrendingUp, title: "2M+ Sq ft Built", desc: "Across residential, commercial, and industrial" },
    ],
  },
  5: { // BUILDING MANAGEMENT SERVICES
    philosophy: {
      title: "Intelligent Infrastructure Integration",
      text: "Modern buildings are complex ecosystems of mechanical, electrical, plumbing, and digital systems. We design integrated smart building solutions that optimize energy, comfort, safety, and operational efficiency—future-proofing investments for decades.",
    },
    deliverables: [
      "Mechanical, Plumbing, Electrical, Fire Fighting, Safety, Security, and Digital Systems",
      "HVAC Zoning & Vrv/Vrf Systems",
      "Fire Detection, Suppression & Alarm Systems",
      "BMS/IBMS Integration & Automation",
      "Networks Design and Security System",
      "Preventive Maintenance Planning",
    ],
    process: [
      {
        step: "01",
        title: "Systems Research & Analysis",
        desc: "Conduct thorough research on project site requirements and analyze environmental factors to determine necessary building systems.",
      },
      {
        step: "02",
        title: "Goal Setting & Performance Targets",
        desc: "Establish clear targets for energy efficiency, indoor environmental quality, and resource conservation.",
      },
      {
        step: "03",
        title: "Integrated Systems Design",
        desc: "Facilitate dialogue between MEP engineers and sustainability consultants to explore synergies in lighting, HVAC, and waste management.",
      },
      {
        step: "04",
        title: "Technology Integration",
        desc: "Incorporate advanced building technologies, smart systems, and renewable energy solutions into the structural and seismic design.",
      },
      {
        step: "05",
        title: "Interoperability Optimization",
        desc: "Ensure all building systems, including fire fighting, networking, and security, are compatible to optimize performance and minimize operational costs.",
      },
      {
        step: "06",
        title: "Technical Documentation",
        desc: "Prepare detailed drawings and technical requirements for intelligent building design, AV systems, and PA systems.",
      },
      {
        step: "07",
        title: "Implementation Support",
        desc: "Conduct inspections and coordination meetings during construction to ensure smart systems and MEP designs are executed correctly.",
      },
      {
        step: "08",
        title: "Performance Monitoring",
        desc: "Use data analytics and performance metrics post-occupancy to track energy usage, air quality, and water consumption.",
      },
    ],
    features: [
      { icon: Award, title: "Energy Optimization", desc: "30-50% reduction in operational costs" },
      { icon: Users, title: "24/7 Support", desc: "Post-installation monitoring & maintenance" },
      { icon: TrendingUp, title: "Smart Building Expertise", desc: "IoT-enabled automation & analytics" },
    ],
  },
  6: { // PROJECT MANAGEMENT
    philosophy: {
      title: "Strategic Orchestration & Control",
      text: "Great projects require more than great design—they demand rigorous planning, transparent communication, and adaptive problem-solving. We serve as the client's trusted advisor, aligning stakeholders, mitigating risks, and delivering on promise.",
    },
    deliverables: [
      "Feasibility Study & Project Charter",
      "Master Scheduling & Milestone Planning",
      "Budget Estimation & Cost Control",
      "Contractor Tendering & Evaluation",
      "Weekly Progress Reporting & Dashboards",
      "Risk Management & Conflict Resolution",
    ],
    process: [
      {
        step: "01",
        title: "Establishment of Goals & Scope",
        desc: "Define clear sustainability targets, performance objectives, and project parameters including budget and timelines.",
      },
      {
        step: "02",
        title: "Integrated Team Dialogue",
        desc: "Facilitate interdisciplinary communication between architects, designers, and engineers to optimize performance and generate innovative solutions.",
      },
      {
        step: "03",
        title: "Design Refinement & Simulation",
        desc: "Iterate on project concepts using performance simulations and digital modeling to ensure efficiency and durability.",
      },
      {
        step: "04",
        title: "Systems Coordination",
        desc: "Manage the integration of advanced building technologies, smart systems, and renewable energy solutions while collaborating with MEP engineers.",
      },
      {
        step: "05",
        title: "Detailed Documentation",
        desc: "Oversee the preparation of comprehensive drawings and technical specifications to ensure design intent is clearly communicated.",
      },
      {
        step: "06",
        title: "Execution Ownership",
        desc: "Take full responsibility for vendor selection, resource management, and rigorous site inspections to maintain quality standards.",
      },
      {
        step: "07",
        title: "Construction Monitoring",
        desc: "Implement construction waste management strategies and monitor progress to ensure the project stays on schedule and within budget.",
      },
      {
        step: "08",
        title: "Post-Occupancy Evaluation",
        desc: "Conduct performance monitoring and collect occupant feedback after completion to identify opportunities for continuous improvement.",
      },
    ],
    features: [
      { icon: Award, title: "92% Client Retention", desc: "Long-term partnerships built on trust" },
      { icon: Users, title: "Pmi Certified Professionals", desc: "Globally recognized project management expertise" },
      { icon: TrendingUp, title: "₹500Cr+ Managed", desc: "Across diverse sectors and geographies" },
    ],
  },
};

const ServiceDetailPage = ({ service, setPage, onBack, onStartProject, onScheduleCall }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => window.scrollTo(0, 0), []);

  const content = SERVICE_CONTENT[service.id] || SERVICE_CONTENT[1];
  const scopeItems = Array.isArray(service?.sections) ? service.sections : [];

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
            <h2 className="text-2xl md:text-5xl text-justify font-logo uppercase leading-tight mb-6 md:mb-8 tracking-wide">
              {content.philosophy.title}
            </h2>
            <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-[#C5A059] to-transparent" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-xl leading-relaxed text-justify text-stone-600 pt-0"
          >
            {content.philosophy.text}
          </motion.p>
        </div>
      </section>

      {/* FEATURES - Icon Cards */}
      <section className="px-5 md:px-20 py-16 bg-white border-y border-stone-200">
        <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 ${content.features.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-10 md:gap-16`}>
          {content.features.map((feature, i) => {
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
      </section>

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
              <p className="relative z-10 text-base md:text-lg text-stone-700 leading-relaxed text-center">
                {item}
              </p>
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
