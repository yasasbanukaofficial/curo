import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

const sections = [
  {
    title: "Information We Collect",
    content:
      "We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes your name, email address, and any secrets or configuration data you store in Curo. We also collect information automatically through your use of the service, such as usage logs, device information, and IP addresses."
  },
  {
    title: "How We Use Your Information",
    content:
      "We use the information we collect to provide, maintain, and improve our secrets management services. This includes storing and synchronizing your secrets across environments, managing team access controls, and sending you service related communications. We do not use your stored secrets for any purpose other than providing the service you requested."
  },
  {
    title: "Data Storage and Security",
    content:
      "Your data is encrypted at rest and in transit using industry standard encryption protocols. Secrets are stored with end to end encryption to ensure that only authorized team members can access them. We implement strict access controls and regularly audit our systems to protect against unauthorized access."
  },
  {
    title: "Data Sharing and Disclosure",
    content:
      "We do not sell your personal information or your secrets. We may share data with service providers who help us operate our infrastructure, but only under strict contractual obligations that prohibit them from using your data for any other purpose. We may disclose information if required by law or to protect our rights."
  },
  {
    title: "Your Rights and Choices",
    content:
      "You can access, update, or delete your account information at any time through your account settings. You can export your data, disconnect OAuth providers, and request permanent deletion of your account. We will retain your information only as long as necessary to provide our services or as required by law."
  },
  {
    title: "Cookies and Tracking",
    content:
      "We use essential cookies to maintain your session and authenticate your requests. We do not use tracking cookies or third party analytics that collect personal information. You can control cookie preferences through your browser settings, though disabling cookies may affect service functionality."
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. We will notify you of material changes by email or through a notice on our platform. Your continued use of Curo after such changes constitutes your acceptance of the updated policy."
  },
  {
    title: "Contact Us",
    content:
      "If you have questions about this privacy policy or our data practices, please contact us at privacy@curo.dev. We are committed to addressing your concerns and protecting your privacy."
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <section className="relative bg-white dark:bg-black py-8 lg:py-12">
        <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight text-black dark:text-white font-sans leading-[1.15] mb-4">
              Privacy Policy
            </h1>
            <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-2">
              Last updated: July 8, 2026
            </p>
            <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
              This policy explains how Curo collects, uses, and protects your information when you use our secrets management platform.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative bg-white dark:bg-black py-8 lg:py-12">
        <div className="mx-auto max-w-[1400px] px-8 sm:px-10 lg:px-14 py-16 lg:py-24 relative border-t border-black/10 dark:border-white/10">
          <div className="max-w-3xl space-y-12">
            {sections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: easeOut }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-black dark:text-white mb-3">
                  {idx + 1}. {section.title}
                </h2>
                <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
