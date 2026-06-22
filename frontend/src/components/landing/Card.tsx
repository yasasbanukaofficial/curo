import type { ReactNode, ElementType } from "react";

interface CardProps {
  children: ReactNode;
  padding?: string;
  borderWidth?: string;
  hover?: boolean;
  className?: string;
  as?: ElementType;
  bg?: string;
}

export default function Card({
  children,
  padding = "p-6",
  borderWidth = "border",
  hover = false,
  className = "",
  as: Tag = "div",
  bg = "bg-white",
}: CardProps) {
  const hoverClasses = hover
    ? "hover:border-[#191919]/20 hover:shadow-sm transition-all duration-300 group"
    : "";
  return (
    <Tag
      className={`rounded-2xl ${borderWidth} border-[#ededed] ${bg} ${padding} ${hoverClasses} ${className}`}
    >
      {children}
    </Tag>
  );
}
