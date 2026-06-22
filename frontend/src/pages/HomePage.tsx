import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import SocialProof from "../components/landing/SocialProof";
import ProblemSolution from "../components/landing/ProblemSolution";
import BentoWalkthrough from "../components/landing/BentoWalkthrough";
import FeatureGrid from "../components/landing/FeatureGrid";
import ProcessWalkthrough from "../components/landing/ProcessWalkthrough";
import Integrations from "../components/landing/Integrations";
import Pricing from "../components/landing/Pricing";
import BottomCTA from "../components/landing/BottomCTA";
import Footer from "../components/landing/Footer";

function HomePage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc]">
      <Navbar />
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <BentoWalkthrough />
      <FeatureGrid />
      <ProcessWalkthrough />
      <Integrations />
      <Pricing />
      <BottomCTA />
      <Footer />
    </div>
  );
}

export default HomePage;
