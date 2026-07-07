import type { ReactNode } from "react";
import type { SelectOption } from "../../types/select";
import Select from "./Select";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: ReactNode;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export default function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  icon,
  error,
  touched,
  required = false,
  disabled = false,
  className = "",
  labelClassName = "",
}: FormSelectProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-black dark:text-white mb-1.5 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-[#FF3B30] ml-0.5">*</span>}
        </label>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        icon={icon}
        error={error}
        touched={touched}
        disabled={disabled}
      />
    </div>
  );
}
