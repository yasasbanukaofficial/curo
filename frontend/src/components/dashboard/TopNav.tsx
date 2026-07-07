import { Search, Sun, Moon } from "lucide-react";
import Logo from "../ui/Logo";
import { useTheme } from "../../pages/dashboard/DashboardLayout";

declare global {
  interface Window { __toggleSearch?: () => void; }
}

export default function TopNav() {
  const { theme, toggle } = useTheme();

  return (
    <header className="relative z-40 flex items-center h-14 px-4 md:px-6 bg-white dark:bg-[#09090B] border-b border-gray-200 dark:border-white/[0.06]">
      <div className="flex items-center gap-3">
        <Logo size="sm" />
      </div>

      <div className="flex-1 flex justify-center px-4">
        <button
          type="button"
          onClick={() => window.__toggleSearch?.()}
          className="cursor-pointer hidden md:flex items-center gap-2 w-full max-w-md h-9 px-3 text-sm rounded-xl bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.08] text-gray-500 dark:text-white/50 hover:text-accent transition-all duration-200 border border-transparent hover:border-gray-300 dark:hover:border-white/[0.06]"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Search</span>
          <kbd className="flex items-center gap-0.5 text-[10px] text-gray-400 dark:text-white/30 ml-auto bg-gray-200 dark:bg-white/[0.04] px-1.5 py-0.5 rounded">
            Ctrl+F
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={toggle}
          className="cursor-pointer inline-flex items-center rounded-full border border-gray-200 dark:border-white/[0.06] p-1 overflow-hidden hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors"
          aria-label="Toggle Theme"
        >
          <Sun className={`size-7 p-1.5 text-[#636363] dark:text-accent rounded-full ${theme === "dark" ? "" : "bg-accent/10"}`} />
          <Moon className={`size-7 p-1.5 text-accent dark:text-[#636363] rounded-full ${theme === "dark" ? "bg-accent/10" : ""}`} />
        </button>
      </div>
    </header>
  );
}
