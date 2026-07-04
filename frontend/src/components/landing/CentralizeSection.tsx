import { motion } from "framer-motion";
import DotsLine from "./DotsLine";
import Corner from "./Corner";
import StaggerContainer, { scaleFadeIn } from "../animations/StaggerContainer";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import VaultLock from "./VaultLock";
import ParallaxDrift from "./ParallaxDrift";

const dots = [
  { color: "#64D2FF", label: "local" },
  { color: "#1D1D1F", label: "ci/cd" },
  { color: "#FF9900", label: "cloud" },
];

export default function CentralizeSection() {
  const reduced = useReducedMotion();

  const vaultCard = (
    <div className="bg-[#1D1D1F] rounded-2xl p-5 border border-[#2C2C2E] shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#2C2C2E]">
        <VaultLock className="w-4 h-4 text-[#8E8E93]" />
        <span className="text-[#8E8E93] text-xs font-medium uppercase tracking-wider">Vault</span>
      </div>
      {["DATABASE_URL", "API_KEY", "JWT_SECRET"].map((key, i) => (
        <div key={i} className="flex justify-between items-center py-2.5 border-b border-[#2C2C2E] last:border-b-0 last:pb-0 first:pt-0">
          <span className="text-[#E5E5EA] text-xs font-mono">{key}</span>
          <span className="text-[#6E6E73] text-xs font-mono tracking-wider">••••••••••••</span>
        </div>
      ))}
    </div>
  );

  const textColumn = (
    <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg order-1 lg:order-2">
      <div className="text-[#1D1D1F] text-xs uppercase font-bold tracking-widest mb-3">Centralize</div>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-4">
        One source<br />of truth.
      </h2>
      <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed">
        Bring all your environment variables into a single, encrypted vault. Curo gives you a centralized hub where every secret is stored securely, versioned, and accessible on demand.
      </p>
    </motion.div>
  );

  if (reduced) {
    return (
      <section id="centralize" className="relative bg-[#fcfcfc] scroll-mt-24">
        <DotsLine className="h-10" />
        <div className="border-x border-[#efefef] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
          <Corner />
          <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <ParallaxDrift drift={3} className="flex-1 max-w-lg order-2 lg:order-1 flex justify-center">
            <div className="flex flex-col items-center w-full max-w-sm">
                {vaultCard}
                <h3 className="text-2xl md:text-3xl font-medium text-[#1D1D1F] tracking-tight mt-6">CURO</h3>
                <p className="text-sm text-[#6E6E73] mt-2">Secure Environment Variable Management</p>
              </div>
            </ParallaxDrift>
            {textColumn}
          </StaggerContainer>
        </div>
        <DotsLine className="h-10" />
      </section>
    );
  }

  return (
    <section id="centralize" className="relative bg-[#fcfcfc] scroll-mt-24">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <Corner />
        <StaggerContainer className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <motion.div variants={scaleFadeIn()} className="flex-1 max-w-lg order-2 lg:order-1 flex justify-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col items-center w-full max-w-sm"
            >
              <div className="relative w-full flex items-center justify-center h-48">
                {dots.map((dot, i) => {
                  const positions = [
                    { x: -100, y: -40 },
                    { x: 0, y: -70 },
                    { x: 100, y: -20 },
                  ];
                  const pos = positions[i];
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 rounded-full"
                      style={{ backgroundColor: dot.color }}
                      variants={{
                        hidden: { x: pos.x, y: pos.y, opacity: 1, scale: 1 },
                        visible: { x: 0, y: 0, opacity: 0, scale: 0, transition: { duration: 0.6, delay: 0.15 * i, ease: [0.25, 0.1, 0.25, 1] } },
                      }}
                    />
                  );
                })}
                <motion.div
                  className="w-full"
                  variants={{
                    hidden: { opacity: 0, scale: 0.92, y: 10 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
                  }}
                >
                  {vaultCard}
                </motion.div>
              </div>
              <motion.h3
                className="text-2xl md:text-3xl font-medium text-[#1D1D1F] tracking-tight mt-6"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
                }}
              >
                CURO
              </motion.h3>
              <motion.p
                className="text-sm text-[#6E6E73] mt-2"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.35, delay: 0.8 } },
                }}
              >
                Secure Environment Variable Management
              </motion.p>
            </motion.div>
          </motion.div>
          {textColumn}
        </StaggerContainer>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
