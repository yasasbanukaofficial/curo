import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AuthFieldProps {
  formik: Record<string, any>;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

export default function AuthField({
  formik,
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
}: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#636363]"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={name}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-[#d4d4d4] bg-white px-4 py-2.5 text-sm text-[#191919] placeholder-[#999] shadow-sm transition focus:border-[#191919] focus:ring-2 focus:ring-[#191919]/20 focus:outline-none pr-10"
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#191919] dark:hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
}
