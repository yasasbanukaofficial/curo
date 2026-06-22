import { motion } from "framer-motion";
import SectionShell from "./SectionShell";
import SectionHeading from "./SectionHeading";
import StaggerContainer, { fadeInUp } from "./StaggerContainer";
import Card from "./Card";
import MediaFrame from "./MediaFrame";

const features = [
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="10" />
        <path d="m14.3 8.25-4.95 6.05-2.2-2.2" />
      </svg>
    ),
    title: "Brand Voice Enforcement",
    description: "Ensure every message follows your tone guidelines.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19.07 9.06V3.52c0-1.22-.99-2.21-2.21-2.21H3.04c-1.22 0-2.21.99-2.21 2.21v13.85c0 1.22.99 2.21 2.21 2.21h5.53" />
        <path d="M9.92 11.1 12.37 20.23c.06.22.24.38.46.41.22.03.44-.08.55-.27l2.3-3.98c.05-.08.12-.15.2-.2l3.97-2.3c.2-.12.3-.34.27-.56a.54.54 0 0 0-.4-.46l-9.12-2.45a.51.51 0 0 0-.63.6z" />
      </svg>
    ),
    title: "Terminology Control",
    description: "Standardize product names and approved vocabulary.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="0.92" y="0.92" width="5.5" height="5.5" rx="1" />
        <rect x="15.58" y="0.92" width="5.5" height="5.5" rx="1" />
        <rect x="0.92" y="15.58" width="5.5" height="5.5" rx="1" />
        <rect x="15.58" y="15.58" width="5.5" height="5.5" rx="1" />
        <path d="M15.58 3.67H6.42M3.67 6.42v9.16M6.11 18.33h9.47M18.33 15.58V6.42M11 8.25v5.5M13.75 11h-5.5" />
      </svg>
    ),
    title: "Cross-Team Consistency",
    description: "Align marketing, product, and support writing automatically.",
  },
  {
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6.37 8.1v6.37M12.16 1.16v13.31M17.95 10.42v4.05M.87.87v16.79c0 1.28 1.04 2.32 2.32 2.32h17.94" />
      </svg>
    ),
    title: "Real-Time Writing Validation",
    description: "Detect tone, style, and terminology issues instantly.",
  },
];

export default function WorkSection() {
  return (
    <SectionShell id="problem">
      <SectionHeading
        heading="The problem with legacy secrets workflows"
        subtitle="Secrets management wasn't built for shared standards. Every team manages variables differently — and it slows everything down."
        align="left"
        maxWidth="max-w-3xl"
        marginBottom="mb-16"
      />

      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={fadeInUp(30, 0.5)}>
          <Card bg="bg-[#f4f4f4]" padding="p-8" className="flex flex-col h-full">
            <h5 className="text-xl font-bold text-[#191919] font-display mb-3">
              Scattered secrets systems
            </h5>
            <p className="text-sm text-[#737373] leading-relaxed mb-6">
              Brand guidelines live in PDFs. Terminology lives in Notion. Tone lives in someone&apos;s head. Nothing is connected.
            </p>
            <div className="mt-auto">
              <MediaFrame rounded="rounded-xl" shadow="">
                <img
                  src="https://framerusercontent.com/images/kX9exbiMjOzIlAaMAdCEqqJ2zA.png"
                  alt="Scattered secrets"
                  className="w-full h-auto object-cover"
                />
              </MediaFrame>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp(30, 0.5)}>
          <Card padding="p-8" className="shadow-sm flex flex-col h-full">
            <h5 className="text-xl font-bold text-[#191919] font-display mb-3">
              One intelligent secrets layer
            </h5>
            <p className="text-sm text-[#737373] leading-relaxed mb-8">
              Curo connects your projects, environments, and secrets into a unified management platform.
            </p>
            <div className="mt-auto">
              <MediaFrame rounded="rounded-xl" shadow="">
                <img
                  src="https://framerusercontent.com/images/anMMQzkHSmqfIRUTfD5PJN9VDg.png"
                  alt="One intelligent secrets layer"
                  className="w-full h-auto object-cover"
                />
              </MediaFrame>
            </div>
          </Card>
        </motion.div>
      </StaggerContainer>

      <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        {features.map((feat, idx) => (
          <motion.div key={idx} variants={fadeInUp(20, 0.4)}>
            <Card padding="p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#191919] shrink-0">
                  {feat.icon}
                </span>
                <h4 className="text-sm font-semibold text-[#191919]">{feat.title}</h4>
              </div>
              <p className="text-xs text-[#737373] leading-relaxed">{feat.description}</p>
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
