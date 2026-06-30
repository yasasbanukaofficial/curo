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
        <p className="text-xs text-[#8E8E93] dark:text-[#666] font-medium">{label}</p>
        <Icon className="w-4 h-4 text-[#8E8E93] dark:text-[#666]" />
      </div>
      <p className="text-2xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] tracking-tight">{value}</p>
      <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1.5">{change}</p>
    </DashboardCard>
  );
}
