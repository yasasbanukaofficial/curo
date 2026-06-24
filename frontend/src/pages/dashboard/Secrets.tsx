import { useState } from "react";
import { Plus, KeyRound, Eye, EyeOff, Copy, MoreHorizontal } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import FilterTabs from "../../components/dashboard/FilterTabs";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";

const allSecrets = [
  { name: "DATABASE_URL", value: "postgresql://prod:••••••@db.example.com:5432/main", env: "production", updated: "2m ago", author: "Yasas" },
  { name: "OPENAI_API_KEY", value: "sk-proj-••••••••••••", env: "production", updated: "5m ago", author: "System" },
  { name: "JWT_SECRET", value: "••••••••••••••••", env: "production", updated: "10m ago", author: "Yasas" },
  { name: "STRIPE_API_KEY", value: "sk_live_••••••••••••", env: "production", updated: "18m ago", author: "Alex" },
  { name: "REDIS_URL", value: "redis://:••••••@redis.example.com:6379", env: "development", updated: "25m ago", author: "Sam" },
  { name: "SENDGRID_API_KEY", value: "SG.••••••••••••", env: "staging", updated: "1h ago", author: "Yasas" },
  { name: "AWS_ACCESS_KEY_ID", value: "AKIA••••••••••••", env: "staging", updated: "2h ago", author: "Alex" },
  { name: "GITHUB_TOKEN", value: "ghp_••••••••••••", env: "development", updated: "3h ago", author: "Sam" },
];

const envFilters = ["all", "production", "staging", "development"];

export default function Secrets() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState<Record<string, boolean>>({});

  const filtered = allSecrets.filter((s) => {
    const q = search.toLowerCase();
    return (s.name.toLowerCase().includes(q)) && (filter === "all" || s.env === filter);
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Secrets</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {filtered.length} secrets · {allSecrets.filter((s) => s.env === "production").length} in production
          </p>
        </div>
        <DashboardButton className="h-9 px-4 text-sm font-medium text-white bg-[var(--accent)] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[var(--accent)]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          Add Secret
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search secrets..." />
        <div className="hidden sm:block">
          <FilterTabs options={envFilters} value={filter} onChange={setFilter} />
        </div>
      </div>

      <div className="hidden sm:block">
        <DashboardTable>
          <thead>
            <tr className="border-b border-black/[0.04] dark:border-[#222]">
              <Th>Name</Th>
              <Th className="hidden md:table-cell">Value</Th>
              <Th>Environment</Th>
              <Th className="hidden md:table-cell">Updated</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const isVisible = visible[s.name];
              return (
                <Tr key={s.name}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.name}</span>
                    </div>
                  </Td>
                  <Td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] px-2 py-1 rounded-md max-w-[220px] truncate">
                        {isVisible ? s.value : s.value.replace(/[^\s:/.@-]/g, "•")}
                      </code>
                      <DashboardButton
                        onClick={() => setVisible((v) => ({ ...v, [s.name]: !v[s.name] }))}
                        className="text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </DashboardButton>
                    </div>
                  </Td>
                  <Td><EnvBadge label={s.env} /></Td>
                  <Td className="hidden md:table-cell text-sm text-[#8E8E93] dark:text-[#666]">
                    <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.author}</span> · {s.updated}
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DashboardButton className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                        <Copy className="w-3.5 h-3.5" />
                      </DashboardButton>
                      <DashboardButton className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </DashboardButton>
                    </div>
                  </Td>
                </Tr>
              );
            })}
          </tbody>
        </DashboardTable>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((s) => {
          const isVisible = visible[s.name];
          return (
            <DashboardCard key={s.name}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#8E8E93]" />
                  <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DashboardButton
                    onClick={() => setVisible((v) => ({ ...v, [s.name]: !v[s.name] }))}
                    className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                  >
                    {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </DashboardButton>
                  <DashboardButton className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </DashboardButton>
                </div>
              </div>

              <div className="mb-3">
                <code className="block text-xs font-mono text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] px-2 py-1.5 rounded-md truncate">
                  {isVisible ? s.value : s.value.replace(/[^\s:/.@-]/g, "•")}
                </code>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <EnvBadge label={s.env} />
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{s.updated}</span>
                </div>
                <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">by {s.author}</span>
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
