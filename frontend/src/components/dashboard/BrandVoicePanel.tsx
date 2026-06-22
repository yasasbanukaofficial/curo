import ProgressBar from "../ui/ProgressBar";
import { CheckIcon } from "../ui/Icons";

function MetricRow({ label, value, showCheck }: { label: string; value: number; showCheck: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#1A1A1A] dark:text-[#E5E5E5]">{label}</span>
        <div className="flex items-center gap-2">
          {value < 100 && (
            <span className="text-xs text-[#888] dark:text-[#666] font-medium">{value}%</span>
          )}
          {showCheck && <CheckIcon className="w-3.5 h-3.5 text-[#22C55E]" />}
        </div>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

export default function BrandVoicePanel() {
  return (
    <aside className="w-[220px] bg-white dark:bg-[#1A1A1A] border-l border-[#EFEFEF] dark:border-[#2A2A2A] flex flex-col flex-shrink-0 p-5">
      <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E5E5E5] mb-5">Brand Voice Status</h3>

      <div className="space-y-4">
        <MetricRow label="Tone: Professional" value={100} showCheck />
        <MetricRow label="Terminology: 95% aligned" value={95} showCheck />
        <MetricRow label="Structure: Standard format applied" value={100} showCheck />
      </div>

      <div className="mt-auto pt-4 border-t border-[#EFEFEF] dark:border-[#2A2A2A] space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-[#22C55E]">
          <CheckIcon className="w-3 h-3" />
          <span>Curo is maintaining your company's brand voice.</span>
        </div>
        <p className="text-[11px] text-[#888] dark:text-[#666] italic">&gt; analyzing writing patterns...</p>
      </div>
    </aside>
  );
}
