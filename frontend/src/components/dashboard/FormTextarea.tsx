interface FormTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export default function FormTextarea({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  touched,
  required = false,
  disabled = false,
  rows = 3,
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
}: FormTextareaProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-[#FF3B30] ml-0.5">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`w-full px-3.5 py-2.5 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border-none outline-none text-[#1D1D1F] dark:text-[#E5E5E5] placeholder-[#8E8E93] dark:placeholder-[#666] transition-colors duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />
      {touched && error && (
        <p className={`mt-1.5 text-xs text-[#FF3B30] ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
}
