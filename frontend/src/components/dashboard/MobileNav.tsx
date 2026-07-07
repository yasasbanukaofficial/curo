import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  KeyRound,
  UserCircle,
  Settings,
  Sun,
} from "lucide-react";
import { useTheme } from "../../pages/dashboard/DashboardLayout";
import DashboardButton from "./DashboardButton";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Projects", icon: FolderKanban, path: "/dashboard/projects" },
  { label: "Teams", icon: Users, path: "/dashboard/teams" },
  { label: "Secrets", icon: KeyRound, path: "/dashboard/secrets" },
];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggle } = useTheme();
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-xl border-t border-gray-200 dark:border-white/[0.06] flex items-center justify-around px-2 transition-colors duration-200">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = item.path && (location.pathname === item.path
          || (item.path === "/dashboard" && location.pathname === "/dashboard/overview")
          || (item.path === "/dashboard" && location.pathname === "/dashboard"));
        return (
          <DashboardButton
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-2 rounded-none ${
              active
                ? "text-accent"
                : "text-gray-500 dark:text-white/40"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">
              {item.label}
            </span>
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-accent rounded-b-full" />
            )}
          </DashboardButton>
        );
      })}

      <div ref={ref} className="relative flex items-center h-full">
        <DashboardButton
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex flex-col items-center justify-center gap-0.5 h-full min-w-0 px-2 rounded-none ${
            menuOpen || location.pathname === "/dashboard/account" || location.pathname === "/dashboard/settings"
              ? "text-accent"
              : "text-gray-500 dark:text-white/40"
          }`}
        >
          <div className="w-5 h-5 rounded-md bg-accent/20 flex items-center justify-center text-[9px] font-semibold text-accent">
            U
          </div>
          <span className="text-[10px] font-medium leading-none">Profile</span>
        </DashboardButton>

        {menuOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-44 bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-white/[0.06] shadow-lg py-1 z-50">
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate("/dashboard/account"); }}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-900 dark:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-150 text-left"
            >
              <UserCircle className="w-4 h-4 text-gray-500 dark:text-white/40" />
              Account
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); navigate("/dashboard/settings"); }}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-900 dark:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-150 text-left"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-white/40" />
              Settings
            </button>
            <button
              type="button"
              onClick={() => { setMenuOpen(false); toggle(); }}
              className="cursor-pointer flex items-center gap-2 w-full px-3 py-2.5 text-sm text-gray-900 dark:text-[#FAFAFA] hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-150 text-left"
            >
              <Sun className="w-4 h-4 text-gray-500 dark:text-white/40" />
              Theme
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
