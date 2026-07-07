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
        className="block text-sm font-medium text-black/60 dark:text-white/60"
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
          className="block w-full rounded-lg border border-black/[0.12] dark:border-white/[0.12] bg-white dark:bg-[#1A1A1A] px-4 py-2.5 text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 shadow-sm transition focus:border-black dark:focus:border-white focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20 focus:outline-none pr-10"
          value={formik.values[name] ?? ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white transition-colors"
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
