import { motion } from "framer-motion";
import StaggerContainer, { scaleFadeIn } from "../animations/StaggerContainer";
import { HiOutlineDocumentText } from "react-icons/hi";
import { SiGithub } from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ParallaxDrift from "./ParallaxDrift";

const sources = [
  {
    icon: HiOutlineDocumentText,
    label: ".env.local",
    desc: "DATABASE_URL=postgres://...",
    status: "exposed",
    rotate: -3,
    y: 0,
  },
  {
    icon: SiGithub,
    label: "GitHub Secrets",
    desc: "18 variables",
    status: "unsynced",
    rotate: 1,
    y: 8,
  },
  {
    icon: FaAws,
    label: "AWS Secrets",
    desc: "Scattered across 3 regions",
    status: "unsynced",
    rotate: 3,
    y: -4,
  },
];

export default function ScatteredSection() {
  const reduced = useReducedMotion();

  return (
    <section id="secrets" className="relative bg-white dark:bg-black scroll-mt-24 py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg">
            <div className="text-accent text-xs uppercase font-bold tracking-widest mb-3">The problem</div>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-4">
              Secrets are<br />everywhere.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-black/70 dark:text-white/70 leading-relaxed">
              Environment variables scattered across local files, CI/CD providers, and cloud platforms. No single source of truth, no visibility, no control.
            </p>
          </motion.div>
          <ParallaxDrift drift={3} className="flex-1 max-w-lg">
          <motion.div variants={scaleFadeIn()} className="flex flex-wrap justify-center gap-5">
            {sources.map((source, i) => (
              <motion.div
                key={i}
                className="bg-[#F5F5F7] dark:bg-[#1C1C1E] p-5 rounded-[20px] w-[220px] shadow-[0_2px_20px_rgba(0,0,0,0.06)] border border-[#E5E5EA] dark:border-[#333] relative cursor-default"
                initial={reduced ? { opacity: 0, y: 20 } : { opacity: 0, y: 20, scale: 0.96, rotate: 0 }}
                whileInView={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: source.y, scale: 1, rotate: source.rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={reduced ? {} : { rotate: 0, y: -4, scale: 1.02, boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#0A0A0A] shadow-sm flex items-center justify-center">
                    <source.icon className="w-4 h-4 text-[#1D1D1F] dark:text-[#E5E5E5]" />
                  </div>
                  <span className="text-[#1D1D1F] dark:text-[#E5E5E5] font-medium text-sm">{source.label}</span>
                </div>
                <div className="text-[10px] leading-relaxed bg-white/60 rounded-md px-2 py-1.5 font-mono text-[#6E6E73] dark:text-[#9A9A9A] inline-block">
                  {source.desc}
                </div>
                <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-accent/10 text-accent">
                  {source.status}
                </div>
              </motion.div>
            ))}
          </motion.div>
          </ParallaxDrift>
        </StaggerContainer>
      </div>
    </section>
  );
}
