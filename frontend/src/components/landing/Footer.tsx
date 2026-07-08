import Logo from "../ui/Logo";
import StaggerContainer, { fadeInUp } from "../animations/StaggerContainer";
import { motion } from "framer-motion";

const sections = [
  { title: "Product", links: [{ label: "Secrets", href: "/#secrets" }, { label: "Centralize", href: "/#centralize" }, { label: "Manage", href: "/#manage" }] },
  { title: "Resources", links: [{ label: "Sync", href: "/#sync" }, { label: "Deploy", href: "/#deploy" }] },
  { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Service", href: "/terms" }] },
];

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black overflow-hidden">
      <StaggerContainer className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 pt-16 pb-8" margin="0px">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <motion.div variants={fadeInUp(20, 0.5)} className="col-span-2 md:col-span-1">
            <Logo size="sm" className="mb-4" />
            <p className="text-sm text-black/50 dark:text-white/50 leading-relaxed max-w-xs">
              Centralized secrets management for teams that need secure, consistent environment variables at scale.
            </p>
          </motion.div>
          {sections.map((section, idx) => (
            <motion.div key={idx} variants={fadeInUp(20, 0.5)}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-black/40 dark:text-white/40 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a href={link.href} className="text-sm text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div variants={fadeInUp(20, 0.5)} className="border-t border-black/10 dark:border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-black/40 dark:text-white/40">&copy; {new Date().getFullYear()} Curo. All rights reserved.</p>

        </motion.div>
      </StaggerContainer>
    </footer>
  );
}
