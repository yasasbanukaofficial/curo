import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import TopNav from "../components/dashboard/TopNav";
import Sidebar from "../components/dashboard/Sidebar";
import AnalyticsOverview from "../components/dashboard/AnalyticsOverview";

function DashboardInner() {
  const { theme } = useTheme();

  return (
    <div className={`h-screen bg-[#F0F0F0] dark:bg-[#111] flex flex-col overflow-hidden ${theme}`}>
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <AnalyticsOverview />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  );
}
