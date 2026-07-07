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
        className={`w-full ${sizeStyles[size]} bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-xl transition-all duration-200 ${className}`}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="min-w-0 flex-1">
            <h2 className={`text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] ${titleClassName}`}>
              {title}
            </h2>
            {description && (
              <p className={`text-sm text-gray-500 dark:text-white/40 mt-1 ${descriptionClassName}`}>
                {description}
              </p>
            )}
          </div>
          <DashboardButton
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] flex-shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </DashboardButton>
        </div>

        <div className={`px-6 py-4 ${bodyClassName}`}>
          {children}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-4 border-t border-gray-200 dark:border-[#222]">
          {footer || (
            <>
              <DashboardButton
                onClick={onClose}
                className="h-9 px-4 text-sm font-medium text-gray-700 dark:text-white bg-gray-100 dark:bg-white/[0.04] rounded-[10px] hover:bg-gray-200 dark:hover:bg-white/[0.08]"
              >
                Cancel
              </DashboardButton>
              <DashboardButton
                onClick={onSubmit}
                disabled={submitDisabled || loading}
                className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-[10px] hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
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
