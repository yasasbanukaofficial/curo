import DotsLine from "./DotsLine";
import Corner from "./Corner";
import { Button } from "../ui/Button";
import { PiArrowUpRight } from "react-icons/pi";


export default function Hero() {
  return (
    <section className="relative bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <Corner />
        <div className="text-center max-w-4xl mx-auto pb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-normal tracking-tight text-[#1D1D1F] font-sans leading-[1.05] mb-6">
            Secrets aren't meant to be shared.
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[#6E6E73] leading-relaxed mb-10 max-w-2xl mx-auto">
            Curo securely stores, manages, and syncs environment variables across your projects, teams, and environments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button variant="secondary" href="#pricing">
              Get Started
            </Button>
            <Button variant="outline" href="#features">
              See examples
              <PiArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
