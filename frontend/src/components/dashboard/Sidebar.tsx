import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardButton from "./DashboardButton";
import AlertModal from "./AlertModal";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  UserCircle,
  LogOut,
  Activity,
  ChevronDown,
  Command,
} from "lucide-react";
import { useVerifySessionQuery, useLogoutMutation, clearCredentials, baseApi } from "../../store";
import { useAppDispatch } from "../../app/store";

const navItems: ({ label: string; icon: any; path: string; shortcut: string; hasSub?: boolean; sub?: boolean })[] = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard", shortcut: "1" },
  { label: "Projects", icon: FolderKanban, path: "/dashboard/projects", shortcut: "2", hasSub: true },
  { label: "Secrets", icon: KeyRound, path: "/dashboard/secrets", shortcut: "3", sub: true },
  { label: "Teams", icon: Users, path: "/dashboard/teams", shortcut: "4" },
  { label: "Activity", icon: Activity, path: "/dashboard/activity", shortcut: "5" },
  { label: "Integrations", icon: Command, path: "/dashboard/integrations", shortcut: "6" },
];

function SidebarUserCard() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: userData } = useVerifySessionQuery();
  const [logout] = useLogoutMutation();

  const user = (userData as any) ?? null;
  const userName = user?.displayName || user?.name || user?.email?.split("@")[0] || "";
  const userEmail = user?.email || "";

  const initials = useMemo(() => {
    if (userName) {
      return userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (userEmail) return userEmail[0].toUpperCase();
    return "?";
  }, [userName, userEmail]);

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
    }
    dispatch(clearCredentials());
    sessionStorage.removeItem("activeTeamId");
    dispatch(baseApi.util.resetApiState());
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative px-3 py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 text-left group"
      >
        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-xs font-semibold text-accent flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{userName}</p>
          <p className="text-[11px] text-gray-500 dark:text-white/40 truncate">{userEmail}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-white/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-3 right-3 mb-2 bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-white/[0.06] shadow-xl py-2 z-50"
          >
            <div className="px-3 pb-2 mb-2 border-b border-gray-200 dark:border-white/[0.06]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center text-sm font-semibold text-accent flex-shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">{userName}</p>
                  <p className="text-[11px] text-gray-500 dark:text-white/40">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="px-1.5 space-y-0.5">
              <DashboardButton
                onClick={() => { setOpen(false); navigate("/dashboard/account"); }}
                className="w-full h-9 px-3 text-sm rounded-lg justify-start text-gray-500 dark:text-white/50 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04]"
              >
                <UserCircle className="w-4 h-4" />
                Account
              </DashboardButton>

            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-white/[0.06] px-1.5">
              <DashboardButton
                onClick={() => { setOpen(false); setShowLogoutModal(true); }}
                className="w-full h-9 px-3 text-sm rounded-lg justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </DashboardButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AlertModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        variant="warning"
        title="Log out"
        message="Are you sure you want to log out? You will need to sign in again to access your account."
        buttons={[
          { label: "Cancel", onClick: () => setShowLogoutModal(false), variant: "secondary" },
          { label: "Log out", onClick: () => { setShowLogoutModal(false); handleLogout(); }, variant: "destructive" },
        ]}
      />
    </div>
  );
}

function NavLink({ item, active, expanded, onToggle }: { item: typeof navItems[0]; active: boolean; expanded?: boolean; onToggle?: () => void }) {
  const navigate = useNavigate();
  const Icon = item.icon;
  const isSub = "sub" in item && item.sub;
  const hasSub = "hasSub" in item && item.hasSub;

  function handleClick() {
    if (hasSub && onToggle) {
      onToggle();
    }
    navigate(item.path);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative w-full group cursor-pointer"
    >
      <div className={`relative flex items-center gap-3 h-10 mx-2 rounded-xl text-sm transition-all duration-200 justify-start ${
        isSub ? "pl-10" : "px-3"
      }`}
        style={{
          backgroundColor: active ? "rgba(255, 51, 51, 0.08)" : "transparent",
        }}
      >
        {active && !isSub && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full"
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
          />
        )}
        {active && isSub && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full" />
        )}
        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
          active ? "text-accent" : "text-gray-400 dark:text-white/40 group-hover:text-accent"
        }`} />
        <span className={`transition-colors duration-200 ${
          active ? "text-gray-900 dark:text-[#FAFAFA] font-medium" : "text-gray-500 dark:text-white/50 group-hover:text-accent"
        }`}>
          {item.label}
        </span>
        {hasSub && (
          <ChevronDown className={`w-3.5 h-3.5 ml-auto text-gray-400 dark:text-white/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
        )}
      </div>
    </button>
  );
}

interface SidebarProps {
  onToggleSettings: (tab?: string) => void;
}

export default function Sidebar({ onToggleSettings }: SidebarProps) {
  const location = useLocation();
  const [projectsExpanded, setProjectsExpanded] = useState(false);

  const activePath = useMemo(() => {
    const path = location.pathname;
    if (path === "/dashboard" || path === "/dashboard/overview") return "/dashboard";
    if (path.startsWith("/dashboard/project")) return "/dashboard/projects";
    if (path === "/dashboard/secrets") return "/dashboard/secrets";
    if (path === "/dashboard/activity") return "/dashboard/activity";
    if (path.startsWith("/dashboard/teams")) return "/dashboard/teams";
    if (path.startsWith("/dashboard/integrations")) return "/dashboard/integrations";
    if (path.startsWith("/dashboard/settings") || path.startsWith("/dashboard/account")) return "/dashboard/settings";
    return path;
  }, [location.pathname]);

  useEffect(() => {
    if (activePath === "/dashboard/secrets" || activePath === "/dashboard/projects") {
      setProjectsExpanded(true);
    }
  }, [activePath]);

  return (
    <aside className="hidden lg:flex w-[260px] bg-white dark:bg-[#09090B] border-r border-gray-200 dark:border-white/[0.06] flex-col flex-shrink-0">
      <nav className="flex-1 py-4 mt-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.sub) {
            if (!projectsExpanded) return null;
            return <NavLink key={item.label} item={item} active={activePath === item.path} />;
          }
          return (
            <NavLink
              key={item.label}
              item={item}
              active={item.hasSub ? activePath === "/dashboard/projects" : activePath === item.path}
              expanded={projectsExpanded}
              onToggle={() => setProjectsExpanded(!projectsExpanded)}
            />
          );
        })}
      </nav>

      <SidebarUserCard />
    </aside>
  );
}
