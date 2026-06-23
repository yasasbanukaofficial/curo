import DashboardButton from "./DashboardButton";

interface FilterTabsProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function FilterTabs({
  options,
  value,
  onChange,
  className = "",
}: FilterTabsProps) {
  return (
    <div
      className={`flex items-center gap-1.5 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-xl border border-black/[0.04] dark:border-[#222] p-1 ${className}`}
    >
      {options.map((option) => (
        <DashboardButton
          key={option}
          onClick={() => onChange(option)}
          className={`px-3 h-7 text-xs font-medium rounded-lg capitalize ${
            value === option
              ? "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F]"
              : "text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
          }`}
        >
          {option}
        </DashboardButton>
      ))}
    </div>
  );
}
