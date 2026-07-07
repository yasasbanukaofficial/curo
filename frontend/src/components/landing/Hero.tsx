import { motion } from "framer-motion";
import { useEffect } from "react";
import { Button } from "../ui/Button";
import { PiArrowUpRight } from "react-icons/pi";
import PixelBlast from "../animations/PixelBlast";

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
  useEffect(() => {
    const timer = setTimeout(() => {
      document.getElementById("heroHeading")?.classList.add("done");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-8 lg:py-12">
      <div className="absolute inset-0">
        <PixelBlast
          variant="square"
          pixelSize={4}
          color="#FF3333"
          patternScale={2}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          edgeFade={0.25}
          centerFade={0.25}
          speed={0.5}
        />
      </div>
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 min-h-[600px] relative overflow-hidden pointer-events-none">
        <motion.div
          className="text-left max-w-6xl pb-16 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="hero-aura-wrapper pointer-events-auto">
            <div className="hero-aura" />
            <motion.h1
              variants={itemVariants}
              className="hero-heading text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black dark:text-white font-sans leading-[1.15] mb-6"
              id="heroHeading"
            >
              <span className="word">Secrets</span>{' '}
              <span className="word">aren't</span>{' '}
              <span className="word">m<span className="text-accent">e</span>a<span className="text-accent">n</span>t</span>{' '}
              <span className="word">to</span>{' '}
              <span className="word">be</span>{' '}
              <span className="word">re<span className="text-accent">v</span>ealed</span>{' '}
              <span className="word">or</span>
              <br />
              <span className="word word-shared">
                shared.
                <motion.svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ overflow: 'visible' }}
                >
                  <motion.path
                    d="M -5,-5 L 105,105"
                    stroke="#FF3333"
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.5, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M 105,-5 L -5,105"
                    stroke="#FF3333"
                    strokeWidth={3}
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.8, ease: "easeInOut" }}
                  />
                </motion.svg>
              </span>
            </motion.h1>
          </div>
          <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-10 max-w-2xl pointer-events-auto">
            Curo securely stores, manages, and syncs environment variables across your projects, teams, and environments.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-start items-center gap-4 pointer-events-auto">
            <Button variant="outline" href="/register" className="rounded-full border-accent !bg-[#FF3333] !text-white !py-2.5 !px-6 hover:!bg-white hover:!text-[#FF3333]">
              Get Started
              <PiArrowUpRight className="h-4 w-4" />
            </Button>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
