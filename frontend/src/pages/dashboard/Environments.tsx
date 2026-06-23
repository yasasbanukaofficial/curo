import { CheckCircle, Plus, KeyRound, Users, Clock, ArrowRight, RotateCw } from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";

const environments = [
  { name: "Development", secrets: 342, projects: 8, lastSync: "2m ago", url: "dev.curo.app", uptime: "99.8%" },
  { name: "Staging", secrets: 289, projects: 6, lastSync: "5m ago", url: "staging.curo.app", uptime: "99.9%" },
  { name: "Production", secrets: 617, projects: 14, lastSync: "1m ago", url: "app.curo.app", uptime: "99.99%" },
];

export default function Environments() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Environments</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {environments.length} environments · All systems operational
          </p>
        </div>
        <DashboardButton className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          Add Environment
        </DashboardButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {environments.map((env) => (
          <DashboardCard key={env.name} hover padding="lg">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#30D158]" />
                <div>
                  <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.name}</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666]">{env.url}</p>
                </div>
              </div>
              <span className="text-[10px] font-medium text-[#30D158] bg-[#30D158]/10 px-2.5 py-1 rounded-full">{env.uptime} uptime</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <KeyRound className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.secrets}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Secrets</p>
              </div>
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <Users className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.projects}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Projects</p>
              </div>
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <Clock className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.lastSync}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Last sync</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.04] dark:border-[#222]">
              <div className="flex items-center gap-2 text-xs text-[#8E8E93] dark:text-[#666]">
                <RotateCw className="w-3 h-3" />
                Auto-sync enabled
              </div>
              <DashboardButton className="text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] hover:text-[#636363] dark:hover:text-[#999]">
                Manage <ArrowRight className="w-3 h-3" />
              </DashboardButton>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
