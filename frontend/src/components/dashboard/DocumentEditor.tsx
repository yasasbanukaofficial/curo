import { CheckIcon } from "../ui/Icons";

export default function DocumentEditor() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-[#888] dark:text-[#666]">
          <span className="text-[#1A1A1A] dark:text-[#E5E5E5]">Overview</span>
          <span className="text-[#ccc] dark:text-[#555]">|</span>
          <span className="text-[#1A1A1A] dark:text-[#E5E5E5]">Product Release v2.4</span>
          <span className="text-[#ccc] dark:text-[#555]">|</span>
          <span className="text-[#888] dark:text-[#666]">Editing</span>
        </div>
        <span className="text-xs text-[#888] dark:text-[#666] bg-[#F5F5F5] dark:bg-[#2A2A2A] px-3 py-1 rounded-full">In progress</span>
      </div>

      <div className="flex-1 bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#EFEFEF] dark:border-[#2A2A2A] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-medium text-[#1A1A1A] dark:text-[#E5E5E5]">Product Release v2.4</h2>
          <button className="w-6 h-6 flex items-center justify-center rounded-md text-[#888] dark:text-[#666] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-colors text-sm">
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center px-3 py-1 text-sm bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-full text-[#1A1A1A] dark:text-[#E5E5E5]">
                &ldquo;hey guys&rdquo;
              </span>
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#1A1A1A] dark:text-[#E5E5E5] bg-white dark:bg-[#1A1A1A] border border-[#E5E5E5] dark:border-[#444] rounded-full shadow-sm">
                <span>🎙</span>
                <span>Casual tone detected!</span>
              </div>
            </div>

            <p className="text-sm text-[#1A1A1A] dark:text-[#E5E5E5] leading-relaxed">
              hey guys, we shipped v2.4 and it totally turbocharges ur dashboard, please check it out 🚀
            </p>

            <ul className="space-y-1.5 text-sm text-[#1A1A1A] dark:text-[#E5E5E5]">
              <li className="flex items-center gap-2"><span className="text-[#888] dark:text-[#666]">•</span>better ui!</li>
              <li className="flex items-center gap-2"><span className="text-[#888] dark:text-[#666]">•</span>new api endpoint</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EFEFEF] dark:border-[#2A2A2A] px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-[#22C55E] font-medium">
            <CheckIcon className="w-4 h-4" />
            Processing
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium text-[#1A1A1A] dark:text-[#E5E5E5] bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-full">
              <CheckIcon className="w-3 h-3 text-[#22C55E]" /> Tone: Professional
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium text-[#1A1A1A] dark:text-[#E5E5E5] bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-full">
              <CheckIcon className="w-3 h-3 text-[#22C55E]" /> Terminology: 95% aligned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
