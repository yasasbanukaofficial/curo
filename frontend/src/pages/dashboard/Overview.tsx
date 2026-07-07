import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetOverviewStatsQuery, useGetTeamsQuery, useGetProjectsQuery, useVerifySessionQuery } from "../../store";
import { useActivityFeed } from "../../hooks/useActivityFeed";
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
  Activity,
  UserPlus,
  Key,

  ExternalLink,
  Sparkles,
} from "lucide-react";

function formatDate(dateStr: string | undefined, id: string): string {
  const ts = dateStr ? new Date(dateStr).getTime() : parseInt(id.substring(0, 8), 16) * 1000;
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } as const },
};

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="text-2xl font-bold text-gray-900 dark:text-[#FAFAFA] tracking-tight font-button"
    >
      {value}{suffix}
    </motion.span>
  );
}

const quickActions = [
  { label: "Create Project", description: "Start a new project", icon: Plus, path: "/dashboard/projects", action: "newProject" },
  { label: "Invite Member", description: "Add someone to your team", icon: UserPlus, path: "/dashboard/teams" },
  { label: "Generate API Key", description: "Create access token", icon: Key, path: "/dashboard/settings" },
  { label: "View Teams", description: "Manage your teams", icon: Activity, path: "/dashboard/teams" },
];

export default function Overview() {
  const navigate = useNavigate();
  const { data: userData } = useVerifySessionQuery();
  const { data: stats, isLoading, isError, refetch } = useGetOverviewStatsQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: allProjects = [] } = useGetProjectsQuery();

  const user = (userData as any) ?? {};
  const userName = user?.displayName || user?.name || "";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const totalProjects = stats?.projects ?? 0;
  const totalSecrets = stats?.secrets ?? 0;
  const totalEnvironments = stats?.environments ?? 0;
  const totalTeams = stats?.teams ?? 0;
  const recentProjects = stats?.recentProjects ?? [];
  const recentSecrets = stats?.recentSecrets ?? [];
  const hasData = totalProjects > 0 || totalTeams > 0;

  if (isLoading) {
    return (
      <div className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-100 dark:bg-white/[0.04] rounded-xl" />
          <div className="h-4 w-40 bg-gray-100 dark:bg-white/[0.04] rounded-xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-white/[0.04] rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-64 bg-gray-100 dark:bg-white/[0.04] rounded-2xl" />
            <div className="h-64 bg-gray-100 dark:bg-white/[0.04] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
            <AlertCircle className="w-7 h-7 text-accent" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">Failed to load overview</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6">Something went wrong. Please try again.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-colors inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="flex-1 p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#FAFAFA]">
              {greeting}{userName ? `, ${userName}` : ""}.
            </h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">Get started by creating your first project</p>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1 min-h-[400px]">
          <div className="flex flex-col items-center text-center max-w-md px-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">Welcome to Curo</h2>
            <p className="text-sm text-gray-500 dark:text-white/40 mb-8 leading-relaxed">
              Your secrets management platform. Create your first project to start managing secrets, environments, and teams securely.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
              className="cursor-pointer h-11 px-6 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-colors inline-flex items-center gap-2 glow-accent"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex-1 p-6 md:p-8 lg:p-10 space-y-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-[#FAFAFA]">
            {greeting}{userName ? `, ${userName}` : ""}.
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-1">
            Production Workspace &middot; {totalProjects} active project{totalProjects !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
            className="cursor-pointer h-10 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2 glow-accent"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Projects", value: totalProjects, icon: FolderKanban, change: `${totalProjects > 0 ? totalProjects : 0} total` },
          { label: "Secrets", value: totalSecrets, icon: KeyRound, change: `${totalSecrets > 0 ? totalSecrets : 0} managed` },
          { label: "Environments", value: totalEnvironments, icon: LayoutGrid, change: `${totalEnvironments > 0 ? totalEnvironments : 0} configured` },
          { label: "Teams", value: totalTeams, icon: Users, change: `${totalTeams} team${totalTeams !== 1 ? "s" : ""}` },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5 transition-all duration-200 hover:border-white/[0.10] hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide uppercase">{stat.label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-white/40" />
                </div>
              </div>
              <AnimatedNumber value={stat.value} />
              <p className="text-[11px] text-gray-400 dark:text-white/30 mt-1.5">{stat.change}</p>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2 space-y-6">
          <ActivityOverviewCard navigate={navigate} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Recent Projects</h3>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/projects")}
                  className="cursor-pointer text-[11px] font-medium text-gray-400 dark:text-white/30 hover:text-accent transition-colors"
                >
                  View all
                </button>
              </div>
              {recentProjects.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-white/30">No recent projects.</p>
              ) : (
                <div className="space-y-1">
                  {recentProjects.map((p: any) => (
                    <motion.div
                      key={p._id}
                      whileHover={{ x: 2 }}
                      onClick={() => navigate(`/dashboard/project/${p._id}`)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FolderKanban className="w-4 h-4 text-gray-500 dark:text-white/40" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{p.projectName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {p.teamId ? (
                              <span className="text-[10px] font-medium text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                                {p.teamName || "Team"}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-400 dark:text-white/30">Personal</span>
                            )}
                            <span className="text-[10px] text-gray-400 dark:text-white/30 flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDate(p.updatedAt, p._id)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Recent Secrets</h3>
              </div>
              {recentSecrets.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-white/30">No secrets yet.</p>
              ) : (
                <div className="space-y-1">
                  {recentSecrets.map((s: any) => (
                    <motion.div
                      key={s._id}
                      whileHover={{ x: 2 }}
                      onClick={() => navigate(`/dashboard/project/${s.projectId}`)}
                      className="flex items-center justify-between py-2.5 px-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
                          <KeyRound className="w-4 h-4 text-gray-500 dark:text-white/40" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{s.secName}</p>
                          <p className="text-[11px] text-gray-400 dark:text-white/30">{s.projectName}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 dark:text-white/30">{timeAgo(s.createdAt)}</span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {teams.length > 0 && (
            <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Your Teams</h3>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/teams")}
                  className="cursor-pointer text-[11px] font-medium text-gray-400 dark:text-white/30 hover:text-accent transition-colors"
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {teams.map((team: any) => {
                  const projectCount = allProjects.filter((p: any) => p.teamId === team._id).length;
                  const memberCount = team.memberCount || 0;
                  return (
                    <motion.div
                      key={team._id}
                      whileHover={{ y: -1 }}
                      onClick={() => navigate(`/dashboard/teams/${team._id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] border border-transparent hover:border-gray-300 dark:hover:border-white/[0.06]"
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-gray-500 dark:text-white/40" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{team.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-white/30">{memberCount} member{memberCount !== 1 ? "s" : ""} &middot; {projectCount} project{projectCount !== 1 ? "s" : ""}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 dark:text-white/20 flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div variants={item} className="space-y-6">
          <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      if ((action as any).action === "newProject") {
                        navigate(action.path, { state: { openNewProject: true } });
                      } else {
                        navigate(action.path);
                      }
                    }}
                    className="cursor-pointer w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group"
                  >
                    <Icon className="w-4 h-4 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">{action.label}</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">{action.description}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>




        </motion.div>
      </div>
    </motion.div>
  );
}

const actionColors: Record<string, string> = {
  created: "bg-[#30D158]",
  updated: "bg-[#FF9F0A]",
  rotated: "bg-[#FF9F0A]",
  deleted: "bg-[#FF3B30]",
  synced: "bg-[#007AFF]",
  deployed: "bg-[#30D158]",
};

function ActivityOverviewCard({ navigate }: { navigate: (path: string) => void }) {
  const { entries } = useActivityFeed();
  const recent = entries.slice(0, 5);

  return (
    <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Activity</h3>
          <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Latest {Math.min(recent.length, 5)} of {entries.length} events</p>
        </div>
        {entries.length > 0 && (
          <button
            type="button"
            onClick={() => navigate("/dashboard/activity")}
            className="cursor-pointer text-[11px] font-medium text-gray-400 dark:text-white/30 hover:text-accent transition-colors"
          >
            View all
          </button>
        )}
      </div>
      <div className="space-y-0.5">
        {recent.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-white/30 py-2">No recent activity.</p>
        ) : (
          recent.map((entry, i) => (
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => {
                if (entry.projectId) navigate(`/dashboard/project/${entry.projectId}`);
                else if (entry.teamId) navigate(`/dashboard/teams/${entry.teamId}`);
              }}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-150 group cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${actionColors[entry.action] || "bg-gray-400 dark:bg-white/30"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 dark:text-white/70 truncate">
                  {entry.description}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 capitalize">
                    {entry.entityType}
                  </span>
                  {entry.projectName && (
                    <span className="text-[10px] text-gray-400 dark:text-white/30">{entry.projectName}</span>
                  )}
                </div>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-white/30 flex-shrink-0">{timeAgo(entry.createdAt)}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

