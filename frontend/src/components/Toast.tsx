import { useEffect } from "react";
import { WarningIcon, CloseIcon } from "./ui/Icons";

type ToastProps = {
  message: string;
  onClose: () => void;
  duration?: number;
};

function Toast({ message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 right-4 z-50 flex max-w-sm animate-slide-in items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3 shadow-lg ring-1 ring-red-100">
      <WarningIcon />
      <p className="text-sm font-medium text-red-800">{message}</p>
      <button onClick={onClose} className="ml-auto cursor-pointer rounded-lg p-1 text-red-400 transition hover:bg-red-100 hover:text-red-600">
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

export default Toast;
