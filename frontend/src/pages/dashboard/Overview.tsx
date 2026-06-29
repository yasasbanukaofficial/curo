import { useNavigate } from "react-router-dom";
import { useGetOverviewStatsQuery } from "../../store";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import StatCard from "../../components/dashboard/StatCard";
import {
  FolderKanban,
  KeyRound,
  LayoutGrid,
  Users,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";

function formatDate(dateStr: string | undefined, id: string): string {
  const ts = dateStr
    ? new Date(dateStr).getTime()
    : parseInt(id.substring(0, 8), 16) * 1000;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function Overview() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useGetOverviewStatsQuery();

  const totalProjects = stats?.projects ?? 0;
  const totalSecrets = stats?.secrets ?? 0;
  const totalEnvironments = stats?.environments ?? 0;
  const totalTeams = stats?.teams ?? 0;
  const recentProjects = stats?.recentProjects ?? [];
  const recentSecrets = stats?.recentSecrets ?? [];
  const hasData = totalProjects > 0 || totalTeams > 0;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
        <div className="h-7 w-28 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-lg mb-6 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <DashboardCard key={i} className="animate-pulse">
              <div className="h-3 w-16 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-4" />
              <div className="h-7 w-12 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-3" />
              <div className="h-3 w-24 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded" />
            </DashboardCard>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[1, 2].map((col) => (
            <DashboardCard key={col} className="animate-pulse">
              <div className="h-4 w-28 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-5" />
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A]" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded mb-1.5" />
                    <div className="h-2.5 w-20 bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded" />
                  </div>
                </div>
              ))}
            </DashboardCard>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
        <div className="flex-1 flex items-center justify-center">
          <DashboardCard className="max-w-sm w-full py-10">
            <div className="flex flex-col items-center text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] dark:bg-[#3B1C1C] flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-[#DC2626] dark:text-[#F87171]" />
              </div>
              <h2 className="text-base font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-2">
                Failed to load overview
              </h2>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6 leading-relaxed">
                Something went wrong. Please try again.
              </p>
              <DashboardButton
                onClick={() => refetch()}
                className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </DashboardButton>
            </div>
          </DashboardCard>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Overview</h1>
            <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-1">Get started by creating your first project</p>
          </div>
        </div>
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
              <DashboardButton
                onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
                className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
              >
                <Plus className="w-4 h-4" />
                New Project
              </DashboardButton>
            </div>
          </DashboardCard>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Overview</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-1">
            {totalProjects} project{totalProjects !== 1 ? "s" : ""} &middot; {totalEnvironments} environment{totalEnvironments !== 1 ? "s" : ""} &middot; {totalSecrets} secret{totalSecrets !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <DashboardButton
            onClick={() => navigate("/dashboard/projects", { state: { openCreateSecret: true } })}
            className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
          >
            <Plus className="w-4 h-4" />
            Add Secret
          </DashboardButton>
          <DashboardButton
            onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
            className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
          >
            New Project
          </DashboardButton>
        </div>
      </div>

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
          change={`${totalTeams === 1 ? "1 team" : `${totalTeams} teams`}`}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <DashboardCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Recent Projects</h3>
            <DashboardButton
              onClick={() => navigate("/dashboard/projects")}
              className="text-[11px] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] font-medium"
            >
              View all
            </DashboardButton>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-[#8E8E93] dark:text-[#666]">No recent projects.</p>
          ) : (
            <div className="space-y-1">
              {recentProjects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/dashboard/project/${p._id}`)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-3.5 h-3.5 text-[#8E8E93]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{p.projectName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.teamId ? (
                          <span className="text-[10px] font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] px-1.5 py-0.5 rounded">
                            {p.teamName || "Team"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8E8E93] dark:text-[#666]">Personal</span>
                        )}
                        <span className="text-[10px] text-[#8E8E93] dark:text-[#666] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(p.updatedAt, p._id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#8E8E93] dark:text-[#666] flex-shrink-0">
                    <span>{p.secretCount} secret{p.secretCount !== 1 ? "s" : ""}</span>
                    <span>{p.environmentCount} env{p.environmentCount !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Recent Secrets</h3>
          </div>
          {recentSecrets.length === 0 ? (
            <p className="text-sm text-[#8E8E93] dark:text-[#666]">No secrets yet.</p>
          ) : (
            <div className="space-y-1">
              {recentSecrets.map((s) => (
                <div
                  key={s._id}
                  onClick={() => navigate(`/dashboard/project/${s.projectId}`)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50"
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
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8E93] dark:text-[#666] flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(s.createdAt, s._id)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}