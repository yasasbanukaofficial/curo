import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import BrandSection from "../components/landing/BrandSection";
import WorkSection from "../components/landing/WorkSection";
import FeatureSection from "../components/landing/FeatureSection";
import CoreSection from "../components/landing/CoreSection";
import StandardSection from "../components/landing/StandardSection";
import IntegrationSection from "../components/landing/IntegrationSection";
import Pricing from "../components/landing/Pricing";
import BottomCTA from "../components/landing/BottomCTA";
import Footer from "../components/landing/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <Hero />
      <BrandSection />
      <WorkSection />
      <FeatureSection />
      <CoreSection />
      <StandardSection />
      <IntegrationSection />
      <Pricing />
      <BottomCTA />
      <Footer />
    </div>
  );
}

export default HomePage;
