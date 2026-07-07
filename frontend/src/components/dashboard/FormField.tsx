interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export default function FormField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
  inputClassName = "",
  errorClassName = "",
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className={`block text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1.5 ${labelClassName}`}
      >
        {label}
        {required && <span className="text-[#FF3B30] ml-0.5">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full h-10 px-3.5 text-sm bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-gray-900 dark:text-[#FAFAFA] placeholder-gray-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />
      {touched && error && (
        <p className={`mt-1.5 text-xs text-[#FF3B30] ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
}
