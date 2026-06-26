import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useLogoutMutation } from "../../features/auth/authApi";
import { logout as logoutAction, selectUser } from "../../features/auth/authSlice";
import DashboardButton from "./DashboardButton";
import AlertModal from "./AlertModal";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  Layers3,
  PlugZap,
  ScrollText,
  Settings,
  UserCircle,
  ChevronDown,
  Check,
  Sun,
  LogOut,
  Plus,
} from "lucide-react";

const projects: string[] = [];

const navSections = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, path: "/dashboard/overview" },
      { label: "Teams", icon: Users, path: "/dashboard/teams" },
      { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
    ],
  },
  {
    label: "Management",
    items: [
      { label: "Secrets", icon: KeyRound, path: "/dashboard/secrets" },
      { label: "Environments", icon: Layers3, path: "/dashboard/environments" },
      { label: "Integrations", icon: PlugZap, path: "/dashboard/integrations" },
      { label: "Audit Logs", icon: ScrollText, path: "/dashboard/audits" },
    ],
  },
];

function ProjectSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(projects[0] ?? "");
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (projects.length === 0) {
    return (
      <DashboardButton
        onClick={() => navigate("/dashboard/projects", { state: { openNewProject: true } })}
        className="w-full h-10 px-3 text-sm font-medium text-[#1D1D1F] bg-white hover:bg-[#F5F5F7] rounded-xl border border-black/20 justify-start"
      >
        <Plus className="w-4 h-4" />
        Create new project
      </DashboardButton>
    );
  }

  return (
    <div ref={ref} className="relative">
      <DashboardButton
        onClick={() => setOpen(!open)}
        className="w-full h-10 px-3 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] justify-between"
      >
        <span className="truncate">{selected}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#8E8E93] flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </DashboardButton>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-1 z-50 transition-colors duration-200">
          {projects.map((p) => (
            <DashboardButton
              key={p}
              onClick={() => {
                setSelected(p);
                setOpen(false);
              }}
              className={`w-full h-9 px-3 text-sm rounded-lg justify-start ${
                p === selected
                  ? "bg-[#F5F5F7] dark:bg-[#333] text-[#1D1D1F] dark:text-[#E5E5E5] font-medium"
                  : "text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333]"
              }`}
            >
              <span className="flex-1 text-left">{p}</span>
              {p === selected && <Check className="w-3.5 h-3.5 text-[#1D1D1F] dark:text-[#E5E5E5]" />}
            </DashboardButton>
          ))}
        </div>
      )}
    </div>
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
  const [doLogout] = useLogoutMutation();
  const user = useAppSelector(selectUser);
  const initials = useMemo(() => {
    if (!user?.name) return "?";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.name]);

  async function handleLogout() {
    await doLogout();
    dispatch(logoutAction());
    navigate("/");
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
          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{user?.name || ""}</p>
          <p className="text-[11px] text-[#8E8E93] dark:text-[#666] truncate">{user?.email || ""}</p>
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
                <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{user?.name || ""}</p>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{user?.email || ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user?.emailVerified && (
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
