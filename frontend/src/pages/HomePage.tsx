import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import AnimationSection from "../components/animations/AnimationSection";
import Footer from "../components/landing/Footer";
import SmoothScroll from "../components/animations/SmoothScroll";

function HomePage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#fcfcfc] pt-24">
        <Navbar />
        <Hero />
        <AnimationSection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default HomePage;
