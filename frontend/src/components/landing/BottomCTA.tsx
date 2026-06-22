export default function BottomCTA() {
  return (
    <section className="bg-[#fcfcfc] py-20 lg:py-32 border-b border-[#efefef]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#191919] font-display leading-[1.1] mb-6">
          Standardize how your team manages secrets
        </h2>
        <p className="text-base sm:text-lg text-[#737373] leading-relaxed mb-10 max-w-2xl mx-auto">
          Join teams that use Curo to keep secrets secure, environments consistent, and deployments reliable across every project.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto rounded-full bg-[#191919] px-10 py-4 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#191919]/90 transition-all hover:translate-y-[-1px] active:translate-y-0 text-center"
          >
            Start free trial
          </a>
          <a
            href="#"
            className="w-full sm:w-auto rounded-full border border-[#ddd] bg-white px-10 py-4 text-sm sm:text-base font-semibold text-[#191919] shadow-sm hover:bg-[#f4f4f4] transition-all hover:translate-y-[-1px] active:translate-y-0 text-center"
          >
            Talk to sales
          </a>
        </div>
      </div>
    </section>
  );
}
