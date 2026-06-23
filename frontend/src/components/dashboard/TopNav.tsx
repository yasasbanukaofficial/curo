import { Search, Bell, Command } from "lucide-react";
import DashboardButton from "./DashboardButton";
import CuroLogo from "../landing/CuroLogo";

export default function TopNav() {
  return (
    <header className="flex items-center h-14 px-6 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-[#222] transition-colors duration-200">
      <div className="flex-1 flex items-center">
        <CuroLogo size="sm" />
      </div>

      <div className="relative w-full max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
        <input
          type="text"
          placeholder="Search secrets, projects, integrations..."
          className="w-full h-9 pl-10 pr-12 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border-none outline-none text-[#1D1D1F] dark:text-[#E5E5E5] placeholder-[#8E8E93] dark:placeholder-[#666] transition-colors duration-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] font-medium text-[#8E8E93] dark:text-[#666]">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3">
        <DashboardButton className="relative w-9 h-9 rounded-xl text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#FF3B30] rounded-full" />
        </DashboardButton>

        <DashboardButton className="w-9 h-9 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#1D1D1F] dark:text-[#E5E5E5] font-semibold text-sm hover:shadow-sm">
          YB
        </DashboardButton>
      </div>
    </header>
  );
}
