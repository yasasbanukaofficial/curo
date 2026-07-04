import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DotsLine from "./DotsLine";
import Corner from "./Corner";
import StaggerContainer, { scaleFadeIn } from "../animations/StaggerContainer";
import { SiGithub, SiRailway, SiVercel } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import VaultLock from "./VaultLock";
import { useReducedMotion } from "../../hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function PipelineSection() {
  const pipelineRef = useRef<HTMLDivElement>(null);
  const arrowsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const flowDotsRef = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useGSAP(() => {
      if (reduced) return;
    const el = pipelineRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const nodes = el.querySelectorAll(".pipeline-node-wrapper");
      const arrows = arrowsRef.current.filter(Boolean) as HTMLSpanElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });

      tl.fromTo(nodes, { opacity: 0, y: 15, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" });

      if (arrows.length > 0) {
        tl.fromTo(arrows, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.25, stagger: 0.1, ease: "power2.out" }, "-=0.2");
      }

      flowDotsRef.current.forEach((dot) => {
        if (!dot) return;
        tl.fromTo(
          dot,
          { x: "-100%", opacity: 1 },
          { x: "100%", opacity: 1, duration: 0.5, ease: "power1.inOut" },
          `-=0.1`
        );
        tl.to(dot, { opacity: 0, duration: 0.15 }, "+=0.1");
      });
    }, pipelineRef);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="deploy" className="relative bg-[#fcfcfc] scroll-mt-24">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <Corner />
        <StaggerContainer className="flex flex-col items-center text-center">
          <motion.div variants={scaleFadeIn()} className="max-w-lg mb-12">
            <div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-3">Deploy</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-4">
              Sync everywhere<br />you deploy.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
              Connect Curo to your entire deployment pipeline. Push secrets from your vault to every platform automatically.
            </p>
          </motion.div>
          <motion.div ref={pipelineRef} variants={scaleFadeIn()} className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="pipeline-node-wrapper flex flex-col items-center gap-2">
              <SiGithub className="w-10 h-10 text-[#1D1D1F]" />
              <span className="text-xs text-[#6E6E73] font-sans">GitHub</span>
            </div>
            <span ref={(el) => { arrowsRef.current[0] = el; }} className="text-[#1D1D1F] text-2xl relative overflow-hidden">
              →
              <div ref={(el) => { flowDotsRef.current[0] = el; }} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#64D2FF]" />
              </div>
            </span>
            <div className="pipeline-node-wrapper flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-[#1D1D1F] rounded-xl flex items-center justify-center">
                <VaultLock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-[#1D1D1F] font-sans font-medium">Curo</span>
            </div>
            <span ref={(el) => { arrowsRef.current[1] = el; }} className="text-[#1D1D1F] text-2xl relative overflow-hidden">
              →
              <div ref={(el) => { flowDotsRef.current[1] = el; }} className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
              </div>
            </span>
            <div className="pipeline-node-wrapper flex flex-col items-center gap-2">
              <SiRailway className="w-10 h-10 text-[#0B0D0E]" />
              <span className="text-xs text-[#6E6E73] font-sans">Railway</span>
            </div>
            <div className="pipeline-node-wrapper flex flex-col items-center gap-2">
              <FaAws className="w-10 h-10 text-[#FF9900]" />
              <span className="text-xs text-[#6E6E73] font-sans">AWS</span>
            </div>
            <div className="pipeline-node-wrapper flex flex-col items-center gap-2">
              <SiVercel className="w-10 h-10 text-[#000000]" />
              <span className="text-xs text-[#6E6E73] font-sans">Vercel</span>
            </div>
          </motion.div>
        </StaggerContainer>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
