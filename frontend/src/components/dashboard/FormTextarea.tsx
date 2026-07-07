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
        className={`block text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1.5 ${labelClassName}`}
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
        className={`w-full px-3.5 py-2.5 text-sm bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-gray-900 dark:text-[#FAFAFA] placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/20 transition-all duration-200 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />
      {touched && error && (
        <p className={`mt-1.5 text-xs text-[#FF3B30] ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
}
