import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderKanban, Users, KeyRound, LayoutDashboard, PlugZap, ArrowRight, Sun, Plus, Activity } from "lucide-react";
import { useGetProjectsQuery, useGetTeamsQuery } from "../../store";
import { useTheme } from "../../pages/dashboard/DashboardLayout";

declare global {
  interface Window { __toggleSearch?: () => void; }
}

interface SearchResult {
  id: string;
  label: string;
  description: string;
  icon: typeof FolderKanban;
  path: string;
  type: "command" | "project" | "team";
  action?: "toggleTheme" | "openCreateProject" | "openCreateTeam";
}

export default function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const openRef = useRef(open);
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  const staticCommands: SearchResult[] = useMemo(() => [
    { id: "overview", label: "Go to Overview", description: "View your dashboard overview", icon: LayoutDashboard, path: "/dashboard", type: "command" },
    { id: "projects", label: "Go to Projects", description: "View all projects", icon: FolderKanban, path: "/dashboard/projects", type: "command" },
    { id: "secrets", label: "Go to Secrets", description: "View all secrets", icon: KeyRound, path: "/dashboard/secrets", type: "command" },
    { id: "teams", label: "Go to Teams", description: "View all teams", icon: Users, path: "/dashboard/teams", type: "command" },
    { id: "integrations", label: "Go to Integrations", description: "Manage integrations", icon: PlugZap, path: "/dashboard/integrations", type: "command" },
    { id: "activity", label: "Go to Activity", description: "View activity log", icon: Activity, path: "/dashboard/activity", type: "command" },
    { id: "account", label: "Go to Account", description: "Your account settings", icon: Users, path: "/dashboard/account", type: "command" },
    { id: "toggle-theme", label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode", description: "Toggle between light and dark theme", icon: Sun, path: "", type: "command", action: "toggleTheme" },
    { id: "new-project", label: "Create Project", description: "Create a new project", icon: Plus, path: "/dashboard/projects", type: "command", action: "openCreateProject" },
    { id: "new-team", label: "Create Team", description: "Create a new team", icon: Plus, path: "/dashboard/teams", type: "command", action: "openCreateTeam" },
  ], [theme]);

  openRef.current = open;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "f")) {
        e.preventDefault();
        setOpen((prev) => !prev);
        if (!openRef.current) { setSearch(""); setSelectedIndex(0); }
      }
      if (e.key === "Escape" && openRef.current) setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const { data: projects = [] } = useGetProjectsQuery();
  const { data: teams = [] } = useGetTeamsQuery();

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const projectResults: SearchResult[] = useMemo(() =>
    projects.map((p) => ({
      id: `project-${p._id}`,
      label: p.projectName,
      description: `${p.secretCount || 0} secrets`,
      icon: FolderKanban,
      path: `/dashboard/project/${p._id}`,
      type: "project" as const,
    })),
    [projects]
  );

  const teamResults: SearchResult[] = useMemo(() =>
    teams.map((t) => ({
      id: `team-${t._id}`,
      label: t.name,
      description: t.slug,
      icon: Users,
      path: `/dashboard/teams/${t._id}`,
      type: "team" as const,
    })),
    [teams]
  );

  const allResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    const items = [...staticCommands, ...projectResults, ...teamResults];
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [search, projectResults, teamResults, staticCommands]);

  const execute = useCallback((item: SearchResult) => {
    setOpen(false);
    setSearch("");
    if (item.action === "toggleTheme") {
      toggle();
      return;
    }
    if (item.action === "openCreateProject") {
      navigate(item.path, { state: { openNewProject: true } });
      return;
    }
    if (item.action === "openCreateTeam") {
      navigate(item.path, { state: { openNewTeam: true } });
      return;
    }
    navigate(item.path);
  }, [navigate, toggle]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allResults.length) % allResults.length);
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      execute(allResults[selectedIndex]);
    }
  };

  window.__toggleSearch = () => {
    setOpen((prev) => !prev);
    if (!openRef.current) { setSearch(""); setSelectedIndex(0); }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-white dark:bg-[#18181B] rounded-2xl border border-gray-200 dark:border-white/[0.06] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 h-12 border-b border-gray-200 dark:border-white/[0.06]">
              <Search className="w-4 h-4 text-gray-400 dark:text-white/40 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search projects, teams, commands..."
                className="flex-1 bg-transparent text-sm text-gray-900 dark:text-[#FAFAFA] placeholder-gray-400 dark:placeholder-white/30 outline-none"
              />
              <kbd className="flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
                esc
              </kbd>
            </div>

            <div className="max-h-[360px] overflow-y-auto py-2">
              {allResults.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-white/40">No results found for "<span className="text-gray-700 dark:text-white/60">{search}</span>"</p>
                </div>
              ) : (
                allResults.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => execute(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`cursor-pointer flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors duration-100 ${
                        isSelected ? "bg-gray-100 dark:bg-white/[0.06]" : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-accent/20 text-accent" : "bg-gray-100 dark:bg-white/[0.04] text-gray-400 dark:text-white/40"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isSelected ? "text-gray-900 dark:text-[#FAFAFA]" : "text-gray-700 dark:text-white/70"
                        }`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-white/40 truncate">{item.description}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${
                        item.type === "command"
                          ? "text-gray-400 dark:text-white/30 bg-gray-100 dark:bg-white/[0.04]"
                          : item.type === "project"
                          ? "text-accent/80 bg-accent/10"
                          : "text-[#3B82F6]/80 bg-[#3B82F6]/10"
                      }`}>
                        {item.type === "command" ? "Page" : item.type === "project" ? "Project" : "Team"}
                      </span>
                      {isSelected && (
                        <ArrowRight className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-white/30">
                <kbd className="bg-gray-100 dark:bg-white/[0.04] px-1 rounded text-gray-500 dark:text-white/40">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-white/30">
                <kbd className="bg-gray-100 dark:bg-white/[0.04] px-1 rounded text-gray-500 dark:text-white/40">↵</kbd>
                <span>Open</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-white/30">
                <kbd className="bg-gray-100 dark:bg-white/[0.04] px-1 rounded text-gray-500 dark:text-white/40">Esc</kbd>
                <span>Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
