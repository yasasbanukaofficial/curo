import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";
import DashboardButton from "./DashboardButton";

type ToastVariant = "success" | "warning" | "error" | "info";

interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => string;
  success: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, { icon: typeof Info; border: string; iconColor: string; badge: string }> = {
  success: {
    icon: CheckCircle,
    border: "border-[#30D158]/20",
    iconColor: "text-[#30D158]",
    badge: "bg-[#30D158]/10",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-[#FF9F0A]/20",
    iconColor: "text-[#FF9F0A]",
    badge: "bg-[#FF9F0A]/10",
  },
  error: {
    icon: XCircle,
    border: "border-[#FF3B30]/20",
    iconColor: "text-[#FF3B30]",
    badge: "bg-[#FF3B30]/10",
  },
  info: {
    icon: Info,
    border: "border-[#007AFF]/20",
    iconColor: "text-[#007AFF]",
    badge: "bg-[#007AFF]/10",
  },
};

let toastCounter = 0;

function ToastItemComponent({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const config = variantStyles[item.variant];
  const VariantIcon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 w-full max-w-sm bg-white dark:bg-[#111] rounded-2xl border ${config.border} border-black/[0.04] dark:border-[#222] shadow-lg p-4 animate-[slideIn_0.3s_ease-out]`}
    >
      <div className={`w-8 h-8 rounded-lg ${config.badge} flex items-center justify-center flex-shrink-0`}>
        <VariantIcon className={`w-4 h-4 ${config.iconColor}`} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-black dark:text-white">{item.title}</p>
        {item.description && (
          <p className="text-[11px] text-black/50 dark:text-white/50 mt-0.5 leading-relaxed">{item.description}</p>
        )}
      </div>
      <DashboardButton
        onClick={() => onDismiss(item.id)}
        className="p-1 rounded-lg text-black/50 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04] flex-shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </DashboardButton>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (item: Omit<ToastItem, "id">) => {
      const id = `toast_${++toastCounter}_${Date.now()}`;
      const duration = item.duration ?? 4000;
      setToasts((prev) => [...prev, { ...item, id }]);
      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }
      return id;
    },
    [dismiss],
  );

  const toast = useCallback(
    (item: Omit<ToastItem, "id">) => addToast(item),
    [addToast],
  );

  const success = useCallback((title: string, description?: string) => addToast({ variant: "success", title, description }), [addToast]);
  const warning = useCallback((title: string, description?: string) => addToast({ variant: "warning", title, description }), [addToast]);
  const error = useCallback((title: string, description?: string) => addToast({ variant: "error", title, description }), [addToast]);
  const info = useCallback((title: string, description?: string) => addToast({ variant: "info", title, description }), [addToast]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast, success, warning, error, info, dismiss }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto">
            <ToastItemComponent item={item} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}
