import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import ScatteredSection from "../components/landing/ScatteredSection";
import CentralizeSection from "../components/landing/CentralizeSection";
import ManageSection from "../components/landing/ManageSection";
import SyncSection from "../components/landing/SyncSection";
import PipelineSection from "../components/landing/PipelineSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/landing/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />
      <Hero />
      <ScatteredSection />
      <CentralizeSection />
      <ManageSection />
      <SyncSection />
      <PipelineSection />
      <CTASection />
      <Footer />
    </div>
  );
}

export default HomePage;
