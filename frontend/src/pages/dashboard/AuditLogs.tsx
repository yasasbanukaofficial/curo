import { useState } from "react";
import { Download } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import FilterTabs from "../../components/dashboard/FilterTabs";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { ActionBadge, EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";

const logs = [
  { action: "updated", target: "DATABASE_URL", user: "Yasas", role: "Admin", env: "production", time: "2m ago" },
  { action: "rotated", target: "OPENAI_API_KEY", user: "System", role: "Automation", env: "staging", time: "5m ago" },
  { action: "created", target: "JWT_SECRET", user: "Yasas", role: "Admin", env: "production", time: "10m ago" },
  { action: "granted access to", target: "Production vault · Alex", user: "Admin", role: "Admin", env: "production", time: "4m ago" },
  { action: "synced", target: "Production environment", user: "System", role: "Automation", env: "production", time: "5m ago" },
  { action: "deployed", target: "main → production", user: "Sam", role: "Developer", env: "production", time: "12m ago" },
  { action: "updated", target: "STRIPE_API_KEY", user: "Alex", role: "Developer", env: "production", time: "18m ago" },
  { action: "deleted", target: "REDIS_URL", user: "Sam", role: "Developer", env: "development", time: "25m ago" },
  { action: "created", target: "SENDGRID_API_KEY", user: "Yasas", role: "Admin", env: "staging", time: "1h ago" },
  { action: "revoked access to", target: "Production vault · Taylor", user: "Admin", role: "Admin", env: "production", time: "1.5h ago" },
];

const actionFilters = ["all", "created", "updated", "rotated", "deleted", "synced"];

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = logs.filter((l) => {
    const q = search.toLowerCase();
    return (l.target.toLowerCase().includes(q) || l.user.toLowerCase().includes(q))
      && (filter === "all" || l.action === filter);
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Audit Logs</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {filtered.length} events · Real-time audit trail
          </p>
        </div>
        <DashboardButton className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
          <Download className="w-4 h-4" />
          Export
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by target or user..." />
        <div className="hidden sm:block">
          <FilterTabs options={actionFilters} value={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="hidden sm:block">
        <DashboardTable>
          <thead>
            <tr className="border-b border-black/[0.04] dark:border-[#222]">
              <Th>Event</Th>
              <Th>Target</Th>
              <Th>User</Th>
              <Th>Environment</Th>
              <Th>Time</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l, i) => (
              <Tr key={i}>
                <Td><ActionBadge label={l.action} /></Td>
                <Td><span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{l.target}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-[9px] font-semibold text-[#8E8E93]">
                      {l.user.charAt(0)}
                    </div>
                    <span className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{l.user}</span>
                    <span className="text-[10px] text-[#8E8E93]">({l.role})</span>
                  </div>
                </Td>
                <Td><EnvBadge label={l.env} /></Td>
                <Td className="text-sm text-[#8E8E93] dark:text-[#666]">{l.time}</Td>
              </Tr>
            ))}
          </tbody>
        </DashboardTable>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((l, i) => (
          <DashboardCard key={i}>
            <div className="flex items-start justify-between mb-3">
              <ActionBadge label={l.action} />
              <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{l.time}</span>
            </div>
            <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-2">{l.target}</p>
            <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-[9px] font-semibold text-[#8E8E93]">
                  {l.user.charAt(0)}
                </div>
                <span className="text-xs text-[#1D1D1F] dark:text-[#E5E5E5]">{l.user}</span>
                <span className="text-[10px] text-[#8E8E93]">({l.role})</span>
              </div>
              <EnvBadge label={l.env} />
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
