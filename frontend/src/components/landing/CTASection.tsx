import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

export default function CTASection() {
  return (
    <section className="relative bg-white dark:bg-black py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-6">
            Ready to centralize and sync?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-black/70 dark:text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of teams that trust Curo for secure, consistent environment variable management.
          </p>
          <Button variant="outline" href="/register" size="md" className="rounded-full border-accent !bg-[#FF3333] !text-white !py-3 !px-8 hover:!bg-white hover:!text-[#FF3333]">
            Get Started for Free
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
