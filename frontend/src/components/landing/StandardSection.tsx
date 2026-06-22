import { motion } from "framer-motion";
import SectionShell from "./SectionShell";
import SectionHeading from "./SectionHeading";
import MediaFrame from "./MediaFrame";
import StaggerContainer, { fadeInUp } from "../animations/StaggerContainer";

const steps = [
  {
    number: "01",
    title: "Connect company knowledge",
    description: "Upload your .env files, project configs, and secrets. Curo understands your environment structure.",
    image: "https://framerusercontent.com/images/SMhyQZ0ZUQl7exxlOZUZtihso.png?width=600"
  },
  {
    number: "02",
    title: "Build the secrets model",
    description: "Curo organizes variables, detects conflicts, and versions your entire secrets graph.",
    image: "https://framerusercontent.com/images/D1sdpjEClZUX7BPy9gZnYNVh2SU.png?width=600"
  },
  {
    number: "03",
    title: "Generate consistent output",
    description: "Every new deployment uses the same secure environment configuration automatically.",
    image: "https://framerusercontent.com/images/cV3Qv3v8NRCeTWzbPZaisvTxQ.png?width=600"
  }
];

export default function StandardSection() {
  return (
    <SectionShell id="centralized">
      <SectionHeading
        heading="How your secrets become a shared standard"
        subtitle="Connect your secrets once. Every environment stays in sync automatically."
      />

      <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp(30, 0.5)}
            className="rounded-2xl border border-[#ededed] bg-white p-6 overflow-hidden"
          >
            <MediaFrame rounded="rounded-lg" shadow="">
              <img
                src={step.image}
                alt={step.title}
                className="w-full h-auto object-cover"
              />
            </MediaFrame>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-[#ddd]" />
              <span className="text-xs font-semibold text-[#636363] tracking-wider">Step {step.number}</span>
              <div className="h-px flex-1 bg-[#ddd]" />
            </div>
            <h3 className="text-lg font-bold text-[#191919] font-display mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
