import type { ReactNode } from "react";

interface IconBadgeProps {
  children: ReactNode;
  size?: "sm" | "md";
  rounded?: string;
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
};

const roundedMap = {
  sm: "rounded-lg",
  md: "rounded-xl",
};

export default function IconBadge({
  children,
  size = "sm",
  rounded,
  className = "",
}: IconBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${sizeMap[size]} ${rounded || roundedMap[size]} ${className}`}
    >
      {children}
    </span>
  );
}
