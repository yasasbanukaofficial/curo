import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md";
}

const variantStyles = {
  primary:
    "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98]",
  outline:
    "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 active:scale-[0.98]",
  secondary:
    "text-white bg-[#111] hover:bg-[#111]/90",
  danger:
    "bg-red-50 text-red-600 hover:bg-red-100",
  ghost:
    "bg-indigo-50 text-indigo-600 hover:bg-indigo-100",
};

const sizeStyles = {
  sm: "px-2.5 py-1 text-xs font-medium rounded-md",
  md: "px-6 py-3 text-sm font-medium rounded-xl",
};

export function Button({ children, variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const base = "cursor-pointer transition inline-flex items-center justify-center gap-2";
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
