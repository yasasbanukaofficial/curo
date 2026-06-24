import { Bell } from "lucide-react";
import { useState } from "react";
import DashboardButton from "./DashboardButton";
import SearchInput from "./SearchInput";
import CuroLogo from "../landing/CuroLogo";

export default function TopNav() {
  const [search, setSearch] = useState("");

  return (
    <header className="flex items-center h-16 px-4 md:px-6 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl border-b border-black/[0.04] dark:border-[#222] transition-colors duration-200">
      <div className="flex items-center">
        <CuroLogo size="sm" />
      </div>

      <div className="flex-1 flex justify-center px-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search secrets, projects, integrations..." />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <DashboardButton className="relative w-9 h-9 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#FF3B30] rounded-full" />
        </DashboardButton>

        <DashboardButton className="w-9 h-9 rounded-[10px] bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#1D1D1F] dark:text-[#E5E5E5] font-semibold text-sm hover:shadow-sm">
          YB
        </DashboardButton>
      </div>
    </header>
  );
}
