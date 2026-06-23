import { motion } from "framer-motion";
import DotsLine from "./DotsLine";
import Corner from "./Corner";
import { Button } from "../ui/Button";
import { PiArrowUpRight } from "react-icons/pi";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export default function Hero() {
  return (
    <section className="relative bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <Corner />
        <motion.div
          className="text-center max-w-4xl mx-auto pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-6xl font-normal tracking-tight text-[#1D1D1F] font-sans leading-[1.05] mb-6">
            Secrets aren't meant to be shared.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-lg text-[#6E6E73] leading-relaxed mb-10 max-w-2xl mx-auto">
            Curo securely stores, manages, and syncs environment variables across your projects, teams, and environments.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button variant="secondary" href="#deploy">
              Get Started
            </Button>
            <Button variant="outline" href="#secrets">
              See examples
              <PiArrowUpRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
