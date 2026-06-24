import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  ScrollText,
  UserCircle,
  Settings,
} from "lucide-react";

interface MobileNavProps {
  onOpenSettings: () => void;
}

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard/overview" },
  { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
  { label: "Teams", icon: Users, path: "/dashboard/teams" },
  { label: "Secrets", icon: KeyRound, path: "/dashboard/secrets" },
  { label: "Audit", icon: ScrollText, path: "/dashboard/audits" },
  { label: "Account", icon: UserCircle, path: "/dashboard/account" },
  { label: "Settings", icon: Settings, path: "" },
];

export default function MobileNav({ onOpenSettings }: MobileNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border-t border-black/[0.04] dark:border-[#222] flex items-center justify-around px-2 safe-area-bottom transition-colors duration-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.path && (location.pathname === item.path
          || (item.path === "/dashboard/overview" && location.pathname === "/dashboard"));
        return (
          <button
            key={item.label}
            onClick={() => {
              if (item.path) navigate(item.path);
              else onOpenSettings();
            }}
            className={`flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-2 transition-colors duration-200 cursor-pointer ${
              active
                ? "text-[#1D1D1F] dark:text-[#E5E5E5]"
                : "text-[#8E8E93] dark:text-[#666]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#1D1D1F] dark:bg-[#E5E5E5] rounded-b-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
