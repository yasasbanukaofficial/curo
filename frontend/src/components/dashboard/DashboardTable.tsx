import type { ReactNode } from "react";

interface DashboardTableProps {
  children: ReactNode;
  className?: string;
}

export function DashboardTable({ children, className = "" }: DashboardTableProps) {
  return (
    <div className={`bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-2xl border border-black/[0.04] dark:border-[#222] overflow-hidden transition-all duration-200 ${className}`}>
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
    <th className={`text-left text-[11px] font-medium text-[#8E8E93] dark:text-[#666] py-3 px-5 ${className}`}>
      {children}
    </th>
  );
}

interface TrProps {
  children: ReactNode;
  className?: string;
}

export function Tr({ children, className = "" }: TrProps) {
  return (
    <tr className={`border-b border-black/[0.02] dark:border-[#222]/50 last:border-none hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200 ${className}`}>
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
