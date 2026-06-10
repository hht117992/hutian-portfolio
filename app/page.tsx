import About from "../components/About";
import AnimatedBackground from "../components/AnimatedBackground";
import Certifications from "../components/Certifications";
import Contact from "../components/Contact";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
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
        <div className="page-shell">
          <About />
          <Education />
          <ResearchProjects />
          <Experience />
          <Skills />
          <Certifications />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  );
}
