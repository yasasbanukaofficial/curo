import type { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead>
      <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {children}
      </tr>
    </thead>
  );
}

interface ThProps {
  children: ReactNode;
  className?: string;
}

export function Th({ children, className = "pb-3 pr-4" }: ThProps) {
  return <th className={className}>{children}</th>;
}

interface TableRowProps {
  children: ReactNode;
}

export function TableRow({ children }: TableRowProps) {
  return <tr className="border-b border-slate-100 last:border-0">{children}</tr>;
}

interface TdProps {
  children: ReactNode;
  className?: string;
}

export function Td({ children, className = "py-3 pr-4" }: TdProps) {
  return <td className={className}>{children}</td>;
}

interface EmptyRowProps {
  colSpan: number;
  message: string;
}

export function EmptyRow({ colSpan, message }: EmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-sm text-slate-400">{message}</td>
    </tr>
  );
}
