export default function BentoWalkthrough() {
  const steps = [
    {
      title: "Turn scattered secrets into a structured vault",
      description: "Upload .env files, API keys, and configuration variables to build a centralized secrets system.",
      image: "https://framerusercontent.com/images/kX9exbiMjOzIlAaMAdCEqqJ2zA.png?width=800",
      linkText: "See examples",
      reverse: false
    },
    {
      title: "Enforce consistency, access control, and structure automatically",
      description: "Curo syncs your secrets in real time, detects configuration drift, and ensures approved variables are used across every environment.",
      image: "https://framerusercontent.com/images/anMMQzkHSmqfIRUTfD5PJN9VDg.png?width=800",
      linkText: "See examples",
      reverse: true
    },
    {
      title: "Generate aligned configs across every environment",
      description: "Deploy consistent environment variables to development, staging, and production automatically.",
      image: "https://framerusercontent.com/images/MX3HNqrEJ01i4kqgdVnDkeXOVI.png?width=800",
      linkText: "See examples",
      reverse: false
    }
  ];

  return (
    <section id="centralized" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            Turn scattered secrets into a controlled system
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Curo converts your environment configuration into a secure, version-controlled system that scales with your team.
          </p>
        </div>

        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${
                step.reverse ? "lg:flex-row-reverse" : ""
              }`}
            >
              <div className="w-full lg:w-1/2">
                <div className="max-w-md">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#737373] mb-4">
                    Step 0{idx + 1}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#191919] font-display mb-4 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-base text-[#737373] leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <a
                    href="#pricing"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#191919] hover:underline"
                  >
                    {step.linkText}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="rounded-2xl border border-[#ededed] bg-[#f4f4f4] p-4 shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-xl border border-[#efefef] overflow-hidden bg-white shadow-sm">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
