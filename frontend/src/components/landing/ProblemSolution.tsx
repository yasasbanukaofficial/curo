export default function ProblemSolution() {
  const features = [
    {
      title: "Centralized Secret Storage",
      description: "Store all API keys, tokens, and credentials in one secure vault."
    },
    {
      title: "Version History",
      description: "Track every change with full audit logs and rollback support."
    },
    {
      title: "Cross-Environment Sync",
      description: "Sync secrets across development, staging, and production automatically."
    },
    {
      title: "Real-Time Validation",
      description: "Detect missing, expired, or misconfigured secrets instantly."
    }
  ];

  return (
    <section id="problem" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            The problem with legacy secrets workflows
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Secrets management wasn’t built for shared standards. Every team manages variables differently — and it slows everything down.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-5 rounded-2xl border border-[#ededed] bg-[#f4f4f4] p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 mb-6">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6" />
                  <path d="m9 9 6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#191919] font-display mb-4">
                Scattered secrets systems
              </h3>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                API keys live in Slack. Database URLs live in Notion. Secrets live in someone’s local .env. Nothing is connected.
              </p>
            </div>
            <div className="mt-8 border-t border-[#ededed] pt-6 space-y-3">
              <div className="flex items-center gap-3 text-xs text-[#737373]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Inconsistent secrets across environments
              </div>
              <div className="flex items-center gap-3 text-xs text-[#737373]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                Manual copy-paste and drift slow deployments
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-2xl border border-[#191919]/10 bg-white p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600 mb-6">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#191919] font-display mb-4">
                One intelligent secrets layer
              </h3>
              <p className="text-sm sm:text-base text-[#737373] leading-relaxed mb-8">
                Curo connects your projects, environments, and secrets into a unified management platform.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feat, idx) => (
                <div key={idx} className="rounded-xl border border-[#efefef] p-4 hover:border-[#191919]/25 transition-all">
                  <h4 className="text-sm font-semibold text-[#191919] mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
