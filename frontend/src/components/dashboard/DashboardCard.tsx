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
      className={`bg-[#111113] rounded-2xl border border-white/[0.06] ${paddings[padding]} transition-all duration-200 ${
        hover ? "hover:border-white/[0.10] hover:shadow-xl hover:-translate-y-0.5" : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
