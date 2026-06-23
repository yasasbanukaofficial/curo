import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
}

const variantStyles = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98]",
  outline:
    "border border-[#ddd] bg-white text-[#191919] shadow-sm hover:bg-[#f4f4f4] active:scale-[0.98]",
  secondary:
    "text-white bg-[#191919] hover:bg-[#191919]/90 active:scale-[0.97]",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100",
  ghost:
    "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm shadow-sm rounded-[5px]",
  md: "px-8 py-3.5 text-sm sm:text-base shadow-md rounded-[5px]",
  lg: "px-10 py-4 text-sm sm:text-base shadow-md rounded-[5px]",
};

export function Button({ children, variant = "primary", size = "md", href, className = "", ...props }: ButtonProps) {
  const base = "font-button cursor-pointer transition-all text-center inline-flex items-center justify-center gap-2";

  if (href) {
    return (
      <a href={href} className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={`${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ActionButtons({ onEdit, onDelete, onHistory }: {
  onEdit: () => void;
  onDelete: () => void;
  onHistory?: () => void;
}) {
  return (
    <div className="flex gap-2">
      <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
      <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      {onHistory && (
        <Button variant="outline" size="sm" onClick={onHistory}>History</Button>
      )}
    </div>
  );
}
