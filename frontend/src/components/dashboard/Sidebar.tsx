import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardButton from "./DashboardButton";
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
} from "lucide-react";

const projects = ["Acme Production", "Acme Staging", "Main App"];

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

const bottomNav = [
  { label: "Account", icon: UserCircle, path: "/dashboard/account" },
  { label: "Settings", icon: Settings, path: "" },
];

function ProjectSwitcher() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(projects[0]);
  const ref = useRef<HTMLDivElement>(null);

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

interface SidebarProps {
  onToggleSettings: (open: boolean) => void;
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
        <nav className="space-y-0.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const active = item.path ? location.pathname === item.path : false;
            return (
              <DashboardButton
                key={item.label}
                onClick={() => {
                  if (item.path) navigate(item.path);
                  else if (item.label === "Settings") onToggleSettings(true);
                }}
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
        </nav>
      </div>

    </aside>
  );
}
