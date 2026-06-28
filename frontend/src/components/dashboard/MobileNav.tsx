import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  ScrollText,

  UserCircle,
  Settings,
  Sun,
} from "lucide-react";
import DashboardButton from "./DashboardButton";

const user = {
  initials: "U",
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard/overview" },
  { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
  { label: "Teams", icon: Users, path: "/dashboard/teams" },
  { label: "Secrets", icon: KeyRound, path: "/dashboard/secrets" },

  { label: "Audit", icon: ScrollText, path: "/dashboard/audits" },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-[#111]/90 backdrop-blur-xl border-t border-black/[0.04] dark:border-[#222] flex items-center justify-around px-2 safe-area-bottom transition-colors duration-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.path && (location.pathname === item.path
          || (item.path === "/dashboard/overview" && location.pathname === "/dashboard"));
        return (
          <DashboardButton
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-2 rounded-none ${
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
          </DashboardButton>
        );
      })}

      <div ref={ref} className="relative flex items-center h-full">
        <DashboardButton
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-2 rounded-none ${
            menuOpen || location.pathname === "/dashboard/account" || location.pathname === "/dashboard/settings"
              ? "text-[#1D1D1F] dark:text-[#E5E5E5]"
              : "text-[#8E8E93] dark:text-[#666]"
          }`}
        >
          <div className="w-5 h-5 rounded-md bg-[#1D1D1F] dark:bg-white flex items-center justify-center text-[9px] font-semibold text-white dark:text-[#1D1D1F]">
            {user.initials}
          </div>
          <span className="text-[10px] font-medium leading-none">Profile</span>
        </DashboardButton>

        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-44 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-1 z-50">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate("/dashboard/account"); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333] transition-colors duration-150 text-left"
            >
              <UserCircle className="w-4 h-4 text-[#8E8E93]" />
              Account
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate("/dashboard/settings"); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333] transition-colors duration-150 text-left"
            >
              <Settings className="w-4 h-4 text-[#8E8E93]" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate("/dashboard/settings"); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#333] transition-colors duration-150 text-left"
            >
              <Sun className="w-4 h-4 text-[#8E8E93]" />
              Theme
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
