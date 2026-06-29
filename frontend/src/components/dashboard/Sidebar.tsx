import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardButton from "./DashboardButton";
import AlertModal from "./AlertModal";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  UserCircle,
  Sun,
  LogOut,
  Plus,
} from "lucide-react";
import { useVerifySessionQuery, useLogoutMutation, clearCredentials, baseApi } from "../../store";
import { useAppDispatch } from "../../app/store";
import { useGetTeamsQuery } from "../../store";

function useActiveTeamId() {
  const { data: teams = [] } = useGetTeamsQuery();
  const activeTeamId = sessionStorage.getItem("activeTeamId");
  const fallbackTeamId = activeTeamId && teams.find((t) => t._id === activeTeamId) ? activeTeamId : (teams[0]?._id || "");
  return fallbackTeamId;
}

function ProjectSwitcher() {
  const navigate = useNavigate();

  return (
    <DashboardButton
      onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
      className="w-full h-10 px-3 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] justify-start"
    >
      <Plus className="w-4 h-4" />
      Create new project
    </DashboardButton>
  );
}

interface UserDropdownProps {
  onToggleSettings: (tab?: string) => void;
}

function UserCard({ onToggleSettings }: UserDropdownProps) {
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
  const emailVerified = user?.emailVerified ?? user?.isEmailVerified ?? false;

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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A] transition-colors duration-200 text-left"
      >
        <div className="w-8 h-8 rounded-lg bg-[#1D1D1F] dark:bg-white flex items-center justify-center text-xs font-semibold text-white dark:text-[#1D1D1F] flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{userName}</p>
          <p className="text-[11px] text-[#8E8E93] dark:text-[#666] truncate">{userEmail}</p>
        </div>
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-1.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-3 z-50">
          <div className="px-4 pb-3 mb-2 border-b border-black/[0.04] dark:border-[#222]">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-[#1D1D1F] dark:bg-white flex items-center justify-center text-sm font-semibold text-white dark:text-[#1D1D1F] flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{userName}</p>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{userEmail}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {emailVerified && (
                <span className="inline-block text-[9px] font-semibold px-2 py-0.5 rounded-md bg-[#30D158]/10 text-[#30D158]">
                  Verified
                </span>
              )}
            </div>
          </div>

          <div className="px-1.5 space-y-0.5">
            <DashboardButton
              onClick={() => { setOpen(false); onToggleSettings("account"); }}
              className="w-full h-9 px-3 text-sm rounded-lg justify-start text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333]"
            >
              <UserCircle className="w-4 h-4" />
              Account
            </DashboardButton>
            <DashboardButton
              onClick={() => { setOpen(false); onToggleSettings("general"); }}
              className="w-full h-9 px-3 text-sm rounded-lg justify-start text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333]"
            >
              <Settings className="w-4 h-4" />
              Settings
            </DashboardButton>
            <DashboardButton
              onClick={() => { setOpen(false); onToggleSettings("general"); }}
              className="w-full h-9 px-3 text-sm rounded-lg justify-start text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333]"
            >
              <Sun className="w-4 h-4" />
              Theme
            </DashboardButton>
          </div>

          <div className="mt-2 pt-2 border-t border-black/[0.04] dark:border-[#222] px-1.5">
            <DashboardButton
              onClick={() => { setOpen(false); setShowLogoutModal(true); }}
              className="w-full h-9 px-3 text-sm rounded-lg justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </DashboardButton>
          </div>
        </div>
      )}

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

interface SidebarProps {
  onToggleSettings: (tab?: string) => void;
}

export default function Sidebar({ onToggleSettings }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const teamId = useActiveTeamId();
  const navSections = [
    {
      label: "Workspace",
      items: [
        { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
        { label: "Teams", icon: Users, path: `/dashboard/teams/${teamId}` },
        { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
      ],
    },
  ];

  return (
    <aside className="hidden lg:flex w-[280px] bg-white dark:bg-[#111] border-r border-black/[0.04] dark:border-[#222] flex-col flex-shrink-0 transition-colors duration-200">
      <div className="px-5 pt-5 pb-4">
        <ProjectSwitcher />
      </div>

      <nav className="flex-1 px-3 overflow-y-auto space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-2 mb-1.5 text-[10px] font-medium text-[#8E8E93] dark:text-[#666] tracking-[0.08em] uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path
                  || (item.path === "/dashboard/overview" && location.pathname === "/dashboard");
                return (
                  <DashboardButton
                    key={item.label}
                    id={`sidenav-${item.label.toLowerCase()}`}
                    onClick={() => navigate(item.path)}
                    className={`w-full h-10 px-3 text-sm rounded-xl justify-start ${
                      active
                        ? "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#1D1D1F] dark:text-[#E5E5E5] font-medium"
                        : "text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </DashboardButton>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 pt-3 pb-5 border-t border-black/[0.04] dark:border-[#222]">
        <UserCard onToggleSettings={onToggleSettings} />
      </div>
    </aside>
  );
}
