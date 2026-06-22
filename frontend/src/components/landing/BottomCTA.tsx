import DotsLine from "./DotsLine";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import { ChevronRightIcon } from "../ui/Icons";
import StaggerContainer, { fadeInUp } from "./StaggerContainer";
import { motion } from "framer-motion";

export default function BottomCTA() {
  return (
    <section className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <StaggerContainer className="border-x border-b border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center" margin="-100px">
        <motion.h2 variants={fadeInUp(30, 0.6)} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#191919] font-display leading-[1.1] mb-6">
          Standardize how your team manages secrets
        </motion.h2>
        <motion.p variants={fadeInUp(30, 0.6)} className="text-base sm:text-lg text-[#737373] leading-relaxed mb-10 max-w-2xl mx-auto">
          Join teams that use Curo to keep secrets secure, environments consistent, and deployments reliable across every project.
        </motion.p>
        <motion.div variants={fadeInUp(30, 0.6)} className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <ButtonPrimary href="#pricing" size="lg">
            Start free trial
          </ButtonPrimary>
          <ButtonSecondary href="#" size="lg">
            Talk to sales
            <ChevronRightIcon />
          </ButtonSecondary>
        </motion.div>
      </StaggerContainer>
    </section>
  );
}
