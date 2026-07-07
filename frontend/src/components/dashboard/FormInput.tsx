import type { ReactNode } from "react";

interface FormInputProps {
  type?: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: ReactNode;
}

export default function FormInput({
  type = "text",
  value,
  onChange,
  onBlur,
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
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full h-10 text-sm bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] rounded-xl px-3 ${
            icon ? "pl-10" : ""
          } text-gray-900 dark:text-[#FAFAFA] placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      </div>
      {error && (
        <p className="text-[11px] text-[#FF3B30] mt-1.5 ml-1">{error}</p>
      )}
    </div>
  );
}
