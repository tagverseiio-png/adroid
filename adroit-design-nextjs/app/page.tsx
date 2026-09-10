"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";
import ThankYouView from "@/components/ThankYouView";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thankYouData, setThankYouData] = useState<{ name: string; company: string; type: string; ticket: string } | null>(null);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccess = (data: { name: string; company: string; type: string; ticket: string }) => {
    setThankYouData(data);
    setIsModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleReturnToHome = () => {
    setThankYouData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (thankYouData) {
    return <ThankYouView onReturn={handleReturnToHome} data={thankYouData} />;
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar onOpenModal={handleOpenModal} />
      <main className="flex-grow">
        <HeroSection onOpenModal={handleOpenModal} />
        <ProjectsSection />
        <ProcessSection />
        <ContactSection onSuccess={handleSuccess} />
      </main>
      <Footer />
      <LeadModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}
