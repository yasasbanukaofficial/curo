import StatusBadge from "../ui/StatusBadge";

const stats = [
  { label: "Documents Analyzed", value: "248", change: "+12 this week" },
  { label: "Brand Voice Score", value: "94%", change: "+2% vs last month" },
  { label: "Terms Flagged", value: "18", change: "8 unresolved" },
  { label: "Team Members", value: "12", change: "3 active now" },
];

const weeklyData = [
  { day: "Mon", score: 88 }, { day: "Tue", score: 92 }, { day: "Wed", score: 85 },
  { day: "Thu", score: 95 }, { day: "Fri", score: 91 }, { day: "Sat", score: 78 },
  { day: "Sun", score: 94 },
];

const recentDocs = [
  { name: "Product Release v2.4", status: "Compliant", score: "96%", author: "Alex C." },
  { name: "API Migration Guide", status: "Review", score: "82%", author: "Sam L." },
  { name: "Q3 Roadmap Draft", status: "Compliant", score: "98%", author: "Jordan P." },
  { name: "Security Policy Update", status: "Flagged", score: "64%", author: "Taylor R." },
  { name: "Onboarding Playbook", status: "Compliant", score: "91%", author: "Alex C." },
];

function StatCard({ label, value, change }: { label: string; value: string; change: string }) {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#EFEFEF] dark:border-[#2A2A2A] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] p-5 flex-1 min-w-[180px]">
      <p className="text-xs text-[#888] dark:text-[#999] mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#E5E5E5]">{value}</p>
      <p className="text-[11px] text-[#888] dark:text-[#666] mt-1">{change}</p>
    </div>
  );
}

export default function AnalyticsOverview() {
  return (
    <div className="flex-1 flex flex-col min-w-0 p-6 overflow-y-auto bg-white dark:bg-[#1E1E1E]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#888] dark:text-[#999] mb-1">
            <span className="text-[#1A1A1A] dark:text-[#E5E5E5]">Overview</span>
            <span className="text-[#ccc] dark:text-[#555]">|</span>
            <span className="text-[#888] dark:text-[#999]">Analytics</span>
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A] dark:text-[#E5E5E5]">Analytics Overview</h1>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-9 px-3 text-sm text-[#1A1A1A] dark:text-[#E5E5E5] bg-white dark:bg-[#2A2A2A] border border-[#ddd] dark:border-[#444] rounded-lg outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last quarter</option>
          </select>
          <button className="h-9 px-4 text-sm font-medium text-white bg-[#111] dark:bg-[#fff] dark:text-[#111] rounded-lg hover:bg-[#111]/90 dark:hover:bg-[#eee] transition-colors">
            Download Report
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#EFEFEF] dark:border-[#2A2A2A] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] p-5 flex-[2] min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E5E5E5]">Brand Voice Compliance</h3>
            <span className="text-[11px] text-[#888] dark:text-[#666]">This week</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-36">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] text-[#888] dark:text-[#666]">{d.score}%</span>
                <div className="w-full bg-[#F5F5F5] dark:bg-[#2A2A2A] rounded-full flex-1 relative" style={{ minHeight: "60px" }}>
                  <div className="absolute bottom-0 w-full bg-[#111] dark:bg-[#fff] rounded-full transition-all" style={{ height: `${d.score}%` }} />
                </div>
                <span className="text-[10px] text-[#888] dark:text-[#666]">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-xl border border-[#EFEFEF] dark:border-[#2A2A2A] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] p-5 flex-[3] min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-[#E5E5E5]">Recent Documents</h3>
            <button className="text-[11px] text-[#888] dark:text-[#666] hover:text-[#1A1A1A] dark:hover:text-[#E5E5E5] transition-colors">View all</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-[#888] dark:text-[#666] border-b border-[#EFEFEF] dark:border-[#2A2A2A]">
                  <th className="text-left font-medium pb-2 pl-0">Name</th>
                  <th className="text-left font-medium pb-2">Status</th>
                  <th className="text-left font-medium pb-2">Score</th>
                  <th className="text-left font-medium pb-2 pr-0">Author</th>
                </tr>
              </thead>
              <tbody>
                {recentDocs.map((doc) => (
                  <tr key={doc.name} className="border-b border-[#EFEFEF] dark:border-[#2A2A2A] last:border-none">
                    <td className="py-3 pl-0 text-[#1A1A1A] dark:text-[#E5E5E5]">{doc.name}</td>
                    <td className="py-3"><StatusBadge status={doc.status} /></td>
                    <td className="py-3 text-[#1A1A1A] dark:text-[#E5E5E5] font-medium">{doc.score}</td>
                    <td className="py-3 pr-0 text-[#888] dark:text-[#666]">{doc.author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
