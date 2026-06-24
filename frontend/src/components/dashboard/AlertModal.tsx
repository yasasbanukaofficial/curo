import { X, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import DashboardButton from "./DashboardButton";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertButtonVariant = "primary" | "secondary" | "destructive";

interface AlertButton {
  label: string;
  onClick: () => void;
  variant?: AlertButtonVariant;
  disabled?: boolean;
  loading?: boolean;
}

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
  variant?: AlertVariant;
  title: string;
  message?: string;
  buttons?: AlertButton[];
  size?: "sm" | "md" | "lg";
  className?: string;
  overlayClassName?: string;
}

const variantConfig: Record<AlertVariant, { icon: typeof Info; bg: string; border: string; iconColor: string }> = {
  info: {
    icon: Info,
    bg: "bg-[#007AFF]/10",
    border: "border-[#007AFF]/20",
    iconColor: "text-[#007AFF]",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-[#30D158]/10",
    border: "border-[#30D158]/20",
    iconColor: "text-[#30D158]",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-[#FF9F0A]/10",
    border: "border-[#FF9F0A]/20",
    iconColor: "text-[#FF9F0A]",
  },
  error: {
    icon: XCircle,
    bg: "bg-[#FF3B30]/10",
    border: "border-[#FF3B30]/20",
    iconColor: "text-[#FF3B30]",
  },
};

const buttonStyles: Record<AlertButtonVariant, string> = {
  primary:
    "h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed",
  secondary:
    "h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed",
  destructive:
    "h-9 px-4 text-sm font-medium text-white bg-[#FF3B30] rounded-xl hover:bg-[#FF3B30]/90 disabled:opacity-50 disabled:cursor-not-allowed",
};

const sizeStyles = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function AlertModal({
  open,
  onClose,
  variant = "info",
  title,
  message,
  buttons,
  size = "sm",
  className = "",
  overlayClassName = "",
}: AlertModalProps) {
  if (!open) return null;

  const config = variantConfig[variant];
  const VariantIcon = config.icon;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${overlayClassName}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`w-full ${sizeStyles[size]} bg-white dark:bg-[#111] rounded-2xl border border-black/[0.04] dark:border-[#222] shadow-xl transition-all duration-200 ${className}`}
      >
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="flex items-start gap-4 min-w-0 flex-1">
            <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.border} border flex items-center justify-center flex-shrink-0`}>
              <VariantIcon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">
                {title}
              </h2>
              {message && (
                <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-1 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>
          <DashboardButton
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A] flex-shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </DashboardButton>
        </div>

        {buttons && buttons.length > 0 && (
          <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-4 border-t border-black/[0.04] dark:border-[#222]">
            {buttons.map((btn, i) => (
              <DashboardButton
                key={i}
                onClick={btn.onClick}
                disabled={btn.disabled || btn.loading}
                className={buttonStyles[btn.variant ?? "primary"]}
              >
                {btn.loading ? "Loading..." : btn.label}
              </DashboardButton>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
