import { useState, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { SelectOption } from "../../types/select";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  size?: "md" | "sm";
  className?: string;
  onBlur?: (e: React.FocusEvent) => void;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder,
  icon,
  error,
  touched,
  disabled = false,
  size = "md",
  className = "",
  onBlur,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
        onClick={() => { if (!disabled) setOpen(!open); }}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!disabled) setOpen(!open); }
          if (e.key === "Escape") setOpen(false);
        }}
        className={`flex items-center w-full bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none transition-colors duration-200 cursor-pointer relative ${
          icon ? "pl-10 pr-3" : "pl-3.5 pr-3"
        } ${size === "sm" ? "h-7 text-[11px]" : "h-10 text-sm"} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${open ? "ring-2 ring-accent/30 border-accent/20" : "focus:border-gray-300 dark:focus:border-white/[0.12]"}`}
      >
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
        <span className={`flex-1 ${selected ? "text-gray-900 dark:text-[#FAFAFA]" : "text-gray-400 dark:text-white/40"}`}>
          {selected ? selected.label : placeholder || "Select..."}
        </span>
        <ChevronDown className={`${size === "sm" ? "w-3 h-3" : "w-4 h-4"} text-gray-400 dark:text-white/40 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-white/[0.06] shadow-lg py-1 z-50 max-h-60 overflow-y-auto min-w-[160px] w-max">
          {options.map((opt) => (
            <div
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { onChange(opt.value); setOpen(false); } }}
              className={`flex items-center gap-2 h-9 px-3 text-sm cursor-pointer transition-colors duration-150 ${
                opt.value === value
                  ? "bg-gray-100 dark:bg-white/[0.04] text-gray-900 dark:text-[#FAFAFA] font-medium"
                  : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"
              }`}
            >
              <span className="flex-1">{opt.label}</span>
              {opt.value === value && <Check className="w-3.5 h-3.5 text-accent" />}
            </div>
          ))}
        </div>
      )}

      {touched && error && (
        <p className="mt-1.5 text-xs text-[#FF3B30]">{error}</p>
      )}
    </div>
  );
}
