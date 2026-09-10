import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProjectsSection from "@/components/ProjectsSection";
import ProcessSection from "@/components/ProcessSection";
import LeadFormSection from "@/components/LeadFormSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ProjectsSection />
      <ProcessSection />
      <LeadFormSection />
      <Footer />
    </main>
  );
}
