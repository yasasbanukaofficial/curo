import type { ReactNode } from "react";

interface ButtonPrimaryProps {
  children: ReactNode;
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

const sizeMap = {
  sm: "px-4 py-2 text-sm shadow-sm active:scale-95",
  md: "px-8 py-3.5 text-sm sm:text-base shadow-md active:scale-[0.97]",
  lg: "px-10 py-4 text-sm sm:text-base shadow-md active:scale-[0.97]",
};

export default function ButtonPrimary({
  children,
  href,
  size = "md",
  className = "",
  onClick,
}: ButtonPrimaryProps) {
  const base =
    "rounded-full bg-[#191919] font-semibold text-white hover:bg-[#191919]/90 transition-all text-center inline-flex items-center justify-center";
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
