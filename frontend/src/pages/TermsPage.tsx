import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using Curo, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use the service. We reserve the right to update these terms at any time, and continued use of the service after changes constitutes acceptance of the new terms."
  },
  {
    title: "Account Registration",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when creating an account. You must notify us immediately of any unauthorized use of your account."
  },
  {
    title: "Acceptable Use",
    content:
      "You agree to use Curo only for lawful purposes and in accordance with these terms. You may not use the service to store or transmit any malicious code, violate any laws, or infringe upon the rights of others. You are responsible for ensuring that your use of the service complies with all applicable laws and regulations."
  },
  {
    title: "Secrets and Data",
    content:
      "You retain full ownership of the secrets and data you store in Curo. We claim no intellectual property rights over your content. You are solely responsible for the accuracy, quality, and legality of the secrets you store. We implement encryption and access controls to protect your data, but we cannot guarantee absolute security."
  },
  {
    title: "Service Availability",
    content:
      "We strive to provide reliable and uninterrupted service, but we do not guarantee that the service will be available at all times. We may perform maintenance, updates, or upgrades that could temporarily affect availability. We will make reasonable efforts to notify you in advance of scheduled maintenance."
  },
  {
    title: "Limitation of Liability",
    content:
      "Curo and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service. Our total liability for any claims under these terms shall not exceed the amount you have paid us in the twelve months preceding the claim."
  },
  {
    title: "Termination",
    content:
      "You may terminate your account at any time by deleting it through your account settings. We may suspend or terminate your access if you violate these terms or if we suspect unauthorized use. Upon termination, your data will be permanently deleted in accordance with our data retention policy."
  },
  {
    title: "Governing Law",
    content:
      "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Curo is established, without regard to its conflict of law provisions. Any disputes arising under these terms shall be resolved through binding arbitration."
  },
];

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed mb-2">
              Last updated: July 8, 2026
            </p>
            <p className="text-sm sm:text-base text-black/70 dark:text-white/70 leading-relaxed">
              These terms govern your use of the Curo secrets management platform. Please read them carefully.
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
