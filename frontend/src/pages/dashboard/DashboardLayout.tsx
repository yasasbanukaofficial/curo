import { Outlet } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import TopNav from "../../components/dashboard/TopNav";
import Sidebar from "../../components/dashboard/Sidebar";

function DashboardInner() {
  const { theme } = useTheme();

  return (
    <div className={`h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col overflow-hidden transition-colors duration-200 ${theme}`}>
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <Outlet />
      </div>
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
