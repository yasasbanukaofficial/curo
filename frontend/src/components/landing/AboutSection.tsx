import { motion } from "framer-motion";
import bgImage from "../../assets/images/bg-image.png";
import dashboardLight from "../../assets/images/dashboard-light-curo.png";
import dashboardDark from "../../assets/images/dashboard-dark-curo.png";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

export default function AboutSection() {
  return (
    <section className="relative bg-white dark:bg-black py-8 lg:py-12">
      <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-2"
        >
          <p className="text-2xl sm:text-3xl xl:text-4xl tracking-tight leading-snug font-light text-black dark:text-white col-span-full">
            Curo is a <span className="text-accent font-medium">centralized secrets management</span> platform for{' '}
            <span className="text-accent font-medium">teams</span> and{' '}
            <span className="text-accent font-medium">developers</span>.
            Bringing powerful features for your environment variable workflows, with high security and simplicity to fit your preferences — works seamlessly with any CI/CD, framework, or cloud provider.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
          className="mt-16"
        >
          <div className="relative w-full min-h-[400px] h-[55vh] max-h-[700px] rounded-2xl border border-[#E5E5EA] dark:border-[#333] overflow-hidden mx-auto">
            <img
              src={bgImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <img
              src={dashboardLight}
              alt="Curo dashboard preview"
              className="absolute top-[320px] left-[12%] max-w-[1350px] w-full rounded-xl lg:top-[260px] pointer-events-none block dark:hidden"
            />
            <img
              src={dashboardDark}
              alt="Curo dashboard preview"
              className="absolute top-[320px] left-[12%] max-w-[1350px] w-full rounded-xl lg:top-[260px] pointer-events-none hidden dark:block"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
