import DotsLine from "./DotsLine";
import Corner from "./Corner";

export default function IntegrationSection() {
  return (
    <section id="integrations" className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <Corner />
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Works with your existing tools
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Curo integrates with your existing tools, repos, and CI/CD pipeline — no migration required.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">N</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Notion</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">S</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Slack</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">GD</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Google Docs</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">C</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Confluence</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">GH</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">GitHub</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#191919">L</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Linear</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">V</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">Vercel</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-14 w-14 rounded-xl border border-[#ededed] bg-white p-3 shadow-sm flex items-center justify-center">
                <svg className="h-full w-full object-contain" viewBox="0 0 24 24" fill="none">
                  <rect width="24" height="24" rx="4" fill="#f4f4f4" />
                  <text x="12" y="16" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#191919">AWS</text>
                </svg>
              </div>
              <span className="text-xs font-medium text-[#737373]">AWS</span>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-[#737373]">
              Plus CI/CD pipelines, Docker, Kubernetes, and more.
            </p>
          </div>
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
