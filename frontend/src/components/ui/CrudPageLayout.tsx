import type { ReactNode } from "react";
import { Card, CuroBadge } from "./Card";

interface CrudPageLayoutProps {
  form: ReactNode;
  list: ReactNode;
}

export default function CrudPageLayout({ form, list }: CrudPageLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full max-w-xl shrink-0">{form}</div>
        <div className="min-w-0 flex-1">{list}</div>
      </div>
    </main>
  );
}

interface FormCardProps {
  children: ReactNode;
  title: string;
  description: string;
  editing?: boolean;
}

export function FormCard({ children, title, description }: FormCardProps) {
  return (
    <Card>
      <CuroBadge />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      {children}
    </Card>
  );
}

interface ListCardProps {
  children: ReactNode;
  title: string;
  count: number;
}

export function ListCard({ children, title, count }: ListCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{count}</span>
      </div>
      {children}
    </Card>
  );
}
