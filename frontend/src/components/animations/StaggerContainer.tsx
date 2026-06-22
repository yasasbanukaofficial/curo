import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
  className?: string;
  margin?: string;
}

export default function StaggerContainer({
  children,
  staggerDelay = 0.1,
  className,
  margin = "-80px",
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const fadeInUp = (yOffset = 30, duration = 0.5) => ({
  hidden: { opacity: 0, y: yOffset },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration, ease: [0.25, 0.1, 0.25, 1] as const },
  },
});
