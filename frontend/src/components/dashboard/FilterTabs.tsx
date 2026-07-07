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
      className={`inline-flex items-center bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-xl border border-black/[0.04] dark:border-[#222] p-1 ${className}`}
    >
      {options.map((option) => (
        <DashboardButton
          key={option}
          onClick={() => onChange(option)}
          className={`px-4 h-8 text-sm font-medium rounded-lg capitalize transition-all duration-200 ${
            value === option
              ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
              : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
          }`}
        >
          {option}
        </DashboardButton>
      ))}
    </div>
  );
}
