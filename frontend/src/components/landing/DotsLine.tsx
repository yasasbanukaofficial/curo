import { motion } from "framer-motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export default function DotsLine({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <motion.svg
        viewBox="0 0 1224 40"
        preserveAspectRatio="none"
        className="w-full h-full text-[#ddd] dark:text-[#333]"
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <line
          x1="0"
          y1="20"
          x2="1224"
          y2="20"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 12"
        />
      </motion.svg>
    </div>
  );
}
