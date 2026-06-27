import { useState } from "react";
import { Download, User, Fingerprint, Globe, Clock, FileText } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import FilterTabs from "../../components/dashboard/FilterTabs";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Modal from "../../components/dashboard/Modal";
import { ActionBadge, EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";
import { useGetAuditsQuery } from "../../features/audit/auditApi";

const actionFilters = ["all", "CREATED", "UPDATED", "VIEWED", "DELETED"];

export default function AuditLogs() {
  const { data: audits = [], isLoading, isError } = useGetAuditsQuery();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const filtered = audits.filter((l) => {
    const q = search.toLowerCase();
    return (l.target?.toLowerCase().includes(q) || l.user?.toLowerCase().includes(q))
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#8E8E93]">Loading audit logs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#FF3B30]">Something went wrong. Could not load audit logs.</p>
      </div>
    );
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
              <Tr key={l._id} onClick={() => setSelectedLog(l)}>
                <Td><ActionBadge label={l.action.toLowerCase()} /></Td>
                <Td><span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{l.target}</span></Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-[9px] font-semibold text-[#8E8E93]">
                      {l.user?.charAt(0) || "?"}
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
          <DashboardCard key={l._id} hover className="cursor-pointer" onClick={() => setSelectedLog(l)}>
            <div className="flex items-start justify-between mb-3">
              <ActionBadge label={l.action.toLowerCase()} />
              <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{l.time}</span>
            </div>
            <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-2">{l.target}</p>
            <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-[9px] font-semibold text-[#8E8E93]">
                  {l.user?.charAt(0) || "?"}
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
                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(selectedLog.metadata).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <span className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] min-w-[90px]">{key}</span>
                        <span className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{value as string}</span>
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
