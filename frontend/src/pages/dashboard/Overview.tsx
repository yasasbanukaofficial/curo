import { useNavigate } from "react-router-dom";
import { useGetOverviewStatsQuery } from "../../store";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import StatCard from "../../components/dashboard/StatCard";
import { FolderKanban, KeyRound, LayoutGrid, Users, Plus } from "lucide-react";

export default function Overview() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useGetOverviewStatsQuery();

  const totalProjects = stats?.projects ?? 0;
  const totalSecrets = stats?.secrets ?? 0;
  const totalEnvironments = stats?.environments ?? 0;
  const totalTeams = stats?.teams ?? 0;
  const recentProjects = stats?.recentProjects ?? [];
  const recentSecrets = stats?.recentSecrets ?? [];

  const hasData = totalProjects > 0 || totalTeams > 0;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Overview</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-1">
            {totalProjects > 0
              ? `${totalProjects} project${totalProjects !== 1 ? "s" : ""} \u00B7 ${totalEnvironments} environment${totalEnvironments !== 1 ? "s" : ""} \u00B7 ${totalSecrets} secret${totalSecrets !== 1 ? "s" : ""}`
              : "Get started by creating your first project"}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          {hasData && (
            <>
              <DashboardButton onClick={() => navigate("/dashboard/projects", { state: { openCreateSecret: true } })} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                Add Secret
              </DashboardButton>
              <DashboardButton onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })} className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
                New Project
              </DashboardButton>
            </>
          )}
        </div>
      </div>

      <DashboardCard className="mb-8">
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

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <DashboardCard key={i} className="animate-pulse">
              <div className="h-3 w-16 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-4" />
              <div className="h-7 w-12 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-2" />
              <div className="h-3 w-24 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded" />
            </DashboardCard>
          ))}
        </div>
      ) : !hasData ? (
        <div className="flex-1 flex items-center justify-center">
          <DashboardCard className="max-w-md w-full py-12">
            <div className="flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center mb-5">
                <FolderKanban className="w-7 h-7 text-[#8E8E93]" />
              </div>
              <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-2">
                No projects yet
              </h2>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6 leading-relaxed">
                Create your first project to start managing secrets, environments, and teams.
              </p>
              <div className="flex items-center gap-3">
                <DashboardButton onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
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
            <StatCard
              label="Total Projects"
              value={String(totalProjects)}
              change={`${totalEnvironments} environment${totalEnvironments !== 1 ? "s" : ""} across all projects`}
              icon={FolderKanban}
            />
            <StatCard
              label="Managed Secrets"
              value={String(totalSecrets)}
              change={`Across ${totalProjects} project${totalProjects !== 1 ? "s" : ""}`}
              icon={KeyRound}
            />
            <StatCard
              label="Environments"
              value={String(totalEnvironments)}
              change={`Across ${totalProjects} project${totalProjects !== 1 ? "s" : ""}`}
              icon={LayoutGrid}
            />
            <StatCard
              label="Teams"
              value={String(totalTeams)}
              change={`Active teams`}
              icon={Users}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <DashboardCard>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Recent Projects</h3>
                <DashboardButton onClick={() => navigate("/dashboard/projects")} className="text-[11px] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] font-medium">
                  View all
                </DashboardButton>
              </div>
              {recentProjects.length === 0 ? (
                <p className="text-sm text-[#8E8E93] dark:text-[#666]">No projects yet.</p>
              ) : (
                <div className="space-y-1">
                  {recentProjects.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/dashboard/projects?project=${p._id}`)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                          <FolderKanban className="w-3.5 h-3.5 text-[#8E8E93]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{p.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] dark:text-[#666] flex-shrink-0">
                        <span>{p.secretCount || 0} secrets</span>
                        <span>{p.environmentCount || 0} envs</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>

            <DashboardCard>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Recent Activity</h3>
              </div>
              {recentSecrets.length === 0 ? (
                <p className="text-sm text-[#8E8E93] dark:text-[#666]">No recent activity.</p>
              ) : (
                <div className="space-y-1">
                  {recentSecrets.map((s) => (
                    <div
                      key={s._id}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-all duration-200 hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                          <KeyRound className="w-3.5 h-3.5 text-[#8E8E93]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{s.secName}</p>
                          <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{s.projectName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>
        </>
      )}
    </div>
  );
}
