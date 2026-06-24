import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Plus, FolderKanban, KeyRound, Users, Layers3, ArrowRight } from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import CreateProjectModal from "../../components/dashboard/CreateProjectModal";

const projects = [
  { name: "Acme API", desc: "Production API server", secrets: 248, envs: 3, members: 8, updated: "2m ago" },
  { name: "Main App", desc: "Customer-facing web app", secrets: 186, envs: 3, members: 12, updated: "5m ago" },
  { name: "Mobile Backend", desc: "iOS/Android API gateway", secrets: 94, envs: 2, members: 5, updated: "15m ago" },
  { name: "Data Pipeline", desc: "ETL and analytics infra", secrets: 312, envs: 2, members: 6, updated: "1h ago" },
  { name: "Admin Dashboard", desc: "Internal admin panel", secrets: 67, envs: 3, members: 4, updated: "2h ago" },
  { name: "Documentation", desc: "Developer docs site", secrets: 12, envs: 1, members: 3, updated: "1d ago" },
  { name: "CLI Tool", desc: "Command-line interface", secrets: 41, envs: 2, members: 4, updated: "2d ago" },
  { name: "Auth Service", desc: "SSO and auth provider", secrets: 89, envs: 3, members: 7, updated: "3d ago" },
];

export default function Projects() {
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openNewProject) {
      setShowCreateModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Projects</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {filtered.length} projects · {projects.reduce((a, p) => a + p.secrets, 0)} total secrets
          </p>
        </div>
        <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          New Project
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <DashboardCard key={p.name} hover padding="md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-[#8E8E93]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{p.name}</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666]">{p.desc}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                <KeyRound className="w-3.5 h-3.5" />
                {p.secrets} secrets
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                <Layers3 className="w-3.5 h-3.5" />
                {p.envs} envs
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                <Users className="w-3.5 h-3.5" />
                {p.members} members
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
              <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Updated {p.updated}</span>
              <DashboardButton className="text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] hover:text-[#636363] dark:hover:text-[#999] gap-1">
                Open <ArrowRight className="w-3 h-3" />
              </DashboardButton>
            </div>
          </DashboardCard>
        ))}
      </div>

      <CreateProjectModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
