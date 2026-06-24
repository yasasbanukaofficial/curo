import { ChevronDown } from "lucide-react";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  selectClassName?: string;
  errorClassName?: string;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
  touched,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  selectClassName = "",
  errorClassName = "",
}: FormSelectProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-[#FF3B30] ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full h-10 pl-3.5 pr-10 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border-none outline-none text-[#1D1D1F] dark:text-[#E5E5E5] transition-colors duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${selectClassName}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] pointer-events-none" />
      </div>
      {touched && error && (
        <p className={`mt-1.5 text-xs text-[#FF3B30] ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
}
