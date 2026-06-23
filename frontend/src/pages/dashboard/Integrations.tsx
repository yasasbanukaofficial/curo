import { PlugZap, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import { SiGithub, SiSlack, SiVercel, SiRailway, SiConfluence, SiNotion, SiLinear, SiGoogledocs } from "react-icons/si";
import { FaAws } from "react-icons/fa";

const integrations = [
  { name: "GitHub", icon: <SiGithub />, connected: true, color: "#24292e", desc: "Sync secrets on push" },
  { name: "Slack", icon: <SiSlack />, connected: true, color: "#4A154B", desc: "Alert on secret rotation" },
  { name: "Vercel", icon: <SiVercel />, connected: false, color: "#000000", desc: "Inject env at deploy" },
  { name: "Notion", icon: <SiNotion />, connected: false, color: "#000000", desc: "Document your vault" },
  { name: "Linear", icon: <SiLinear />, connected: true, color: "#5E6AD2", desc: "Track secret requests" },
  { name: "Google Docs", icon: <SiGoogledocs />, connected: false, color: "#4285F4", desc: "Export audit reports" },
  { name: "AWS", icon: <FaAws />, connected: false, color: "#FF9900", desc: "Secrets Manager sync" },
  { name: "Railway", icon: <SiRailway />, connected: false, color: "#0B0D0E", desc: "Deploy with secrets" },
  { name: "Confluence", icon: <SiConfluence />, connected: false, color: "#172B4D", desc: "Wiki integration" },
];

export default function Integrations() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Integrations</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {integrations.filter((i) => i.connected).length} connected · {integrations.filter((i) => !i.connected).length} available
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <DashboardCard key={item.name} hover padding="md">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{
                  background: item.connected ? `${item.color}15` : "#F5F5F7",
                  color: item.connected ? item.color : "#8E8E93",
                }}
              >
                {item.icon}
              </div>
              {item.connected
                ? <CheckCircle className="w-5 h-5 text-[#30D158] flex-shrink-0" />
                : <XCircle className="w-5 h-5 text-[#8E8E93] flex-shrink-0" />
              }
            </div>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">{item.name}</h3>
            <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">{item.desc}</p>
            <DashboardButton
              className={`w-full h-8 text-xs font-medium rounded-xl ${
                item.connected
                  ? "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#eee] dark:hover:bg-[#222]"
                  : "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
              }`}
            >
              {item.connected ? (
                <><ExternalLink className="w-3 h-3" /> Configure</>
              ) : (
                <><PlugZap className="w-3 h-3" /> Connect</>
              )}
            </DashboardButton>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
