import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import TopNav from "../../components/dashboard/TopNav";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileNav from "../../components/dashboard/MobileNav";
import SettingsModal from "../../components/dashboard/SettingsModal";

function DashboardInner() {
  const { theme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className={`h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col overflow-hidden transition-colors duration-200 ${theme}`}>
      <TopNav />

      <div className="flex flex-1 min-h-0">
        <Sidebar showSettings={showSettings} onToggleSettings={setShowSettings} />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <MobileNav onOpenSettings={() => setShowSettings(true)} />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  );
}
