import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import WorkSection from "../components/landing/WorkSection";
import FeatureSection from "../components/landing/FeatureSection";
import CoreSection from "../components/landing/CoreSection";
import StandardSection from "../components/landing/StandardSection";
import IntegrationSection from "../components/landing/IntegrationSection";
import Pricing from "../components/landing/Pricing";
import BottomCTA from "../components/landing/BottomCTA";
import Footer from "../components/landing/Footer";
import SmoothScroll from "../components/SmoothScroll";

function HomePage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#fcfcfc] pt-24">
        <Navbar />
        <Hero />
        <WorkSection />
        <FeatureSection />
        <CoreSection />
        <StandardSection />
        <IntegrationSection />
        <Pricing />
        <BottomCTA />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default HomePage;
