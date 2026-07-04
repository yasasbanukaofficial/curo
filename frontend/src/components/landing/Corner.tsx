import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const cornerDraw = {
  hidden: { opacity: 0, scaleX: 0, scaleY: 0 },
  visible: {
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function Corner({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={`absolute inset-0 pointer-events-none flex flex-col justify-between ${className}`}>
        <div className="flex justify-between">
          <div className="h-3 w-3 border-t-2 border-l-2 border-[#191919]" />
          <div className="h-3 w-3 border-t-2 border-r-2 border-[#191919]" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-3 border-b-2 border-l-2 border-[#191919]" />
          <div className="h-3 w-3 border-b-2 border-r-2 border-[#191919]" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`absolute inset-0 pointer-events-none flex flex-col justify-between ${className}`}
    >
      <div className="flex justify-between">
        <motion.div variants={cornerDraw} custom={0} className="h-3 w-3 border-t-2 border-l-2 border-[#191919] origin-top-left" />
        <motion.div variants={cornerDraw} custom={1} className="h-3 w-3 border-t-2 border-r-2 border-[#191919] origin-top-right" />
      </div>
      <div className="flex justify-between">
        <motion.div variants={cornerDraw} custom={2} className="h-3 w-3 border-b-2 border-l-2 border-[#191919] origin-bottom-left" />
        <motion.div variants={cornerDraw} custom={3} className="h-3 w-3 border-b-2 border-r-2 border-[#191919] origin-bottom-right" />
      </div>
    </motion.div>
  );
}
