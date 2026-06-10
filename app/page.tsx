import About from "../components/About";
import AnimatedBackground from "../components/AnimatedBackground";
import AnimatedDivider from "../components/AnimatedDivider";
import CFDMeshDemo from "../components/CFDMeshDemo";
import Certifications from "../components/Certifications";
import Contact from "../components/Contact";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import HeatTransferCalculator from "../components/HeatTransferCalculator";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import ResearchProjects from "../components/ResearchProjects";
import Skills from "../components/Skills";

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <AnimatedDivider label="Flow / Heat Transfer" />
        <div className="page-shell">
          <About />
          <Education />
          <AnimatedDivider label="Research Focus" />
          <ResearchProjects />
          <CFDMeshDemo />
          <AnimatedDivider label="Heat Transfer Data" />
          <HeatTransferCalculator />
          <AnimatedDivider label="Engineering Practice" />
          <Experience />
          <Skills />
          <AnimatedDivider label="Contact" />
          <Certifications />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
