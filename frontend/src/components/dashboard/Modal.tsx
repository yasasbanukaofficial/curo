import type { ReactNode } from "react";
import { X } from "lucide-react";
import DashboardButton from "./DashboardButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  children: ReactNode;
  footer?: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  loading?: boolean;
  className?: string;
  overlayClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  onSubmit,
  submitLabel = "Save",
  submitDisabled = false,
  loading = false,
  className = "",
  overlayClassName = "",
  bodyClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${overlayClassName}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`w-full ${sizeStyles[size]} bg-white dark:bg-[#111] rounded-2xl border border-black/[0.04] dark:border-[#222] shadow-xl transition-all duration-200 ${className}`}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="min-w-0 flex-1">
            <h2 className={`text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] ${titleClassName}`}>
              {title}
            </h2>
            {description && (
              <p className={`text-sm text-[#8E8E93] dark:text-[#666] mt-1 ${descriptionClassName}`}>
                {description}
              </p>
            )}
          </div>
          <DashboardButton
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A] flex-shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </DashboardButton>
        </div>

        <div className={`px-6 py-4 ${bodyClassName}`}>
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-4 border-t border-black/[0.04] dark:border-[#222]">
          {footer || (
            <>
              <DashboardButton
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                onClick={onSubmit}
                disabled={submitDisabled || loading}
                className="h-9 px-4 text-sm font-medium text-white bg-[var(--accent)] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[var(--accent)]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : submitLabel}
              </DashboardButton>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
