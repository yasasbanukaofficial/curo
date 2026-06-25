import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import TopNav from "../../components/dashboard/TopNav";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileNav from "../../components/dashboard/MobileNav";
import SettingsModal from "../../components/dashboard/SettingsModal";
import type { SettingsTab } from "../../components/dashboard/SettingsModal";

function DashboardInner() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("general");

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) return;

    if (location.pathname === "/dashboard/account") {
      setSettingsTab("account");
      setShowSettings(true);
      navigate("/dashboard", { replace: true });
    } else if (location.pathname === "/dashboard/settings") {
      setSettingsTab("general");
      setShowSettings(true);
      navigate("/dashboard", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className={`h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col overflow-hidden transition-colors duration-200 ${theme}`}>
      <TopNav />

      <div className="flex flex-1 min-h-0">
        <Sidebar onToggleSettings={(tab) => { setSettingsTab(tab); setShowSettings(true); }} />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      <MobileNav />
      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} initialTab={settingsTab} />
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
