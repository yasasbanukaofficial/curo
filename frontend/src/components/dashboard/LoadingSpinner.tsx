import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export default function LoadingSpinner({ size = 20, className = "" }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={`animate-spin text-black dark:text-white ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
