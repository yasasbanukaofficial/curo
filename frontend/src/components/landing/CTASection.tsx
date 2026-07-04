import { motion } from "framer-motion";
import DotsLine from "./DotsLine";
import Corner from "./Corner";
import { Button } from "../ui/Button";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

export default function CTASection() {
  return (
    <section className="relative bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <Corner />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-6">
            Ready to centralize and sync?
          </h2>
          <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of teams that trust Curo for secure, consistent environment variable management.
          </p>
          <Button variant="secondary" href="/register" size="md" className="px-8 py-4 text-lg shadow-lg rounded-[5px]">
            Get Started for Free
          </Button>
        </motion.div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
