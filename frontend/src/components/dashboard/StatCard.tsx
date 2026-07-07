import type { ElementType } from "react";
import DashboardCard from "./DashboardCard";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: ElementType;
}

export default function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <DashboardCard hover className="flex-1 min-w-[160px]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-black/50 dark:text-white/50 font-medium">{label}</p>
        <Icon className="w-4 h-4 text-black/50 dark:text-white/50" />
      </div>
      <p className="text-2xl font-semibold text-black dark:text-white tracking-tight">{value}</p>
      <p className="text-[11px] text-black/50 dark:text-white/50 mt-1.5">{change}</p>
    </DashboardCard>
  );
}
