import { forwardRef, type ForwardedRef } from "react";
import { Search, Command } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  shortcutKey?: string;
}

function SearchInputInner({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = "Search...",
  className = "",
  shortcutKey,
}: SearchInputProps, ref: ForwardedRef<HTMLInputElement>) {
  return (
    <div className={`relative flex-1 max-w-md ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className="w-full h-9 pl-10 pr-12 text-sm bg-white/[0.04] rounded-xl border border-white/[0.06] outline-none text-[#FAFAFA] placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/20 transition-all duration-200"
      />
      {shortcutKey && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-medium text-white/30 pointer-events-none">
          <Command className="w-3 h-3" />
          <span>{shortcutKey}</span>
        </div>
      )}
    </div>
  );
}

export default forwardRef(SearchInputInner);
