interface ProgressBarProps {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className = "" }: ProgressBarProps) {
  return (
    <div className={`w-full h-1.5 bg-[#E5E5E5] dark:bg-[#333] rounded-full overflow-hidden ${className}`}>
      <div className="h-full bg-[#111] dark:bg-[#fff] rounded-full transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
