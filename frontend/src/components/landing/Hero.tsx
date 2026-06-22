import DotsLine from "./DotsLine";
import Corner from "./Corner";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

export default function Hero() {
  return (
    <section className="relative bg-[#fcfcfc] pt-24">
      <DotsLine className="h-10" />
      <div className="border-x border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
        <Corner />
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#191919] font-display leading-[1.05] mb-6">
            Secrets that stay consistent across your team
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#737373] leading-relaxed mb-10 max-w-2xl mx-auto">
            Curo securely stores, manages, and syncs environment variables across your projects, teams, and environments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <ButtonPrimary href="#pricing">
              Start writing
            </ButtonPrimary>
            <ButtonSecondary href="#features">
              See examples
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </ButtonSecondary>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-[#ededed] bg-white p-2 shadow-xl">
            <div className="rounded-xl border border-[#efefef] overflow-hidden bg-[#fcfcfc] shadow-inner">
              <div className="h-8 border-b border-[#efefef] bg-[#fcfcfc] flex items-center px-4 gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="mx-auto bg-[#ededed] rounded-md h-5 w-64 text-[10px] text-[#737373] flex items-center justify-center font-mono">
                  curo.app/dashboard
                </div>
              </div>
              <img
                src="https://framerusercontent.com/images/3TFqmzpkg29FoG0w6wdYdGdwn2E.png?width=1600"
                alt="Curo Dashboard Interface"
                className="w-full h-auto object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
      <DotsLine className="h-10" />
    </section>
  );
}
