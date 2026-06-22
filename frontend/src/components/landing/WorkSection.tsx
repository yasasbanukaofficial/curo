import DotsLine from "./DotsLine";
import Corner from "./Corner";

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

export default function WorkSection() {
  return (
    <section id="problem" className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <Corner />
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            The problem with legacy secrets workflows
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Secrets management wasn&apos;t built for shared standards. Every team manages variables differently — and it slows everything down.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-[#ededed] bg-[#f4f4f4] p-8 flex flex-col">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 mb-5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="m15 9-6 6" />
                <path d="m9 9 6 6" />
              </svg>
            </span>
            <h3 className="text-xl font-bold text-[#191919] font-display mb-3">
              Scattered secrets systems
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed mb-6">
              API keys live in Slack. Database URLs live in Notion. Secrets live in someone&apos;s local .env. Nothing is connected.
            </p>
            <div className="mt-auto border-t border-[#ededed] pt-5 space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                Inconsistent secrets across environments
              </div>
              <div className="flex items-center gap-2 text-xs text-[#737373]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                Manual copy-paste and drift slow deployments
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#ededed] bg-white p-8 shadow-sm flex flex-col">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-500 mb-5">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <path d="m9 11 3 3L22 4" />
              </svg>
            </span>
            <h3 className="text-xl font-bold text-[#191919] font-display mb-3">
              One intelligent secrets layer
            </h3>
            <p className="text-sm text-[#737373] leading-relaxed mb-8">
              Curo connects your projects, environments, and secrets into a unified management platform.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
              {features.map((feat, idx) => (
                <div key={idx} className="rounded-xl border border-[#efefef] p-4 hover:border-[#191919]/25 transition-all">
                  <h4 className="text-sm font-semibold text-[#191919] mb-1">{feat.title}</h4>
                  <p className="text-xs text-[#737373] leading-relaxed">{feat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
