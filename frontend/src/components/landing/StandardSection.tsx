import DotsLine from "./DotsLine";
import Corner from "./Corner";

const steps = [
  {
    number: "01",
    title: "Connect company knowledge",
    description: "Upload your .env files, project configs, and secrets. Curo understands your environment structure.",
    image: "https://framerusercontent.com/images/SMhyQZ0ZUQl7exxlOZUZtihso.png?width=600"
  },
  {
    number: "02",
    title: "Build the secrets model",
    description: "Curo organizes variables, detects conflicts, and versions your entire secrets graph.",
    image: "https://framerusercontent.com/images/D1sdpjEClZUX7BPy9gZnYNVh2SU.png?width=600"
  },
  {
    number: "03",
    title: "Generate consistent output",
    description: "Every new deployment uses the same secure environment configuration automatically.",
    image: "https://framerusercontent.com/images/cV3Qv3v8NRCeTWzbPZaisvTxQ.png?width=600"
  }
];

export default function StandardSection() {
  return (
    <section id="centralized" className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
        <Corner />
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#191919] font-display mb-4">
            How your secrets become a shared standard
          </h2>
          <p className="text-base sm:text-lg text-[#737373] leading-relaxed">
            Connect your secrets once. Every environment stays in sync automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="rounded-2xl border border-[#ededed] bg-white p-6 overflow-hidden">
              <div className="rounded-lg border border-[#efefef] overflow-hidden bg-[#fcfcfc] mb-5">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-[#ddd]" />
                <span className="text-xs font-semibold text-[#636363] tracking-wider">Step {step.number}</span>
                <div className="h-px flex-1 bg-[#ddd]" />
              </div>
              <h3 className="text-lg font-bold text-[#191919] font-display mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#737373] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
