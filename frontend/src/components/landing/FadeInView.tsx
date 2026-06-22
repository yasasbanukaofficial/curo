import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInViewProps {
  children: ReactNode;
  y?: number;
  duration?: number;
  delay?: number;
  className?: string;
  as?: "div" | "section";
}

export default function FadeInView({
  children,
  y = 40,
  duration = 0.6,
  delay = 0,
  className,
  as = "div",
}: FadeInViewProps) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
