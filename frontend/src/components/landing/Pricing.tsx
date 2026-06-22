export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/ month",
      description: "What's Included:",
      features: [
        "Up to 5 team members",
        "50,000 words per month",
        "Basic brand voice training",
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
        "250,000 words per month",
        "Custom style guides",
        "Priority support",
        "Advanced brand voice",
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
        "Unlimited words",
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
    <section id="pricing" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Start with a free trial. No credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.featured
                  ? "border-[#191919] bg-[#191919] text-white shadow-xl scale-[1.02] md:scale-105"
                  : "border-[#ededed] bg-white text-[#191919] shadow-sm"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-block rounded-full bg-[#191919] border border-white/20 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                  Most Popular
                </span>
              )}
              <h3 className={`text-lg font-semibold mb-1 ${plan.featured ? "text-white" : "text-[#191919]"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-4xl font-extrabold tracking-tight font-display ${plan.featured ? "text-white" : "text-[#191919]"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm ${plan.featured ? "text-white/60" : "text-[#737373]"}`}>
                    {plan.period}
                  </span>
                )}
              </div>
              <p className={`text-xs font-medium mb-4 uppercase tracking-wider ${plan.featured ? "text-white/50" : "text-[#737373]"}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm">
                    <svg className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.featured ? "text-white" : "text-[#191919]"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.featured ? "text-white/80" : "text-[#737373]"}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.href}
                className={`block text-center rounded-full py-3 text-sm font-semibold transition-all active:scale-95 ${
                  plan.featured
                    ? "bg-white text-[#191919] hover:bg-white/90"
                    : "border border-[#ddd] bg-white text-[#191919] hover:bg-[#f4f4f4]"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
