import DotsLine from "./DotsLine";
import Corner from "./Corner";

const cards = [
  {
    title: "Turn scattered secrets into a structured vault",
    description: "Upload .env files, API keys, and configuration variables to build a centralized secrets system.",
    image: "https://framerusercontent.com/images/MX3HNqrEJ01i4kqgdVnDkeXOVI.png?width=800",
    reverse: false
  },
  {
    title: "Enforce consistency, access control, and structure automatically",
    description: "Curo syncs your secrets in real time, detects configuration drift, and ensures approved variables are used across every environment.",
    image: "https://framerusercontent.com/images/LVggzU8ChBFPgvtXEilJdK23PY.png?width=800",
    reverse: true
  },
  {
    title: "Generate aligned configs across every environment",
    description: "Deploy consistent environment variables to development, staging, and production automatically.",
    image: "https://framerusercontent.com/images/wiPH8LAYQR3ffg2hsJKuBoFS9wY.png?width=800",
    reverse: false
  }
];

export default function FeatureSection() {
  return (
    <section className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <Corner />
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Turn scattered secrets into a controlled system
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Curo converts your environment configuration into a secure, version-controlled system that scales with your team.
          </p>
        </div>

        <div className="space-y-12 lg:space-y-16">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-10 lg:gap-16 rounded-2xl border border-[#ededed] p-6 lg:p-10 ${
                card.reverse ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-1/2">
                <div className="max-w-md">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919] font-display mb-4 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-base text-[#737373] leading-relaxed mb-6">
                    {card.description}
                  </p>
                  <a
                    href="#pricing"
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-[#191919]"
                  >
                    See examples
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="w-full lg:w-1/2">
                <div className="rounded-xl border border-[#efefef] overflow-hidden bg-[#fcfcfc] shadow-sm">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
