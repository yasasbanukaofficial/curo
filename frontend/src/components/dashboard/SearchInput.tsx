import { Search } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}: SearchInputProps) {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-9 pl-10 pr-4 text-sm bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-xl border border-black/[0.04] dark:border-[#222] outline-none text-[#1D1D1F] dark:text-[#E5E5E5] placeholder-[#8E8E93] dark:placeholder-[#666] transition-colors duration-200"
      />
    </div>
  );
}
