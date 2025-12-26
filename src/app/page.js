import AboutSection from "./components/AboutSection";
import ComuneroConsulta from "./components/consultas";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import MeetingsSection from "./components/MeetingsSection";
import NavbarPublic from "./components/NavbarPublic";

export default function Home() {
  return (
    <>
      <NavbarPublic />
      <HeroSection />
      <AboutSection />
      <MeetingsSection/>
      <ComuneroConsulta/>
      <Footer />
    </>
  );
}
