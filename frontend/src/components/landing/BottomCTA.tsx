import DotsLine from "./DotsLine";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";

export default function BottomCTA() {
  return (
    <section className="bg-[#fcfcfc]">
      <DotsLine className="h-10" />
      <div className="border-x border-b border-[#efefef] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#191919] font-display leading-[1.1] mb-6">
          Standardize how your team manages secrets
        </h2>
        <p className="text-base sm:text-lg text-[#737373] leading-relaxed mb-10 max-w-2xl mx-auto">
          Join teams that use Curo to keep secrets secure, environments consistent, and deployments reliable across every project.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <ButtonPrimary href="#pricing" size="lg">
            Start free trial
          </ButtonPrimary>
          <ButtonSecondary href="#" size="lg">
            Talk to sales
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </ButtonSecondary>
        </div>
      </div>
    </section>
  );
}
