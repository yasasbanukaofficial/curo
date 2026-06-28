import { useNavigate } from "react-router-dom";
import { KeyRound, FolderKanban, Users, Rocket, CheckCircle, RotateCw, Plus } from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import StatCard from "../../components/dashboard/StatCard";

const statCards: { label: string; value: string; change: string; icon: any }[] = [];

const environments: { name: string; lastSync: string; secrets: number }[] = [];

const recentChanges: { secret: string; action: string; user: string; time: string; env: string }[] = [];

const liveActivity: { user: string; action: string; target: string; time: string }[] = [];

export default function Overview() {
  const navigate = useNavigate();

  const hasData =
    statCards.length > 0 ||
    environments.length > 0 ||
    recentChanges.length > 0 ||
    liveActivity.length > 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <DashboardCard className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8E8E93] dark:text-[#666] font-medium">Good afternoon</p>
            <h1 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mt-0.5">Dashboard</h1>
            <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-1.5">
              Welcome to your dashboard
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <DashboardButton id="btn-add-secret" onClick={() => navigate("/dashboard/secrets", { state: { openCreateSecret: true } })} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
              Add Secret
            </DashboardButton>
            <DashboardButton id="btn-new-project" onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })} className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
              New Project
            </DashboardButton>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard id="cli-snippet" className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
            <span className="text-sm font-mono font-bold text-[#8E8E93]">&gt;_</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Pull secrets with the CLI</p>
            <code className="text-[11px] text-[#8E8E93] dark:text-[#666] font-mono bg-[#F5F5F7] dark:bg-[#1A1A1A] px-2 py-0.5 rounded mt-1 inline-block">
              npx curo pull
            </code>
          </div>
        </div>
      </DashboardCard>

      {!hasData ? (
        <div className="flex-1 flex items-center justify-center">
          <DashboardCard className="max-w-md w-full py-12">
            <div className="flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center mb-5">
                <Rocket className="w-7 h-7 text-[#8E8E93]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-2">
                No data to display yet
              </h2>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6 leading-relaxed">
                Create your first secret or project to get started with Curo.
              </p>
              <div className="flex items-center gap-3">
                <DashboardButton id="btn-add-secret" onClick={() => navigate("/dashboard/secrets", { state: { openCreateSecret: true } })} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                  <Plus className="w-4 h-4" />
                  Add Secret
                </DashboardButton>
                <DashboardButton id="btn-new-project" onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })} className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
                  <Plus className="w-4 h-4" />
                  New Project
                </DashboardButton>
              </div>
            </div>
          </DashboardCard>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((s) => <StatCard key={s.label} {...s} />)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="md:col-span-2 flex flex-col gap-6 md:gap-8">
              <DashboardCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5">
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Environment Health</h3>
                  <span className="text-[11px] text-[#30D158] font-medium">All systems operational</span>
                </div>
                <div className="space-y-2">
                  {environments.map((env) => (
                    <div key={env.name} className="flex items-center justify-between py-3.5 px-3 md:px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 transition-all duration-200 hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                      <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                        <CheckCircle className="w-5 h-5 text-[#30D158] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{env.name}</p>
                          <div className="flex flex-wrap items-center gap-x-3 mt-1">
                            <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{env.secrets} secrets</span>
                            <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">·</span>
                            <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Last sync {env.lastSync}</span>
                          </div>
                        </div>
                      </div>
                      <RotateCw className="w-3.5 h-3.5 text-[#8E8E93] dark:text-[#666] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </DashboardCard>

              <DashboardCard>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Recent Secret Activity</h3>
                  <DashboardButton className="hidden sm:inline-flex text-[11px] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] font-medium">
                    View all
                  </DashboardButton>
                </div>
                <div className="space-y-2">
                  {recentChanges.map((item) => (
                    <div
                      key={`${item.secret}-${item.time}`}
                      className="flex items-center justify-between py-3 px-3 rounded-xl transition-all duration-200 hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-[#1D1D1F] dark:bg-[#E5E5E5] flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{item.secret}</p>
                          <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">
                            <span className="font-medium">{item.action}</span> by {item.user}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] px-2 py-0.5 rounded-md">{item.env}</span>
                        <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <DashboardButton className="sm:hidden w-full mt-4 text-[11px] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] font-medium justify-center">
                  View all
                </DashboardButton>
              </DashboardCard>
            </div>

            <div className="hidden md:block md:col-span-1">
              <DashboardCard className="h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5">
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Live Activity</h3>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#30D158] rounded-full animate-pulse" />
                    <span className="text-[10px] text-[#30D158] font-medium">Live</span>
                  </span>
                </div>
                <div className="space-y-0">
                  {liveActivity.map((item, i) => (
                    <div key={i} className="relative pl-5 pb-5 last:pb-0">
                      {i < liveActivity.length - 1 && (
                        <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-black/[0.06] dark:bg-white/[0.06]" />
                      )}
                      <div className="absolute left-0 top-2 w-[10px] h-[10px] rounded-full border-2 border-[#1D1D1F] dark:border-[#E5E5E5] bg-white dark:bg-[#111]" />
                      <div className="min-w-0">
                        <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5] leading-snug">
                          <span className="font-medium">{item.user}</span> {item.action} <span className="font-medium">{item.target}</span>
                        </p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DashboardCard>
            </div>
          </div>

          <div className="md:hidden mt-8">
            <DashboardCard>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-5">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Live Activity</h3>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#30D158] rounded-full animate-pulse" />
                  <span className="text-[10px] text-[#30D158] font-medium">Live</span>
                </span>
              </div>
              <div className="space-y-0">
                {liveActivity.map((item, i) => (
                  <div key={i} className="relative pl-5 pb-5 last:pb-0">
                    {i < liveActivity.length - 1 && (
                      <div className="absolute left-[5px] top-2.5 bottom-0 w-px bg-black/[0.06] dark:bg-white/[0.06]" />
                    )}
                    <div className="absolute left-0 top-2 w-[10px] h-[10px] rounded-full border-2 border-[#1D1D1F] dark:border-[#E5E5E5] bg-white dark:bg-[#111]" />
                    <div className="min-w-0">
                      <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5] leading-snug">
                        <span className="font-medium">{item.user}</span> {item.action} <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
