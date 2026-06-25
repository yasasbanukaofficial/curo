import { useState } from "react";
import { Download, User, Fingerprint, Globe, Clock, FileText } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import FilterTabs from "../../components/dashboard/FilterTabs";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Modal from "../../components/dashboard/Modal";
import { ActionBadge, EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";

interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resource: string;
  metadata: Record<string, string>;
  target: string;
  user: string;
  role: string;
  env: string;
  time: string;
  createdAt: string;
}

const LOGS: AuditLogEntry[] = [
  { id: "log_1", userId: "USR-001", action: "UPDATED", resource: "SECRET", metadata: { secretName: "DATABASE_URL", env: "Production", field: "value" }, target: "DATABASE_URL", user: "Yasas", role: "Admin", env: "production", time: "2m ago", createdAt: "2026-06-25T10:00:00Z" },
  { id: "log_2", userId: "USR-002", action: "VIEWED", resource: "SECRET", metadata: { secretName: "OPENAI_API_KEY", env: "Staging" }, target: "OPENAI_API_KEY", user: "System", role: "Automation", env: "staging", time: "5m ago", createdAt: "2026-06-25T09:55:00Z" },
  { id: "log_3", userId: "USR-001", action: "CREATED", resource: "SECRET", metadata: { secretName: "JWT_SECRET", env: "Production" }, target: "JWT_SECRET", user: "Yasas", role: "Admin", env: "production", time: "10m ago", createdAt: "2026-06-25T09:50:00Z" },
  { id: "log_4", userId: "USR-003", action: "UPDATED", resource: "SECRET", metadata: { secretName: "STRIPE_API_KEY", env: "Production", field: "value" }, target: "STRIPE_API_KEY", user: "Alex", role: "Developer", env: "production", time: "18m ago", createdAt: "2026-06-25T09:42:00Z" },
  { id: "log_5", userId: "USR-004", action: "DELETED", resource: "SECRET", metadata: { secretName: "REDIS_URL", env: "Development" }, target: "REDIS_URL", user: "Sam", role: "Developer", env: "development", time: "25m ago", createdAt: "2026-06-25T09:35:00Z" },
  { id: "log_6", userId: "USR-001", action: "CREATED", resource: "SECRET", metadata: { secretName: "SENDGRID_API_KEY", env: "Staging" }, target: "SENDGRID_API_KEY", user: "Yasas", role: "Admin", env: "staging", time: "1h ago", createdAt: "2026-06-25T09:00:00Z" },
  { id: "log_7", userId: "USR-003", action: "UPDATED", resource: "SECRET", metadata: { secretName: "AWS_ACCESS_KEY_ID", env: "Staging", field: "value" }, target: "AWS_ACCESS_KEY_ID", user: "Alex", role: "Developer", env: "staging", time: "2h ago", createdAt: "2026-06-25T08:00:00Z" },
  { id: "log_8", userId: "USR-004", action: "UPDATED", resource: "SECRET", metadata: { secretName: "GITHUB_TOKEN", env: "Development", field: "value" }, target: "GITHUB_TOKEN", user: "Sam", role: "Developer", env: "development", time: "3h ago", createdAt: "2026-06-25T07:00:00Z" },
];

const actionFilters = ["all", "CREATED", "UPDATED", "VIEWED", "DELETED"];

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const filtered = LOGS.filter((l) => {
    const q = search.toLowerCase();
    return (l.target.toLowerCase().includes(q) || l.user.toLowerCase().includes(q))
      && (filter === "all" || l.action === filter);
  });

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
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
            {filtered.map((l) => (
              <Tr key={l.id} onClick={() => setSelectedLog(l)}>
                <Td><ActionBadge label={l.action.toLowerCase()} /></Td>
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
        {filtered.map((l) => (
          <DashboardCard key={l.id} hover className="cursor-pointer" onClick={() => setSelectedLog(l)}>
            <div className="flex items-start justify-between mb-3">
              <ActionBadge label={l.action.toLowerCase()} />
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

      <Modal
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Log Details"
        size="lg"
        footer={
          <DashboardButton onClick={() => setSelectedLog(null)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
            Close
          </DashboardButton>
        }
      >
        {selectedLog && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3.5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
                <User className="w-4 h-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">User</p>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedLog.user}</p>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{selectedLog.role} · {selectedLog.userId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
                <Fingerprint className="w-4 h-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Action</p>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedLog.action}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
                <FileText className="w-4 h-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Resource</p>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedLog.resource}</p>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{selectedLog.target}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
                <Globe className="w-4 h-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Environment</p>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] capitalize">{selectedLog.env}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
              <Clock className="w-4 h-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Timestamp</p>
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{formatDate(selectedLog.createdAt)}</p>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{selectedLog.time}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-2">Metadata</p>
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3.5">
                {Object.keys(selectedLog.metadata).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] min-w-[90px]">{key}</span>
                        <span className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#8E8E93] dark:text-[#666]">No additional metadata.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
