import React from "react";

interface ThankYouViewProps {
  onReturn: () => void;
  data: {
    name: string;
    company: string;
    type: string;
    ticket: string;
  };
}

export default function ThankYouView({ onReturn, data }: ThankYouViewProps) {
  return (
    <div className="min-h-screen bg-beige-100 blueprint-grid-beige flex flex-col justify-between">
      
      {/* Top Minimal Header */}
      <div className="w-full border-b border-beige-250 bg-white/90 py-5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-lightblue-500 flex items-center justify-center text-white font-bold shadow-md shadow-lightblue-500/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 20h20"/>
                <path d="m5 20 7-16 7 16"/>
                <path d="M8.5 12h7"/>
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-arch-ink uppercase">Adroit Design</span>
          </div>
          <span className="font-mono text-xs text-arch-muted uppercase tracking-widest hidden sm:inline">ENGINEERING ENQUIRY SYSTEM</span>
        </div>
      </div>

      {/* Main Thank You Card */}
      <div className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="max-w-xl w-full bg-white border border-beige-250 rounded-2xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
          
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-lightblue-100 rounded-full blur-2xl"></div>

          {/* Success Animation Check Badge in Light Blue */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-lightblue-500 to-lightblue-300 p-0.5 shadow-lg shadow-lightblue-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-lightblue-600">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>

          <span className="font-mono text-xs font-semibold text-lightblue-600 uppercase tracking-widest block mb-2">ENQUIRY TRANSMITTED</span>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-arch-ink tracking-tight mb-4">
            Thank You for Contacting Adroit Design.
          </h1>
          
          <p className="text-base text-arch-steel leading-relaxed mb-6">
            Your project enquiry has been successfully submitted.<br />
            Our engineering team will review your requirements and get back to you shortly.
          </p>

          {/* Enquiry Details Summary Card */}
          <div className="bg-beige-50 rounded-xl p-4 border border-beige-250 text-left mb-8 font-mono text-xs space-y-2 shadow-inner">
            <div className="flex justify-between border-b border-beige-250 pb-1.5">
              <span className="text-arch-muted uppercase font-semibold">Docket Ref:</span>
              <span className="text-lightblue-600 font-bold">{data.ticket}</span>
            </div>
            <div className="flex justify-between border-b border-beige-250 pb-1.5">
              <span className="text-arch-muted uppercase font-semibold">Contact / Company:</span>
              <span className="text-arch-ink font-medium">{data.name} ({data.company})</span>
            </div>
            <div className="flex justify-between border-b border-beige-250 pb-1.5">
              <span className="text-arch-muted uppercase font-semibold">Project Type:</span>
              <span className="text-arch-ink font-medium">{data.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-arch-muted uppercase font-semibold">Review Window:</span>
              <span className="text-lightblue-700 font-semibold">&lt; 24 Business Hours</span>
            </div>
          </div>

          {/* Back to Home Action */}
          <div>
            <button 
              type="button" 
              onClick={onReturn} 
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm font-semibold text-white bg-lightblue-500 hover:bg-lightblue-600 rounded-lg transition-all duration-200 shadow-md shadow-lightblue-500/25 border border-lightblue-400/50 cursor-pointer">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>Back to Home</span>
            </button>
          </div>

        </div>
      </div>

      {/* Minimal Bottom Bar */}
      <div className="py-4 border-t border-beige-250 text-center font-mono text-[11px] text-arch-muted bg-white">
        Adroit Design · Industrial Architectural Design &amp; Civil Engineering
      </div>

    </div>
  );
}
