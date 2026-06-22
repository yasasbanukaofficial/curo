import StaggerContainer, { fadeInUp } from "./StaggerContainer";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  heading: string;
  subtitle?: string;
  as?: "h1" | "h2" | "h3";
  maxWidth?: string;
  marginBottom?: string;
  align?: "center" | "left";
}

export default function SectionHeading({
  heading,
  subtitle,
  as: Tag = "h2",
  maxWidth = "max-w-3xl",
  marginBottom = "mb-16 lg:mb-20",
  align = "center",
}: SectionHeadingProps) {
  const headingSize =
    Tag === "h1"
      ? "text-4xl sm:text-5xl lg:text-6xl"
      : "text-3xl sm:text-4xl";

  const alignment =
    align === "left"
      ? "text-left"
      : "text-center mx-auto";

  return (
    <StaggerContainer className={`${alignment} ${align === "left" ? "" : maxWidth} ${marginBottom}`}>
      <motion.div variants={fadeInUp(20, 0.5)}>
        <Tag
          className={`${headingSize} font-bold tracking-tight text-[#191919] font-display mb-4`}
        >
          {heading}
        </Tag>
      </motion.div>
      {subtitle && (
        <motion.div variants={fadeInUp(20, 0.5)}>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>
      )}
    </StaggerContainer>
  );
}
