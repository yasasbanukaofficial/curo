import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Search,
  RefreshCw,
  CalendarDays,
  FolderKanban,
  Clock,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";
import { useActivityFeed } from "../../hooks/useActivityFeed";
import type { ActivityLogEntry } from "../../types/activity";

const entityTypeOptions = [
  { value: "", label: "All Events" },
  { value: "project", label: "Projects" },
  { value: "secret", label: "Secrets" },
  { value: "environment", label: "Environments" },
  { value: "team", label: "Teams" },
  { value: "member", label: "Members" },
  { value: "auth", label: "Authentication" },
] as const;

const dateRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
] as const;

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const ts = new Date(dateStr).getTime();
  const diff = now - ts;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const actionDotColors: Record<string, string> = {
  created: "bg-[#30D158]",
  updated: "bg-[#FF9F0A]",
  rotated: "bg-[#FF9F0A]",
  deleted: "bg-[#FF3B30]",
  synced: "bg-[#007AFF]",
  deployed: "bg-[#30D158]",
};

const entityBadgeColors: Record<string, string> = {
  project: "text-[#007AFF] bg-[#007AFF]/10",
  secret: "text-[#FF9F0A] bg-[#FF9F0A]/10",
  environment: "text-[#30D158] bg-[#30D158]/10",
  team: "text-[#5E5CE6] bg-[#5E5CE6]/10",
  member: "text-[#FF3B30] bg-[#FF3B30]/10",
  auth: "text-gray-500 bg-gray-100 dark:bg-white/[0.04] dark:text-white/40",
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

type FilterDef = { value: string; label: string };

function FilterDropdown({
  value,
  options,
  onChange,
  icon: Icon,
  label,
  active,
}: {
  value: string;
  options: readonly FilterDef[];
  onChange: (v: string) => void;
  icon: typeof Filter;
  label: string;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`cursor-pointer inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-xl border transition-all duration-200 whitespace-nowrap ${
          active
            ? "bg-accent/10 text-accent border-accent/20"
            : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/50 border-gray-200 dark:border-white/[0.06] hover:text-gray-700 dark:hover:text-white hover:border-gray-300 dark:hover:border-white/[0.1]"
        }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {options.find((o) => o.value === value)?.label || label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#18181B] rounded-xl border border-gray-200 dark:border-white/[0.06] shadow-lg py-1 z-50 min-w-[140px]">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`cursor-pointer flex items-center w-full h-8 px-3 text-sm text-left transition-colors duration-150 ${
                  opt.value === value
                    ? "bg-gray-100 dark:bg-white/[0.04] text-gray-900 dark:text-[#FAFAFA] font-medium"
                    : "text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ActivityLog() {
  const [search, setSearch] = useState("");
  const [entityType, setEntityType] = useState("");
  const [dateRange, setDateRange] = useState("7d");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const { entries, total } = useActivityFeed({
    entityType,
    search,
    dateRange: dateRange === "all" ? undefined : dateRange,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paginated = entries.slice((page - 1) * pageSize, page * pageSize);
  const hasFilters = entityType || dateRange !== "7d" || search;

  const clearFilters = useCallback(() => {
    setSearch("");
    setEntityType("");
    setDateRange("7d");
    setPage(1);
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col min-h-full"
      >
        <motion.div variants={cardVariants} className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Activity</h1>
            <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{total} event{total !== 1 ? "s" : ""} across your workspace</p>
          </div>
          <button
            type="button"
            onClick={() => setRefreshing(true)}
            disabled={refreshing}
            className="cursor-pointer h-10 px-4 text-sm font-medium text-gray-600 dark:text-white/60 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-40 inline-flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </motion.div>

        <motion.div variants={cardVariants} className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search events..."
              className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-white placeholder-gray-400 dark:placeholder-white/30 transition-colors duration-200 focus:border-white/[0.12]"
            />
          </div>

          <FilterDropdown
            value={entityType}
            options={entityTypeOptions}
            onChange={(v) => { setEntityType(v); setPage(1); }}
            icon={Filter}
            label="Type"
            active={!!entityType}
          />

          <FilterDropdown
            value={dateRange}
            options={dateRangeOptions}
            onChange={(v) => { setDateRange(v); setPage(1); }}
            icon={CalendarDays}
            label="Date"
            active={dateRange !== "7d"}
          />

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer h-8 px-2.5 text-xs font-medium text-gray-500 dark:text-white/40 hover:text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-xl transition-all duration-200 inline-flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </motion.div>

        {hasFilters && (
          <motion.div variants={cardVariants} className="flex flex-wrap items-center gap-1.5 -mt-3 mb-6">
            {entityType && (
              <span className="inline-flex items-center gap-1 h-6 px-2 text-[10px] font-medium bg-accent/10 text-accent rounded-lg">
                {entityTypeOptions.find((o) => o.value === entityType)?.label}
                <button type="button" onClick={() => setEntityType("")} className="cursor-pointer hover:text-accent/70">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {dateRange !== "7d" && (
              <span className="inline-flex items-center gap-1 h-6 px-2 text-[10px] font-medium bg-accent/10 text-accent rounded-lg">
                {dateRangeOptions.find((o) => o.value === dateRange)?.label}
                <button type="button" onClick={() => setDateRange("7d")} className="cursor-pointer hover:text-accent/70">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </motion.div>
        )}

        <motion.div variants={cardVariants} className="flex-1">
          <DashboardTable>
            <thead>
              <tr>
                <Th className="w-8 hidden sm:table-cell">&nbsp;</Th>
                <Th className="w-full">Event</Th>
                <Th className="hidden md:table-cell w-[90px]">Type</Th>
                <Th className="hidden lg:table-cell w-[130px]">Project</Th>
                <Th className="hidden xl:table-cell w-[110px]">Time</Th>
                <Th className="w-10">User</Th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <Td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Activity className="w-12 h-12 text-gray-400 dark:text-white/30 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">
                        {hasFilters ? "No results found" : "No activity yet"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">
                        {hasFilters
                          ? "Try adjusting your search or filter criteria."
                          : "Activity from your projects, secrets, and teams will appear here."}
                      </p>
                    </div>
                  </Td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <ActivityRow key={entry._id} entry={entry} />
                ))
              )}
            </tbody>
          </DashboardTable>
        </motion.div>

        {totalPages > 1 && (
          <motion.div variants={cardVariants} className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-white/40">
              Page {page} of {totalPages}
              <span className="hidden sm:inline"> &middot; {total} total events</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="cursor-pointer h-8 px-3 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.08] rounded-xl border border-gray-200 dark:border-white/[0.06] transition-all duration-200 inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="cursor-pointer h-8 px-3 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] hover:bg-gray-200 dark:hover:bg-white/[0.08] rounded-xl border border-gray-200 dark:border-white/[0.06] transition-all duration-200 inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function ActivityRow({ entry }: { entry: ActivityLogEntry }) {
  return (
    <Tr>
      <Td className="w-8 hidden sm:table-cell">
        <span className={`w-2 h-2 rounded-full block ${actionDotColors[entry.action] || "bg-gray-400 dark:bg-white/30"}`} />
      </Td>
      <Td>
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate max-w-full">
              {entry.description}
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="text-[11px] text-gray-500 dark:text-white/40 truncate max-w-[160px]">
                {entry.entityName}
              </span>
              {entry.environmentName && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40">
                  {entry.environmentName}
                </span>
              )}
              <span className="xl:hidden text-[11px] text-gray-400 dark:text-white/30 whitespace-nowrap flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                {timeAgo(entry.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </Td>
      <Td className="hidden md:table-cell w-[90px]">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md capitalize ${entityBadgeColors[entry.entityType] || "text-gray-500 bg-gray-100 dark:bg-white/[0.04] dark:text-white/40"}`}>
          {entry.entityType}
        </span>
      </Td>
      <Td className="hidden lg:table-cell w-[130px]">
        {entry.projectName ? (
          <div className="flex items-center gap-1.5 min-w-0">
            <FolderKanban className="w-3 h-3 text-gray-400 dark:text-white/30 flex-shrink-0" />
            <span className="text-sm text-gray-700 dark:text-white/60 truncate">{entry.projectName}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400 dark:text-white/20">&mdash;</span>
        )}
      </Td>
      <Td className="hidden xl:table-cell w-[110px]">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/40 whitespace-nowrap">
          <Clock className="w-3 h-3 flex-shrink-0" />
          <span>{timeAgo(entry.createdAt)}</span>
        </div>
      </Td>
      <Td className="w-10">
        <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-semibold text-accent flex-shrink-0">
          {entry.userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
      </Td>
    </Tr>
  );
}
