import { motion } from "framer-motion";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.1 * i, ease: easeOut },
  }),
};

const stats = [
  { value: "100%", label: "Encrypted" },
  { value: "Real-time", label: "Sync" },
  { value: "Granular", label: "Access Control" },
  { value: "Multi-env", label: "Support" },
];

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
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-[#F5F5F7] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#333]"
            >
              <div className="text-2xl sm:text-3xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-black/60 dark:text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
