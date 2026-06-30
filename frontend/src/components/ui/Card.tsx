import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10 ${className}`}>
      {children}
    </div>
  );
}

export function CuroBadge() {
  return (
    <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
      Curo
    </span>
  );
}
