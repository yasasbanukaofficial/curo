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
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-[#636363]"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="mt-1.5 block w-full rounded-lg border border-[#d4d4d4] bg-white px-4 py-2.5 text-sm text-[#191919] placeholder-[#999] shadow-sm transition focus:border-[#191919] focus:ring-2 focus:ring-[#191919]/20 focus:outline-none"
        value={formik.values[name] ?? ""}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1.5 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );
}
