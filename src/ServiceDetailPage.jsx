import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Award, Users, TrendingUp } from "lucide-react";

// SERVICE-SPECIFIC UNIQUE CONTENT
const SERVICE_CONTENT = {
  1: { // ARCHITECTURAL DESIGN
    philosophy: {
      title: "Context-Driven Architecture",
      text: "We believe architecture emerges from careful observation of site, climate, culture, and purpose. Every design decision—from orientation to material—is rooted in creating harmony between built form and its environment. Our approach balances timeless principles with contemporary needs.",
    },
    deliverables: [
      "Conceptual design with site analysis & massing studies",
      "Detailed architectural drawings & 3D visualizations",
      "Material palette & sustainability specifications",
      "Regulatory approvals & statutory clearances",
      "Construction documentation & site coordination",
      "MEP integration & structural collaboration",
    ],
    process: [
      {
        step: "01",
        title: "Site Analysis & Brief",
        desc: "Comprehensive study of context, regulations, and programmatic needs to establish design parameters.",
      },
      {
        step: "02",
        title: "Concept Development",
        desc: "Iterative design exploration balancing aesthetics, function, sustainability, and budget.",
      },
      {
        step: "03",
        title: "Technical Documentation",
        desc: "Detailed drawings, specifications, and coordination with consultants for seamless execution.",
      },
    ],
    features: [
      { icon: Award, title: "Award-Winning Design", desc: "Recognition across national and international platforms" },
      { icon: Users, title: "45+ Architects", desc: "Multidisciplinary team with diverse expertise" },
      { icon: TrendingUp, title: "150+ Projects Delivered", desc: "Spanning residential, commercial & institutional typologies" },
    ],
    caseStudy: {
      title: "Case Study: Tech Campus Bangalore",
      desc: "A 500,000 sq ft IT campus designed with passive climate strategies, achieving 40% energy savings. Featured landscaped terraces, modular workspaces, and LEED Gold certification.",
      stats: [
        { label: "Built-up Area", value: "500,000 sq ft" },
        { label: "Energy Savings", value: "40%" },
        { label: "Timeline", value: "24 months" },
      ],
    },
  },
  2: { // INTERIOR DESIGN
    philosophy: {
      title: "Human-Centered Spatial Design",
      text: "Our interiors prioritize user experience—how light falls, how materials feel, how spaces adapt to changing needs. We blend functionality with sensory richness, creating environments that inspire, comfort, and perform across years of use.",
    },
    deliverables: [
      "Space planning & functional layouts",
      "Custom furniture design & detailing",
      "Lighting design & fixture specifications",
      "Material board & finish coordination",
      "Millwork, joinery & fabrication drawings",
      "Art curation & styling consultancy",
    ],
    process: [
      {
        step: "01",
        title: "Spatial Programming",
        desc: "Understanding user behavior, workflows, and aspirations to shape the layout.",
      },
      {
        step: "02",
        title: "Design Development",
        desc: "Material exploration, custom elements, and detailed interior architecture.",
      },
      {
        step: "03",
        title: "Execution & Styling",
        desc: "Vendor coordination, quality control, and final curation for handover.",
      },
    ],
    features: [
      { icon: Award, title: "Bespoke Solutions", desc: "Custom-designed furniture, lighting, and fixtures" },
      { icon: Users, title: "Collaborative Process", desc: "Close partnership with clients and artisans" },
      { icon: TrendingUp, title: "300+ Interiors", desc: "From boutique homes to corporate headquarters" },
    ],
    caseStudy: {
      title: "Case Study: Luxury Villa, Goa",
      desc: "A 12,000 sq ft beach-facing villa with monsoon-adaptive design. Featured handcrafted teak, terrazzo, and brass details. Natural ventilation reduced AC dependency by 60%.",
      stats: [
        { label: "Area", value: "12,000 sq ft" },
        { label: "Local Artisans", value: "22" },
        { label: "Natural Materials", value: "85%" },
      ],
    },
  },
  3: { // TURNKEY INTERIOR FIT-OUT
    philosophy: {
      title: "Seamless Design-Build Integration",
      text: "Our turnkey model eliminates fragmented workflows. From concept to completion, we orchestrate design intent, vendor execution, and quality benchmarks—delivering predictable outcomes without compromise on creativity or craft.",
    },
    deliverables: [
      "End-to-end project planning & design",
      "Vendor sourcing & material procurement",
      "False ceiling, flooring & partitioning work",
      "Furniture, fixtures & equipment installation",
      "MEP coordination & final commissioning",
      "Warranty & post-handover support",
    ],
    process: [
      {
        step: "01",
        title: "Design Lock & Estimation",
        desc: "Finalized design with transparent cost breakdown and timeline commitment.",
      },
      {
        step: "02",
        title: "Execution & Monitoring",
        desc: "Daily site supervision, quality checks, and real-time reporting.",
      },
      {
        step: "03",
        title: "Handover & Support",
        desc: "Snagging resolution, client training, and 12-month warranty coverage.",
      },
    ],
    features: [
      { icon: Award, title: "Single-Point Accountability", desc: "One team, one timeline, one commitment" },
      { icon: Users, title: "250+ Skilled Workers", desc: "In-house execution teams for quality control" },
      { icon: TrendingUp, title: "98% On-Time Delivery", desc: "Proven track record across sectors" },
    ],
    caseStudy: {
      title: "Case Study: Corporate HQ, Mumbai",
      desc: "75,000 sq ft office fit-out completed in 90 days. Included custom reception, 15 meeting rooms, cafeteria, and activity-based workspaces. Zero defects at handover.",
      stats: [
        { label: "Built-up Area", value: "75,000 sq ft" },
        { label: "Completion Time", value: "90 days" },
        { label: "Teams Involved", value: "14" },
      ],
    },
  },
  4: { // CIVIL & PEB CONSTRUCTION
    philosophy: {
      title: "Precision Engineering & Sustainability",
      text: "We approach construction as a craft—combining structural integrity, material efficiency, and environmental responsibility. Whether traditional RCC or modern PEB, our focus is longevity, safety, and minimal ecological footprint.",
    },
    deliverables: [
      "Structural design & engineering analysis",
      "Foundation, RCC framing & PEB structures",
      "Facade systems & envelope detailing",
      "Waterproofing, insulation & finishes",
      "Site management & safety protocols",
      "Green building certification support",
    ],
    process: [
      {
        step: "01",
        title: "Engineering & Permits",
        desc: "Structural calculations, soil testing, and regulatory approvals.",
      },
      {
        step: "02",
        title: "Construction Execution",
        desc: "Phased implementation with quality testing and safety compliance.",
      },
      {
        step: "03",
        title: "Testing & Certification",
        desc: "Load testing, finishing inspection, and occupancy clearance.",
      },
    ],
    features: [
      { icon: Award, title: "Zero Accident Record", desc: "Safety-first approach across all sites" },
      { icon: Users, title: "ISO Certified", desc: "Quality & safety management systems" },
      { icon: TrendingUp, title: "2M+ sq ft Built", desc: "Across residential, commercial, and industrial" },
    ],
    caseStudy: {
      title: "Case Study: Industrial Warehouse, Chennai",
      desc: "200,000 sq ft PEB structure with 30-ton crane capacity. LEED Silver certified. Completed 20% under budget with rainwater harvesting and solar pre-wiring.",
      stats: [
        { label: "Built-up Area", value: "200,000 sq ft" },
        { label: "Crane Capacity", value: "30 tons" },
        { label: "Cost Savings", value: "20%" },
      ],
    },
  },
  5: { // BUILDING MANAGEMENT SERVICES
    philosophy: {
      title: "Intelligent Infrastructure Integration",
      text: "Modern buildings are complex ecosystems of mechanical, electrical, plumbing, and digital systems. We design integrated BMS solutions that optimize energy, comfort, safety, and operational efficiency—future-proofing investments for decades.",
    },
    deliverables: [
      "MEP system design & load calculations",
      "HVAC zoning & VRV/VRF systems",
      "Fire detection, suppression & alarm systems",
      "BMS/IBMS integration & automation",
      "Energy modeling & green compliance",
      "Preventive maintenance planning",
    ],
    process: [
      {
        step: "01",
        title: "Load Analysis & Design",
        desc: "Detailed electrical, HVAC, and plumbing requirements based on occupancy.",
      },
      {
        step: "02",
        title: "System Integration",
        desc: "Coordinating MEP, fire, security, and automation for unified control.",
      },
      {
        step: "03",
        title: "Commissioning & Training",
        desc: "Testing, calibration, and operator training for optimal performance.",
      },
    ],
    features: [
      { icon: Award, title: "Energy Optimization", desc: "30-50% reduction in operational costs" },
      { icon: Users, title: "24/7 Support", desc: "Post-installation monitoring & maintenance" },
      { icon: TrendingUp, title: "Smart Building Expertise", desc: "IoT-enabled automation & analytics" },
    ],
    caseStudy: {
      title: "Case Study: Hotel Retrofit, Hyderabad",
      desc: "220-room hotel upgraded with VRF HVAC, smart lighting, and centralized BMS. Achieved 45% energy savings and improved guest comfort scores by 30%.",
      stats: [
        { label: "Rooms", value: "220" },
        { label: "Energy Savings", value: "45%" },
        { label: "ROI Period", value: "3.2 years" },
      ],
    },
  },
  6: { // PROJECT MANAGEMENT
    philosophy: {
      title: "Strategic Orchestration & Control",
      text: "Great projects require more than great design—they demand rigorous planning, transparent communication, and adaptive problem-solving. We serve as the client's trusted advisor, aligning stakeholders, mitigating risks, and delivering on promise.",
    },
    deliverables: [
      "Feasibility study & project charter",
      "Master scheduling & milestone planning",
      "Budget estimation & cost control",
      "Contractor tendering & evaluation",
      "Weekly progress reporting & dashboards",
      "Risk management & conflict resolution",
    ],
    process: [
      {
        step: "01",
        title: "Planning & Setup",
        desc: "Defining scope, budget, timeline, and governance structure.",
      },
      {
        step: "02",
        title: "Execution Oversight",
        desc: "Daily monitoring, coordination meetings, and issue resolution.",
      },
      {
        step: "03",
        title: "Closeout & Handover",
        desc: "Commissioning, documentation, and post-occupancy support.",
      },
    ],
    features: [
      { icon: Award, title: "92% Client Retention", desc: "Long-term partnerships built on trust" },
      { icon: Users, title: "PMI Certified Professionals", desc: "Globally recognized project management expertise" },
      { icon: TrendingUp, title: "₹500Cr+ Managed", desc: "Across diverse sectors and geographies" },
    ],
    caseStudy: {
      title: "Case Study: Mixed-Use Development, NCR",
      desc: "₹120 Cr project with retail, office, and residential components. Coordinated 8 consultants and 15 contractors. Delivered 6 weeks ahead of schedule with 12% cost savings.",
      stats: [
        { label: "Project Value", value: "₹120 Cr" },
        { label: "Timeline Saved", value: "6 weeks" },
        { label: "Cost Savings", value: "12%" },
      ],
    },
  },
};

const ServiceDetailPage = ({ service }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.7]);

  useEffect(() => window.scrollTo(0, 0), []);

  const content = SERVICE_CONTENT[service.id] || SERVICE_CONTENT[1];

  return (
    <div ref={ref} className="bg-[#f6f5f3] text-stone-800">

      {/* BACK BUTTON */}
      {/* BACK BUTTON REMOVED */}

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
              {service.title}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* PHILOSOPHY - Split Layout */}
      <section className="px-6 md:px-20 py-16 md:py-32 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-20 items-start">
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
            className="text-base md:text-xl leading-relaxed text-stone-600 pt-0 md:pt-12"
          >
            {content.philosophy.text}
          </motion.p>
        </div>
      </section>

      {/* FEATURES - Icon Cards */}
      <section className="px-5 md:px-20 py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
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

      {/* SCOPE OF WORK */}
      <CompactSection title="Scope of Work">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {service.sections.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative bg-white border border-stone-200 p-8 md:p-10 min-h-[200px] hover:border-[#C5A059] transition-all duration-300 hover:shadow-lg"
            >
              <span className="absolute top-6 right-6 text-5xl font-logo text-stone-100 group-hover:text-[#C5A059]/10 transition-colors uppercase">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="relative text-base md:text-lg text-stone-700 leading-relaxed">
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
          <h2 className="text-3xl md:text-6xl font-serif mb-12 md:mb-16 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
            {content.process.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="absolute -left-2 top-0 w-1 h-full bg-gradient-to-b from-[#C5A059] to-transparent opacity-30" />
                <span className="text-5xl md:text-7xl font-logo text-[#C5A059]/20 leading-none uppercase">
                  {p.step}
                </span>
                <h4 className="mt-4 text-lg md:text-2xl font-logo mb-3 md:mb-4 uppercase tracking-tight">{p.title}</h4>
                <p className="text-stone-600 text-base md:text-lg leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="px-6 md:px-20 py-16 md:py-28 bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] md:text-xs tracking-[0.3em] text-[#C5A059] uppercase mb-4 block">
              Featured Work
            </span>
            <h3 className="text-2xl md:text-5xl font-logo uppercase tracking-wider mb-6">
              {content.caseStudy.title}
            </h3>
            <p className="text-base md:text-xl text-stone-300 leading-relaxed mb-10 md:mb-12 max-w-3xl">
              {content.caseStudy.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 border-t border-white/10 pt-10">
              {content.caseStudy.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-2xl md:text-5xl font-logo text-[#C5A059] mb-1 md:mb-2 uppercase tracking-tighter">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm md:text-base text-stone-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <CompactSection title="Industries Served">
        <div className="flex flex-wrap gap-3 md:gap-4">
          {[
            "Residential",
            "Commercial Offices",
            "IT & ITES",
            "Hospitality",
            "Retail & F&B",
            "Healthcare",
            "Educational Institutions",
            "Industrial & Logistics",
            "Mixed-Use Developments",
            "Government & PSU",
          ].map((tag, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="px-5 py-2.5 border border-stone-300 text-stone-700 text-sm md:text-base hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300 cursor-default"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </CompactSection>

      {/* GALLERY */}
      <section className="px-5 md:px-20 py-20 md:py-28">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif mb-16">Selected Works</h2>
          <div className="grid md:grid-cols-2 gap-8 md:gap-14">
            {service.images.slice(0, 4).map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.15 }}
                className="group relative aspect-[4/5] overflow-hidden bg-stone-200"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt=""
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
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
              <button className="px-6 py-3.5 md:px-8 md:py-4 bg-stone-900 text-white hover:bg-[#C5A059] transition-colors duration-300 text-sm md:text-lg">
                Start a Project
              </button>
              <button className="px-6 py-3.5 md:px-8 md:py-4 border border-stone-300 hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 text-sm md:text-lg">
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
