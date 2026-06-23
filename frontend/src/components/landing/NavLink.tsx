import type { ReactNode, AnchorHTMLAttributes } from "react";

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  mobile?: boolean;
}

export default function NavLink({ href, children, mobile = false, className = "", ...props }: NavLinkProps) {
  const baseClass = mobile
    ? "flex items-center gap-2 py-2 text-base font-medium text-[#636363] hover:text-[#191919]"
    : "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-[#636363] hover:text-[#191919] hover:bg-[#F5F5F7] transition-colors";

  return (
    <a href={href} className={`${baseClass} ${className}`.trim()} {...props}>
      {children}
    </a>
  );
}
