interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
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
        className={`block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5 ${labelClassName}`}
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
        disabled={disabled}
        className={`w-full h-10 px-3.5 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border-none outline-none text-[#1D1D1F] dark:text-[#E5E5E5] placeholder-[#8E8E93] dark:placeholder-[#666] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${inputClassName}`}
      />
      {touched && error && (
        <p className={`mt-1.5 text-xs text-[#FF3B30] ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
}
