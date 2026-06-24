import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { z } from "zod";
import {
  Plus,
  FolderKanban,
  KeyRound,
  Users,
  Layers3,
  ArrowLeft,
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import CreateProjectModal from "../../components/dashboard/CreateProjectModal";
import FilterTabs from "../../components/dashboard/FilterTabs";
import FormField from "../../components/dashboard/FormField";
import FormTextarea from "../../components/dashboard/FormTextarea";
import AlertModal from "../../components/dashboard/AlertModal";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";

interface Project {
  id: string;
  name: string;
  description: string;
  secretCount: number;
  environmentCount: number;
  teamCount: number;
  memberCount: number;
  updatedAt: string;
  createdAt: string;
  secrets: string[];
  environments: string[];
  teams: string[];
}

interface AvailableSecret {
  id: string;
  name: string;
  env: string;
}

interface AvailableEnvironment {
  id: string;
  name: string;
}

interface AvailableTeam {
  id: string;
  name: string;
}

type DetailTab = "overview" | "secrets" | "environments" | "teams" | "settings";

const MOCK_PROJECTS: Project[] = [
  { id: "proj_1", name: "Acme API", description: "Production API server", secretCount: 248, environmentCount: 3, teamCount: 2, memberCount: 8, updatedAt: "2m ago", createdAt: "Jan 2026", secrets: ["sec_1", "sec_2", "sec_3"], environments: ["env_1", "env_2", "env_3"], teams: ["team_1"] },
  { id: "proj_2", name: "Main App", description: "Customer-facing web app", secretCount: 186, environmentCount: 3, teamCount: 2, memberCount: 12, updatedAt: "5m ago", createdAt: "Dec 2025", secrets: ["sec_1", "sec_4"], environments: ["env_1", "env_2"], teams: ["team_1", "team_2"] },
  { id: "proj_3", name: "Mobile Backend", description: "iOS/Android API gateway", secretCount: 94, environmentCount: 2, teamCount: 1, memberCount: 5, updatedAt: "15m ago", createdAt: "Mar 2026", secrets: ["sec_3"], environments: ["env_1", "env_3"], teams: ["team_1"] },
  { id: "proj_4", name: "Data Pipeline", description: "ETL and analytics infra", secretCount: 312, environmentCount: 2, teamCount: 1, memberCount: 6, updatedAt: "1h ago", createdAt: "Feb 2026", secrets: ["sec_2", "sec_5"], environments: ["env_2"], teams: [] },
  { id: "proj_5", name: "Admin Dashboard", description: "Internal admin panel", secretCount: 67, environmentCount: 3, teamCount: 1, memberCount: 4, updatedAt: "2h ago", createdAt: "Apr 2026", secrets: ["sec_4"], environments: ["env_1", "env_2", "env_3"], teams: ["team_1"] },
  { id: "proj_6", name: "Documentation", description: "Developer docs site", secretCount: 12, environmentCount: 1, teamCount: 1, memberCount: 3, updatedAt: "1d ago", createdAt: "May 2026", secrets: [], environments: ["env_1"], teams: [] },
  { id: "proj_7", name: "CLI Tool", description: "Command-line interface", secretCount: 41, environmentCount: 2, teamCount: 1, memberCount: 4, updatedAt: "2d ago", createdAt: "May 2026", secrets: ["sec_5"], environments: ["env_1", "env_2"], teams: [] },
  { id: "proj_8", name: "Auth Service", description: "SSO and auth provider", secretCount: 89, environmentCount: 3, teamCount: 1, memberCount: 7, updatedAt: "3d ago", createdAt: "Apr 2026", secrets: ["sec_1", "sec_2"], environments: ["env_1", "env_2", "env_3"], teams: ["team_1"] },
];

const ALL_SECRETS: AvailableSecret[] = [
  { id: "sec_1", name: "DATABASE_URL", env: "production" },
  { id: "sec_2", name: "OPENAI_API_KEY", env: "production" },
  { id: "sec_3", name: "JWT_SECRET", env: "staging" },
  { id: "sec_4", name: "STRIPE_API_KEY", env: "production" },
  { id: "sec_5", name: "REDIS_URL", env: "development" },
  { id: "sec_6", name: "SENDGRID_API_KEY", env: "staging" },
  { id: "sec_7", name: "AWS_ACCESS_KEY_ID", env: "staging" },
  { id: "sec_8", name: "GITHUB_TOKEN", env: "development" },
];

const ALL_ENVIRONMENTS: AvailableEnvironment[] = [
  { id: "env_1", name: "Development" },
  { id: "env_2", name: "Staging" },
  { id: "env_3", name: "Production" },
];

const ALL_TEAMS: AvailableTeam[] = [
  { id: "team_1", name: "Acme Corp" },
  { id: "team_2", name: "Personal" },
  { id: "team_3", name: "Side Project" },
];

const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100, "Name is too long"),
  description: z.string().trim().min(1, "Description is required").max(500, "Description is too long"),
});

export default function Projects() {
  const toast = useToast();
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
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
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const settingsFormik = useFormik({
    initialValues: { name: "", description: "" },
    validate: validateZod(updateProjectSchema),
    onSubmit: (values, { setSubmitting }) => {
      if (!selectedProject) return;
      const updated: Project = {
        ...selectedProject,
        name: values.name,
        description: values.description,
      };
      setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updated : p));
      setSelectedProject(updated);
      setSubmitting(false);
      toast.success("Project saved", "Project settings have been updated.");
    },
  });

  function openSettingsForm() {
    if (!selectedProject) return;
    settingsFormik.setValues({ name: selectedProject.name, description: selectedProject.description });
    setDetailTab("settings");
  }

  function handleDeleteProject() {
    if (!selectedProject) return;
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setSelectedProject(null);
    setShowDeleteModal(false);
  }

  function handleToggleSecret(secretId: string) {
    if (!selectedProject) return;
    const has = selectedProject.secrets.includes(secretId);
    const updatedSecrets = has
      ? selectedProject.secrets.filter((id) => id !== secretId)
      : [...selectedProject.secrets, secretId];
    const updated = { ...selectedProject, secrets: updatedSecrets, secretCount: updatedSecrets.length };
    setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updated : p));
    setSelectedProject(updated);
  }

  function handleToggleEnvironment(envId: string) {
    if (!selectedProject) return;
    const has = selectedProject.environments.includes(envId);
    const updatedEnvs = has
      ? selectedProject.environments.filter((id) => id !== envId)
      : [...selectedProject.environments, envId];
    const updated = { ...selectedProject, environments: updatedEnvs, environmentCount: updatedEnvs.length };
    setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updated : p));
    setSelectedProject(updated);
  }

  function handleToggleTeam(teamId: string) {
    if (!selectedProject) return;
    const has = selectedProject.teams.includes(teamId);
    const updatedTeams = has
      ? selectedProject.teams.filter((id) => id !== teamId)
      : [...selectedProject.teams, teamId];
    const updated = { ...selectedProject, teams: updatedTeams, teamCount: updatedTeams.length };
    setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? updated : p));
    setSelectedProject(updated);
  }

  const detailTabs = [
    { label: "Overview", value: "overview" as DetailTab },
    { label: "Secrets", value: "secrets" as DetailTab },
    { label: "Environments", value: "environments" as DetailTab },
    { label: "Teams", value: "teams" as DetailTab },
    { label: "Settings", value: "settings" as DetailTab },
  ];

  const projectDetail = selectedProject ? (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-5">
        <DashboardButton onClick={() => { setSelectedProject(null); setDetailTab("overview"); settingsFormik.resetForm(); }} className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.name}</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedProject.description}</p>
        </div>
      </div>

      <FilterTabs
        options={detailTabs.map((t) => t.label)}
        value={detailTabs.find((t) => t.value === detailTab)?.label || "Overview"}
        onChange={(v) => setDetailTab(detailTabs.find((t) => t.label === v)?.value || "overview")}
      />

      <div className="mt-6">
        {detailTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 flex flex-col gap-6">
              <DashboardCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Project Information</h3>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">General details about this project.</p>
                  </div>
                  <DashboardButton onClick={openSettingsForm} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
                    <Settings className="w-3.5 h-3.5" />Edit
                  </DashboardButton>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Name</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.name}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Created</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Secrets</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.secretCount} secrets assigned</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Members</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.memberCount} members</p>
                  </div>
                </div>
              </DashboardCard>
            </div>

            <div className="xl:col-span-1 flex flex-col gap-6">
              <DashboardCard>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <DashboardButton onClick={() => setDetailTab("secrets")} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><KeyRound className="w-4 h-4" />Manage Secrets</DashboardButton>
                  <DashboardButton onClick={() => setDetailTab("environments")} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Layers3 className="w-4 h-4" />Manage Environments</DashboardButton>
                  <DashboardButton onClick={() => setDetailTab("teams")} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Users className="w-4 h-4" />Assigned Teams</DashboardButton>
                </div>
              </DashboardCard>
              <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Danger Zone</h3>
                <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4">
                  <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Project</p>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Permanently delete this project and all its data.</p>
                  </div>
                </div>
                <DashboardButton onClick={() => setShowDeleteModal(true)} className="w-full h-9 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90"><Trash2 className="w-4 h-4" />Delete Project</DashboardButton>
              </DashboardCard>
            </div>
          </div>
        )}

        {detailTab === "secrets" && (
          <DashboardCard>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Assigned Secrets</h3>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedProject.secretCount} secrets assigned to this project.</p>
              </div>
              <SearchInput value={projectSearch} onChange={setProjectSearch} placeholder="Search secrets..." className="max-w-[260px]" />
            </div>
            <div className="space-y-1">
              {ALL_SECRETS.filter((s) =>
                s.name.toLowerCase().includes(projectSearch.toLowerCase())
              ).map((sec) => {
                const assigned = selectedProject.secrets.includes(sec.id);
                return (
                  <div key={sec.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <KeyRound className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{sec.name}</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{sec.env}</p>
                      </div>
                    </div>
                    <DashboardButton
                      onClick={() => handleToggleSecret(sec.id)}
                      className={`h-8 px-3 text-xs font-medium rounded-[10px] ${
                        assigned
                          ? "bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                          : "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {assigned ? "Remove" : "Assign"}
                    </DashboardButton>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        )}

        {detailTab === "environments" && (
          <DashboardCard>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-5">Assigned Environments</h3>
            <div className="space-y-1">
              {ALL_ENVIRONMENTS.map((env) => {
                const assigned = selectedProject.environments.includes(env.id);
                return (
                  <div key={env.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <Layers3 className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                      <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{env.name}</p>
                    </div>
                    <DashboardButton
                      onClick={() => handleToggleEnvironment(env.id)}
                      className={`h-8 px-3 text-xs font-medium rounded-[10px] ${
                        assigned
                          ? "bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                          : "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {assigned ? "Remove" : "Assign"}
                    </DashboardButton>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        )}

        {detailTab === "teams" && (
          <DashboardCard>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-5">Assigned Teams</h3>
            <div className="space-y-1">
              {ALL_TEAMS.map((team) => {
                const assigned = selectedProject.teams.includes(team.id);
                return (
                  <div key={team.id} className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <Users className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                      <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{team.name}</p>
                    </div>
                    <DashboardButton
                      onClick={() => handleToggleTeam(team.id)}
                      className={`h-8 px-3 text-xs font-medium rounded-[10px] ${
                        assigned
                          ? "bg-[#FF3B30]/10 text-[#FF3B30] hover:bg-[#FF3B30]/20"
                          : "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                      }`}
                    >
                      {assigned ? "Remove" : "Assign"}
                    </DashboardButton>
                  </div>
                );
              })}
            </div>
          </DashboardCard>
        )}

        {detailTab === "settings" && (
          <div className="max-w-2xl">
            <DashboardCard>
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">Project Settings</h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mb-5">Modify your project details.</p>
              <form onSubmit={settingsFormik.handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField
                    label="Project Name"
                    name="name"
                    placeholder="e.g. Acme API"
                    value={settingsFormik.values.name}
                    onChange={(v) => settingsFormik.setFieldValue("name", v)}
                    onBlur={settingsFormik.handleBlur}
                    error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined}
                    touched={!!settingsFormik.touched.name}
                    required
                  />
                  <FormTextarea
                    label="Description"
                    name="description"
                    placeholder="Describe what this project is for..."
                    value={settingsFormik.values.description}
                    onChange={(v) => settingsFormik.setFieldValue("description", v)}
                    error={settingsFormik.touched.description ? settingsFormik.errors.description : undefined}
                    touched={!!settingsFormik.touched.description}
                    required
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  <DashboardButton type="submit" disabled={settingsFormik.isSubmitting} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed">
                    {settingsFormik.isSubmitting ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </DashboardButton>
                </div>
              </form>
            </DashboardCard>
          </div>
        )}
      </div>

      <AlertModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        variant="warning"
        title="Delete Project"
        message="Are you sure you want to delete this project? All associated secrets, environments, and team assignments will be removed."
        buttons={[
          { label: "Cancel", onClick: () => setShowDeleteModal(false), variant: "secondary" },
          { label: "Delete Project", onClick: handleDeleteProject, variant: "destructive" },
        ]}
      />
    </div>
  ) : null;

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      {projectDetail || (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Projects</h1>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
                {filtered.length} projects · {projects.reduce((a, p) => a + p.secretCount, 0)} total secrets
              </p>
            </div>
            <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
              <Plus className="w-4 h-4" />
              New Project
            </DashboardButton>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <DashboardCard key={p.id} hover padding="md" className="cursor-pointer" onClick={() => { setSelectedProject(p); setDetailTab("overview"); }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-[#8E8E93]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{p.name}</h3>
                      <p className="text-xs text-[#8E8E93] dark:text-[#666]">{p.description}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                    <KeyRound className="w-3.5 h-3.5" />
                    {p.secretCount} secrets
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                    <Layers3 className="w-3.5 h-3.5" />
                    {p.environmentCount} envs
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8E8E93] dark:text-[#666]">
                    <Users className="w-3.5 h-3.5" />
                    {p.teamCount} teams
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Updated {p.updatedAt}</span>
                  <DashboardButton onClick={(e) => { e.stopPropagation(); setSelectedProject(p); setDetailTab("overview"); }} className="text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] hover:text-[#636363] dark:hover:text-[#999] gap-1">
                    Open <FolderKanban className="w-3 h-3" />
                  </DashboardButton>
                </div>
              </DashboardCard>
            ))}
          </div>
        </>
      )}

      <CreateProjectModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
