export default function ProcessWalkthrough() {
  const steps = [
    {
      number: "01",
      title: "Connect company knowledge",
      description: "Upload your .env files, project configs, and secrets. Curo understands your environment structure."
    },
    {
      number: "02",
      title: "Build the writing model",
      description: "Curo organizes variables, detects conflicts, and versions your entire secrets graph."
    },
    {
      number: "03",
      title: "Generate consistent output",
      description: "Every new deployment uses the same secure environment configuration automatically."
    }
  ];

  return (
    <section id="process" className="bg-[#fcfcfc] py-20 lg:py-28 border-b border-[#efefef]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            How your secrets become a shared standard
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Connect your secrets once. Every environment stays in sync automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              <div className="text-center lg:text-left">
                <span className="inline-block text-6xl sm:text-7xl font-extrabold tracking-tight text-[#191919]/5 font-display mb-4 lg:mb-6 select-none">
                  {step.number}
                </span>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#191919] text-white text-sm font-bold mb-5">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#191919] font-display mb-3">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[#737373] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
