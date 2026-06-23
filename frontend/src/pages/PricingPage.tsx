import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";
import DotsLine from "../components/landing/DotsLine";
import Corner from "../components/landing/Corner";
import { Button } from "../components/ui/Button";
import StaggerContainer, { fadeInUp } from "../components/animations/StaggerContainer";
import { PiCheck, PiArrowUpRight } from "react-icons/pi";

const tiers = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Perfect for small teams getting started with secret management.",
    popular: false,
    features: [
      "Up to 5 team members",
      "1,000 secrets",
      "3 environments",
      "Basic vault setup",
      "Community support",
      "CLI access",
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
  },
  {
    name: "Team",
    price: { monthly: 29, yearly: 290 },
    description: "For growing teams that need advanced controls and collaboration.",
    popular: true,
    features: [
      "Up to 25 team members",
      "50,000 secrets",
      "Unlimited environments",
      "Advanced access controls",
      "Version history & rollbacks",
      "Priority support",
      "Audit log",
      "API access",
    ],
    cta: "Start Free Trial",
    variant: "secondary" as const,
  },
  {
    name: "Enterprise",
    price: { monthly: null, yearly: null },
    description: "For organizations that need custom solutions and dedicated support.",
    popular: false,
    features: [
      "Unlimited team members",
      "Unlimited secrets",
      "Unlimited environments",
      "Custom access controls",
      "Dedicated account manager",
      "Custom SLA guarantees",
      "SSO / SAML",
      "On-premise deployment",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

const allFeatures = [
  { category: "Secrets", items: ["Secrets storage", "Environment variables", "Config files", "Secret rotation", "Encryption at rest", "Encryption in transit"] },
  { category: "Team", items: ["Team management", "Role-based access", "Audit logging", "Activity feed", "Webhook notifications", "Slack integration"] },
  { category: "Deploy", items: ["CLI tool", "API access", "CI/CD integration", "Git sync", "Environment cloning", "Rollback support"] },
  { category: "Security", items: ["SOC 2 compliance", "GDPR compliant", "Data encryption", "Access policies", "Session management", "IP whitelisting"] },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const easeOut = [0.25, 0, 0, 1] as [number, number, number, number];

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfc] pt-24">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-[#fcfcfc]">
        <DotsLine className="h-10" />
        <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <Corner />
          <motion.div
            className="text-center max-w-4xl mx-auto pb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-6xl font-normal tracking-tight text-[#1D1D1F] font-sans leading-[1.05] mb-6">
              Simple, transparent pricing.
            </motion.h1>
            <motion.p variants={itemVariants} className="text-sm sm:text-base lg:text-lg text-[#6E6E73] leading-relaxed mb-10 max-w-2xl mx-auto">
              Start for free. Scale as you grow. No hidden fees, no surprise charges.
            </motion.p>
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm font-medium ${!annual ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-[#1D1D1F]' : 'bg-[#E5E5EA]'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <span className={`text-sm font-medium ${annual ? 'text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>
                Annual<span className="text-[#30D158] ml-1 text-xs">Save 20%</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative bg-[#fcfcfc]">
        <DotsLine className="h-10" />
        <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <Corner />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <motion.div
                key={tier.name}
                variants={fadeInUp(30, 0.5)}
                className={`relative flex flex-col rounded-3xl border p-6 sm:p-8 ${tier.popular ? 'border-2 border-[#1D1D1F] shadow-2xl' : 'border-[#E5E5EA] shadow-xl'} bg-white`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1D1D1F] text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                <h3 className="text-2xl font-semibold text-[#1D1D1F] mb-2">{tier.name}</h3>
                <p className="text-sm text-[#6E6E73] mb-6">{tier.description}</p>
                <div className="mb-8">
                  {tier.price.monthly === null ? (
                    <div className="text-4xl font-bold text-[#1D1D1F]">Custom</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-[#1D1D1F]">${annual ? tier.price.yearly : tier.price.monthly}</span>
                      <span className="text-sm text-[#6E6E73]">/mo</span>
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#6E6E73]">
                      <PiCheck className="w-4 h-4 mt-0.5 text-[#30D158] shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={tier.variant} size="md" className="w-full rounded-[5px]">
                  {tier.cta}
                </Button>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative bg-[#fcfcfc]">
        <DotsLine className="h-10" />
        <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <Corner />
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOut }}
              className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-4"
            >
              Everything you need to manage secrets.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
              className="text-sm sm:text-base text-[#6E6E73] leading-relaxed"
            >
              Powerful features for teams of any size.
            </motion.p>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {allFeatures.map((group) => (
              <motion.div key={group.category} variants={fadeInUp(30, 0.5)}>
                <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4">{group.category}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-[#6E6E73]">
                      <PiCheck className="w-4 h-4 mt-0.5 text-[#30D158] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[#fcfcfc] mb-16 lg:mb-24">
        <DotsLine className="h-10" />
        <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <Corner />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeOut }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1D1D1F] leading-[1.1] mb-4">
              Ready to get started?
            </h2>
            <p className="text-sm sm:text-base text-[#6E6E73] leading-relaxed mb-8 max-w-2xl mx-auto">
              Join thousands of teams that trust Curo for their secret management.
            </p>
            <Button variant="secondary" size="md" className="px-8 py-4 text-lg shadow-lg rounded-[5px]">
              Get Started for Free
              <PiArrowUpRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
