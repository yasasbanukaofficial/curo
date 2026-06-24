import type { ReactNode } from "react";

interface FormInputProps {
  type?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
}

export default function FormInput({
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  error,
  icon,
}: FormInputProps) {
  return (
    <div>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] border border-black/[0.04] dark:border-[#222] rounded-xl px-3 ${
            icon ? "pl-10" : ""
          } text-[#1D1D1F] dark:text-[#E5E5E5] placeholder:text-[#8E8E93] dark:placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-black/[0.08] dark:focus:ring-white/[0.08] focus:bg-white dark:focus:bg-[#222] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
      {error && (
        <p className="text-[11px] text-[#FF3B30] mt-1.5 ml-1">{error}</p>
      )}
    </div>
  );
}
