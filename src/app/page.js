import AboutSection from "./components/AboutSection";
import CallToAction from "./components/CallToAction";
import Features from "./components/Features";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import NavbarPublic from "./components/NavbarPublic";

export default function Home() {
  return (
    <>
      <NavbarPublic />
      <HeroSection />
      <AboutSection />
      <Features />
      <CallToAction />
      <Footer />
    </>
  );
}
