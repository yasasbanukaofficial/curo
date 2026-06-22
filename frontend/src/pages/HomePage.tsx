import Navbar from "../components/landing/Navbar";
import ApplePromoStage from "../components/landing/ApplePromoStage";
import Footer from "../components/landing/Footer";
import SmoothScroll from "../components/SmoothScroll";

function HomePage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#fcfcfc] pt-24">
        <Navbar />
        <ApplePromoStage />
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default HomePage;
