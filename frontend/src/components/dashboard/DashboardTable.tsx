import type { ReactNode } from "react";

interface DashboardTableProps {
  children: ReactNode;
  className?: string;
}

export function DashboardTable({ children, className = "" }: DashboardTableProps) {
  return (
    <div className={`bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-black/[0.04] dark:border-[#222] transition-all duration-200 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}

interface ThProps {
  children: ReactNode;
  className?: string;
}

export function Th({ children, className = "" }: ThProps) {
  return (
    <th className={`text-left text-[11px] font-medium text-black/50 dark:text-white/50 py-3 px-5 ${className}`}>
      {children}
    </th>
  );
}

interface TrProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Tr({ children, className = "", onClick }: TrProps) {
  return (
    <tr
      className={`border-b border-black/[0.02] dark:border-white/[0.04] last:border-none hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors duration-200 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
    >
      {children}
    </tr>
  );
}

interface TdProps {
  children: ReactNode;
  className?: string;
}

export function Td({ children, className = "" }: TdProps) {
  return (
    <td className={`py-3.5 px-5 ${className}`}>{children}</td>
  );
}
