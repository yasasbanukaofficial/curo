import { useNavigate } from "react-router-dom";
import { useGetOverviewStatsQuery, useGetTeamsQuery, useGetProjectsQuery } from "../../store";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import {
  FolderKanban,
  KeyRound,
  LayoutGrid,
  Users,
  Plus,
  RefreshCw,
  AlertCircle,
  Clock,
  ChevronRight,
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

function timeAgo(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const now = Date.now();
  const ts = new Date(dateStr).getTime();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr, "");
}

export default function Overview() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useGetOverviewStatsQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: allProjects = [] } = useGetProjectsQuery();

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
        <div className="h-7 w-28 bg-black/[0.04] dark:bg-white/[0.04] rounded-lg mb-6 animate-pulse" />
        <div className="flex flex-wrap gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[72px] w-[160px] bg-black/[0.04] dark:bg-white/[0.04] rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {[1, 2].map((col) => (
            <DashboardCard key={col} className="animate-pulse">
              <div className="h-4 w-28 bg-black/[0.04] dark:bg-white/[0.04] rounded mb-5" />
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.04]" />
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-black/[0.04] dark:bg-white/[0.04] rounded mb-1.5" />
                    <div className="h-2.5 w-20 bg-black/[0.04] dark:bg-white/[0.04] rounded" />
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
              <h2 className="text-base font-semibold text-black dark:text-white mb-2">
                Failed to load overview
              </h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-6 leading-relaxed">
                Something went wrong. Please try again.
              </p>
              <DashboardButton
                onClick={() => refetch()}
                className="h-9 px-4 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-[10px] hover:bg-black/90 dark:hover:bg-white"
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
            <h1 className="text-xl font-semibold text-black dark:text-white">Overview</h1>
            <p className="text-sm text-black/50 dark:text-white/50 mt-1">Get started by creating your first project</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <DashboardCard className="max-w-md w-full py-12">
            <div className="flex flex-col items-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center mb-5">
                <FolderKanban className="w-7 h-7 text-black/50 dark:text-white/50" />
              </div>
              <h2 className="text-lg font-semibold text-black dark:text-white mb-2">
                No projects yet
              </h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-6 leading-relaxed">
                Create your first project to start managing secrets, environments, and teams.
              </p>
              <DashboardButton
                onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
                className="h-9 px-4 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-[10px] hover:bg-black/90 dark:hover:bg-white"
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
          <h1 className="text-xl font-semibold text-black dark:text-white">Overview</h1>
          <p className="text-sm text-black/50 dark:text-white/50 mt-1">
            {totalProjects} project{totalProjects !== 1 ? "s" : ""} &middot; {totalSecrets} secret{totalSecrets !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <DashboardButton
            onClick={() => navigate("/dashboard/projects", { state: { openCreateSecret: true } })}
            className="h-9 px-4 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-[10px] hover:bg-black/90 dark:hover:bg-white"
          >
            <Plus className="w-4 h-4" />
            Add Secret
          </DashboardButton>
          <DashboardButton
            onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
            className="h-9 px-4 text-sm font-medium text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.04] rounded-[10px] hover:bg-black/[0.08] dark:hover:bg-white/[0.08]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </DashboardButton>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <DashboardCard className="flex-1 min-w-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
              <FolderKanban className="w-4 h-4 text-black/50 dark:text-white/50" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black dark:text-white">{totalProjects}</p>
              <p className="text-[11px] text-black/50 dark:text-white/50">Projects</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="flex-1 min-w-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
              <KeyRound className="w-4 h-4 text-black/50 dark:text-white/50" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black dark:text-white">{totalSecrets}</p>
              <p className="text-[11px] text-black/50 dark:text-white/50">Secrets</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="flex-1 min-w-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-black/50 dark:text-white/50" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black dark:text-white">{totalEnvironments}</p>
              <p className="text-[11px] text-black/50 dark:text-white/50">Environments</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard className="flex-1 min-w-[140px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center">
              <Users className="w-4 h-4 text-black/50 dark:text-white/50" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black dark:text-white">{totalTeams}</p>
              <p className="text-[11px] text-black/50 dark:text-white/50">Teams</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
        <DashboardCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-black dark:text-white">Recent Projects</h3>
            <DashboardButton
              onClick={() => navigate("/dashboard/projects")}
              className="text-[11px] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white font-medium"
            >
              View all
            </DashboardButton>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">No recent projects.</p>
          ) : (
            <div className="space-y-1">
              {recentProjects.map((p) => (
                <div
                  key={p._id}
                  onClick={() => navigate(`/dashboard/project/${p._id}`)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <FolderKanban className="w-3.5 h-3.5 text-black/50 dark:text-white/50" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate">{p.projectName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {p.teamId ? (
                          <span className="text-[10px] font-medium text-black/50 dark:text-white/50 bg-black/[0.04] dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                            {p.teamName || "Team"}
                          </span>
                        ) : (
                          <span className="text-[10px] text-black/50 dark:text-white/50">Personal</span>
                        )}
                        <span className="text-[10px] text-black/50 dark:text-white/50 flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDate(p.updatedAt, p._id)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-black/50 dark:text-white/50 flex-shrink-0">
                    <span>{p.secretCount} secret{p.secretCount !== 1 ? "s" : ""}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        <DashboardCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-black dark:text-white">Recent Secrets</h3>
          </div>
          {recentSecrets.length === 0 ? (
            <p className="text-sm text-black/50 dark:text-white/50">No secrets yet.</p>
          ) : (
            <div className="space-y-1">
              {recentSecrets.map((s) => (
                <div
                  key={s._id}
                  onClick={() => navigate(`/dashboard/project/${s.projectId}`)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04] group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                      <KeyRound className="w-3.5 h-3.5 text-black/50 dark:text-white/50" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate">{s.secName}</p>
                      <p className="text-[11px] text-black/50 dark:text-white/50">{s.projectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-black/50 dark:text-white/50 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>{timeAgo(s.createdAt)}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>
      </div>

      {teams.length > 0 && (
        <DashboardCard>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-black dark:text-white">Your Teams</h3>
            <DashboardButton
              onClick={() => navigate("/dashboard/teams")}
              className="text-[11px] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white font-medium"
            >
              View all
            </DashboardButton>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {teams.map((team) => {
              const projectCount = allProjects.filter((p: any) => p.teamId === team._id).length;
              const memberCount = (team as any).memberCount || 0;
              return (
                <div
                  key={team._id}
                  onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                >
                  <div className="w-8 h-8 rounded-lg bg-black/[0.04] dark:bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-black/50 dark:text-white/50" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-black dark:text-white truncate">{team.name}</p>
                    <p className="text-[11px] text-black/50 dark:text-white/50">{memberCount} member{memberCount !== 1 ? "s" : ""} &middot; {projectCount} project{projectCount !== 1 ? "s" : ""}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-black/30 dark:text-white/30 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </DashboardCard>
      )}
    </div>
  );
}