export default function DocumentEditor() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-[#888]">
          <span className="text-[#1A1A1A]">Overview</span>
          <span className="text-[#ccc]">|</span>
          <span className="text-[#1A1A1A]">Product Release v2.4</span>
          <span className="text-[#ccc]">|</span>
          <span>Editing</span>
        </div>
        <span className="text-xs text-[#888] bg-[#F5F5F5] px-3 py-1 rounded-full">In progress</span>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-[#EFEFEF] shadow-[0_1px_4px_rgba(0,0,0,0.06)] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h2 className="text-lg font-medium text-[#1A1A1A]">Product Release v2.4</h2>
          <button className="w-6 h-6 flex items-center justify-center rounded-md text-[#888] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors text-sm">
            ✕
          </button>
        </div>

        <div className="px-6 pb-6 flex-1">
          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <span className="inline-flex items-center px-3 py-1 text-sm bg-[#F5F5F5] rounded-full text-[#1A1A1A]">
                &ldquo;hey guys&rdquo;
              </span>
              <div className="relative inline-flex items-center gap-1.5 px-3 py-1 text-xs text-[#1A1A1A] bg-white border border-[#E5E5E5] rounded-full shadow-sm">
                <span>🎙</span>
                <span>Casual tone detected!</span>
              </div>
            </div>

            <p className="text-sm text-[#1A1A1A] leading-relaxed">
              hey guys, we shipped v2.4 and it totally turbocharges ur dashboard, please check it out 🚀
            </p>

            <ul className="space-y-1.5 text-sm text-[#1A1A1A]">
              <li className="flex items-center gap-2">
                <span className="text-[#888]">•</span>
                better ui!
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#888]">•</span>
                new api endpoint
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#EFEFEF] px-6 py-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-[#22C55E] font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Processing
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium text-[#1A1A1A] bg-[#F5F5F5] rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Tone: Professional
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-medium text-[#1A1A1A] bg-[#F5F5F5] rounded-full">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Terminology: 95% aligned
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
