import type { ReactNode, MouseEvent } from "react";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

const paddings = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function DashboardCard({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-black/[0.04] dark:border-[#222] ${paddings[padding]} transition-all duration-200 ${
        hover ? "hover:shadow-lg hover:-translate-y-0.5" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
