import TopNav from "../components/dashboard/TopNav";
import Sidebar from "../components/dashboard/Sidebar";
import AnalyticsOverview from "../components/dashboard/AnalyticsOverview";

export default function DashboardPage() {
  return (
    <div className="h-screen bg-[#F0F0F0] flex flex-col overflow-hidden">
      <TopNav />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <AnalyticsOverview />
      </div>
    </div>
  );
}
