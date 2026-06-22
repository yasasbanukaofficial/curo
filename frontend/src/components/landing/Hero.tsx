export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fcfcfc] pt-20 pb-16 lg:pt-28 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#191919] font-display leading-[1.1] mb-6">
            Secrets that stay consistent across your team
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#737373] leading-relaxed mb-10 max-w-2xl mx-auto">
            Curo securely stores, manages, and syncs environment variables across your projects, teams, and environments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
            <a href="#pricing" className="w-full sm:w-auto rounded-full bg-[#191919] px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md hover:bg-[#191919]/90 transition-all hover:translate-y-[-1px] active:translate-y-0 text-center">
              Get started
            </a>
            <a href="#features" className="w-full sm:w-auto rounded-full border border-[#ddd] bg-white px-8 py-3.5 text-sm sm:text-base font-semibold text-[#191919] shadow-sm hover:bg-[#f4f4f4] transition-all hover:translate-y-[-1px] active:translate-y-0 text-center">
              See examples
            </a>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-[#ededed] bg-white p-2 shadow-2xl">
            <div className="rounded-xl border border-[#efefef] overflow-hidden bg-[#fcfcfc] aspect-[1.38] relative shadow-inner">
              <div className="h-8 border-b border-[#efefef] bg-[#fcfcfc] flex items-center px-4 gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                <div className="mx-auto bg-[#ededed] rounded-md h-5 w-64 text-[10px] text-[#737373] flex items-center justify-center font-mono">
                  lexaro.ai/editor
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
    </section>
  );
}
