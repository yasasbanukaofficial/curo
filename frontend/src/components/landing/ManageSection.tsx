import { motion } from "framer-motion";
import Corner from "./Corner";
import StaggerContainer, { scaleFadeIn } from "../animations/StaggerContainer";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ParallaxDrift from "./ParallaxDrift";

const secrets = [
  { key: "DATABASE_URL", value: "***", masked: true },
  { key: "API_KEY", value: "***", masked: true },
  { key: "JWT_SECRET", value: "***", masked: true },
];

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: 0.06 * i, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export default function ManageSection() {
  const reduced = useReducedMotion();

  return (
    <section id="manage" className="relative bg-[#fcfcfc] dark:bg-black scroll-mt-24 py-8 lg:py-12">
      <div className="border-x border-[#efefef] dark:border-[#222] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <Corner />
        <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg">
            <div className="text-[#1D1D1F] dark:text-[#E5E5E5] text-xs uppercase font-bold tracking-widest mb-3">Manage</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] dark:text-[#E5E5E5] leading-[1.1] mb-4">
              Manage every<br />environment.
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] dark:text-[#9A9A9A] leading-relaxed">
              Organize secrets across production, staging, and development. Tag, version, and control access with granular permissions.
            </p>
          </motion.div>
          <ParallaxDrift drift={3} className="flex-1 max-w-lg w-full">
          <motion.div variants={scaleFadeIn()}>
            <div className="bg-white dark:bg-[#0A0A0A] w-full rounded-[16px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-[#E5E5EA] dark:border-[#333] overflow-hidden">
              <div className="bg-[#F5F5F7] dark:bg-[#1C1C1E] px-6 py-4 border-b border-[#E5E5EA] dark:border-[#333] flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">Secrets</div>
                <motion.div className="flex gap-1" whileHover={reduced ? {} : { scale: 1.02 }}>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#1D1D1F] text-white">Production</span>
                </motion.div>
              </div>
              <div className="p-6 space-y-4 font-mono text-sm">
                {secrets.map((secret, i) => (
                  <motion.div
                    key={i}
                    className="flex justify-between items-center"
                    custom={i}
                    variants={reduced ? undefined : rowVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs text-[#1D1D1F] dark:text-[#E5E5E5] font-medium">{secret.key}</span>
                      <motion.span
                        className="text-[10px] text-[#6E6E73] dark:text-[#9A9A9A] mt-0.5"
                        whileHover={reduced ? {} : { color: "#1D1D1F", transition: { duration: 0.2 } }}
                      >
                        {secret.value}
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2">
                      {["production", "v23", "encrypted"].map((badge, j) => (
                        <motion.span
                          key={j}
                          className="px-2 py-0.5 bg-[#F5F5F7] dark:bg-[#1C1C1E] rounded text-[10px] text-[#6E6E73] dark:text-[#9A9A9A] font-sans font-medium cursor-default"
                          whileHover={reduced ? {} : { backgroundColor: "#E5E5EA", transition: { duration: 0.15 } }}
                        >
                          {badge}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          </ParallaxDrift>
        </StaggerContainer>
      </div>
    </section>
  );
}
