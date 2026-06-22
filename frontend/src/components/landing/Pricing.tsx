import { motion } from "framer-motion";
import SectionShell from "./SectionShell";
import SectionHeading from "./SectionHeading";
import StaggerContainer, { fadeInUp } from "./StaggerContainer";
import { CheckIcon } from "./ChevronRightIcon";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/ month",
      description: "What's Included:",
      features: [
        "Up to 5 team members",
        "50,000 secrets per month",
        "Basic vault setup",
        "Email support",
        "Core integrations"
      ],
      cta: "Start free trial",
      href: "#",
      featured: false
    },
    {
      name: "Team",
      price: "$159",
      period: "/ month",
      description: "What's Included:",
      features: [
        "Up to 25 team members",
        "250,000 secrets per month",
        "Custom environment configs",
        "Priority support",
        "Advanced access controls",
        "All integrations",
        "Version history"
      ],
      cta: "Start free trial",
      href: "#",
      featured: true
    },
    {
      name: "Organization",
      price: "Custom",
      period: "",
      description: "What's Included:",
      features: [
        "Unlimited team members",
        "Unlimited secrets",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "SSO & advanced security",
        "Custom contract terms"
      ],
      cta: "Contact sales",
      href: "#",
      featured: false
    }
  ];

  return (
    <SectionShell id="pricing">
      <SectionHeading
        heading="Simple, transparent pricing"
        subtitle="Start with a free trial. No credit card required."
        marginBottom="mb-16"
      />

      <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp(30, 0.5)}
            className={`relative rounded-2xl border-2 p-8 flex flex-col ${
              plan.featured
                ? "border-[#191919] bg-white shadow-xl"
                : "border-dashed border-[#ccc] bg-white shadow-sm"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-block rounded-full bg-[#191919] px-4 py-1 text-xs font-semibold text-white shadow-sm">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-[#191919] mb-1">
              {plan.name}
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold tracking-tight font-display text-[#191919]">
                {plan.price}
              </span>
              {plan.period && (
                <span className="text-sm text-[#737373]">
                  {plan.period}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-[#737373] mb-4 uppercase tracking-wider">
              {plan.description}
            </p>
            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-start gap-3 text-sm">
                  <CheckIcon />
                  <span className="text-[#737373]">{feat}</span>
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`block text-center rounded-full py-3 text-sm font-semibold transition-all active:scale-95 ${
                plan.featured
                  ? "bg-[#191919] text-white hover:bg-[#191919]/90 shadow-sm"
                  : "border border-[#ddd] bg-white text-[#191919] hover:bg-[#f4f4f4]"
              }`}
            >
              {plan.cta}
            </a>
          </motion.div>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
