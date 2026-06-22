function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-1.5 bg-[#E5E5E5] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#111] rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function MetricRow({ label, value, showCheck }: { label: string; value: number; showCheck: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#1A1A1A]">{label}</span>
        <div className="flex items-center gap-2">
          {value < 100 && (
            <span className="text-xs text-[#888] font-medium">{value}%</span>
          )}
          {showCheck && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

export default function BrandVoicePanel() {
  return (
    <aside className="w-[220px] bg-white border-l border-[#EFEFEF] flex flex-col flex-shrink-0 p-5">
      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-5">Brand Voice Status</h3>

      <div className="space-y-4">
        <MetricRow label="Tone: Professional" value={100} showCheck />
        <MetricRow label="Terminology: 95% aligned" value={95} showCheck />
        <MetricRow label="Structure: Standard format applied" value={100} showCheck />
      </div>

      <div className="mt-auto pt-4 border-t border-[#EFEFEF] space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Curo is maintaining your company's brand voice.</span>
        </div>
        <p className="text-[11px] text-[#888] italic">&gt; analyzing writing patterns...</p>
      </div>
    </aside>
  );
}
