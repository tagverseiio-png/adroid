export default function ProcessSection({ onOpenModal, data = {} }) {
  const {
    headline = "Four Stages, One Team, Zero Handoffs",
    sub_headline = "&ldquo;This is the actual sequence every Adroit Design residential project follows, from first consultation to handover.&rdquo;",
    steps = [
      {
        num: "01",
        title: "Consultation & Site Visit",
        desc: '"Site study, budget and brief discussion to understand how you want to live in the space."',
        stage: "Stage 01 · Planning",
      },
      {
        num: "02",
        title: "Design & 3D Visualization",
        desc: '"Floor plans, elevations and photorealistic 3D walkthroughs, refined until you approve."',
        stage: "Stage 02 · Architecture",
      },
      {
        num: "03",
        title: "Approvals & Costing",
        desc: '"Plan sanction, statutory approvals and a detailed, itemised construction estimate."',
        stage: "Stage 03 · Budget & Sanction",
      },
      {
        num: "04",
        title: "Construction & Handover",
        desc: '"Turnkey construction with weekly updates, ending in a ready-to-move-in home."',
        stage: "Stage 04 · Key Handover",
      },
    ]
  } = data;

  return (
    <section id="process" className="py-16 lg:py-24 bg-[#FBF9F5] border-b border-[#ECE7DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold text-[#B85A32] tracking-widest uppercase block mb-2">
            HOW WE BUILD YOUR HOME
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2C1D11] mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }} dangerouslySetInnerHTML={{ __html: headline }}>
          </h2>
          <p className="text-[#66605B] text-base sm:text-lg" dangerouslySetInnerHTML={{ __html: sub_headline }}></p>
        </div>

        {/* Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#ECE7DF] p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="text-5xl font-extrabold tracking-tight leading-none text-[#B85A32]/45 group-hover:text-[#B85A32] transition-colors mb-5">
                  {step.num || `0${idx + 1}`}
                </div>
                <h3 className="text-xl font-bold text-[#2C1D11] mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {step.title}
                </h3>
                <p className="text-sm text-[#66605B] leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#FBF9F5] text-xs font-semibold text-[#B85A32] uppercase tracking-wider">
                {step.stage || `Stage 0${idx + 1}`}
              </div>
            </div>
          ))}
        </div>

        {/* Section CTA */}
        {onOpenModal && (
          <div className="mt-12 text-center">
            <button
              onClick={onOpenModal}
              className="inline-flex items-center justify-center bg-[#B85A32] hover:bg-[#9A4623] text-white font-semibold text-sm px-8 py-4 rounded shadow hover:shadow-md transition-all uppercase tracking-wider"
            >
              Get Free Consultation
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
