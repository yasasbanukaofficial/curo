import type { ReactNode, ButtonHTMLAttributes } from "react";

interface DashboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  href?: string;
}

export default function DashboardButton({
  children,
  className = "",
  href,
  ...props
}: DashboardButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer";

  if (href) {
    return (
      <a
        href={href}
        className={`${base} ${className}`}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
}
