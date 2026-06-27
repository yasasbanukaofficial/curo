import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ size = 20, className = "" }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-[#1D1D1F] dark:text-[#E5E5E5] ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
