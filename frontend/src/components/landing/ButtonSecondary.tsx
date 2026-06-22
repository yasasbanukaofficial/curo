import type { ReactNode } from "react";

interface ButtonSecondaryProps {
  children: ReactNode;
  href?: string;
  size?: "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  md: "px-8 py-3.5 text-sm sm:text-base",
  lg: "px-10 py-4 text-sm sm:text-base",
};

export default function ButtonSecondary({
  children,
  href,
  size = "md",
  className = "",
  onClick,
}: ButtonSecondaryProps) {
  const base =
    "rounded-full border border-[#ddd] bg-white text-[#191919] shadow-sm hover:bg-[#f4f4f4] transition-all active:scale-[0.97] text-center inline-flex items-center justify-center gap-2";
  const cls = `${base} ${sizeMap[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
