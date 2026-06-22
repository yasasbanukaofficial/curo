export default function FeatureGrid() {
  const operations = [
    {
      title: "Generate",
      description: "Curo generates secure environment configurations for new projects, services, and deployment targets.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      )
    },
    {
      title: "Rewrite",
      description: "Automatically remap environment variables so every service uses the correct values.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7H18" />
        </svg>
      )
    },
    {
      title: "Summarize",
      description: "Extract key secrets from config files, documentation, and environment dumps.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      )
    },
    {
      title: "Expand",
      description: "Transform a single .env template into full configurations for every environment.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 20v-4m0 4h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
        </svg>
      )
    },
    {
      title: "Adapt",
      description: "Convert secrets between formats — .env, JSON, YAML, Kubernetes — without manual work.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      title: "Verify",
      description: "Ensure secrets are valid, present, and up-to-date across every project and environment.",
      icon: (
        <svg className="h-6 w-6 text-[#191919]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Core secrets operations
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            A unified set of tools to keep secrets consistent across your company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {operations.map((op, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#ededed] bg-white p-6 hover:border-[#1b1b1b]/20 hover:shadow-sm transition-all duration-300 group"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f4f4] mb-5 group-hover:bg-[#191919]/5 transition-colors">
                {op.icon}
              </div>
              <h3 className="text-lg font-bold text-[#191919] font-display mb-2">
                {op.title}
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed">
                {op.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
