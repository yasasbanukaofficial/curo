import { motion } from "framer-motion";
import SectionShell from "./SectionShell";
import SectionHeading from "./SectionHeading";
import MediaFrame from "./MediaFrame";
import StaggerContainer, { fadeInUp } from "../animations/StaggerContainer";
import { ChevronRightIcon } from "./ChevronRightIcon";

const cards = [
  {
    title: "Turn scattered secrets into a structured vault",
    description: "Upload .env files, API keys, and configuration variables to build a centralized secrets system.",
    image: "https://framerusercontent.com/images/MX3HNqrEJ01i4kqgdVnDkeXOVI.png?width=800",
    reverse: false
  },
  {
    title: "Enforce consistency, access control, and structure automatically",
    description: "Curo syncs your secrets in real time, detects configuration drift, and ensures approved variables are used across every environment.",
    image: "https://framerusercontent.com/images/LVggzU8ChBFPgvtXEilJdK23PY.png?width=800",
    reverse: true
  },
  {
    title: "Generate aligned configs across every environment",
    description: "Deploy consistent environment variables to development, staging, and production automatically.",
    image: "https://framerusercontent.com/images/wiPH8LAYQR3ffg2hsJKuBoFS9wY.png?width=800",
    reverse: false
  }
];

export default function FeatureSection() {
  return (
    <SectionShell id="features">
      <SectionHeading
        heading="Turn scattered secrets into a controlled system"
        subtitle="Curo converts your environment configuration into a secure, version-controlled system that scales with your team."
      />

      <StaggerContainer staggerDelay={0.15} className="space-y-12 lg:space-y-16">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp(40, 0.6)}
            className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 rounded-2xl border border-[#ededed] p-6 lg:p-10 ${
              card.reverse ? "lg:flex-row-reverse" : ""
            }`}
          >
            <div className="w-full lg:w-1/2">
              <div className="max-w-md">
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919] font-display mb-4 leading-snug">
                  {card.title}
                </h3>
                <p className="text-base text-[#737373] leading-relaxed mb-6">
                  {card.description}
                </p>
                <a
                  href="#pricing"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[#191919]"
                >
                  See examples
                  <ChevronRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <MediaFrame>
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-auto object-cover"
                />
              </MediaFrame>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
