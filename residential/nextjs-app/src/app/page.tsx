"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProcessSection from "@/components/ProcessSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ConsultationModal from "@/components/ConsultationModal";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Navbar onOpenModal={() => setModalOpen(true)} />
      <main className="flex-1">
        <HeroSection onOpenModal={() => setModalOpen(true)} />
        <ProjectsSection onOpenModal={() => setModalOpen(true)} />
        <ProcessSection onOpenModal={() => setModalOpen(true)} />
        <ContactSection onOpenModal={() => setModalOpen(true)} />
      </main>
      <Footer />
      <ConsultationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
