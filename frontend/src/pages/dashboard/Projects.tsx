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
  HelpCircle,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import CreateProjectModal from "../../components/dashboard/CreateProjectModal";
import FilterTabs from "../../components/dashboard/FilterTabs";
import FormField from "../../components/dashboard/FormField";
import FormInput from "../../components/dashboard/FormInput";
import FormTextarea from "../../components/dashboard/FormTextarea";
import AlertModal from "../../components/dashboard/AlertModal";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import type { Project } from "../../types/project";
import {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRemoveProjectMutation,
} from "../../features/project/projectApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedProject, selectSelectedProject } from "../../features/project/projectSlice";

type DetailTab = "overview" | "secrets" | "environments" | "teams" | "settings";

const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100, "Name is too long"),
  description: z.string().trim().min(1, "Description is required").max(500, "Description is too long"),
  projectLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export default function Projects() {
  const dispatch = useAppDispatch();
  const selectedProject = useAppSelector(selectSelectedProject);
  const toast = useToast();
  const { data: projects = [], isLoading, isError } = useGetProjectsQuery();
  const [addProject] = useAddProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [removeProject] = useRemoveProjectMutation();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
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
    p.projectName.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const settingsFormik = useFormik({
    initialValues: { name: "", description: "", projectLink: "" },
    validate: validateZod(updateProjectSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedProject) return;
      try {
        await updateProject({ id: selectedProject._id, body: values }).unwrap();
        setSubmitting(false);
        toast.success("Project saved", "Project settings have been updated.");
      } catch {
        setSubmitting(false);
        toast.error("Failed to update project", "Something went wrong. Please try again.");
      }
    },
  });

  function openSettingsForm() {
    if (!selectedProject) return;
    settingsFormik.setValues({ name: selectedProject.projectName, description: selectedProject.description, projectLink: selectedProject.projectLink || "" });
    setDetailTab("settings");
  }

  async function handleDeleteProject() {
    if (!selectedProject) return;
    try {
      await removeProject(selectedProject._id).unwrap();
      dispatch(setSelectedProject(null));
      setShowDeleteModal(false);
      toast.success("Project deleted", `${selectedProject.projectName} has been removed.`);
    } catch {
      toast.error("Failed to delete project", "Something went wrong. Please try again.");
    }
  }

  async function handleCreateProject(values: { projectName: string; description: string; team: string; projectLink?: string }) {
    await addProject(values).unwrap();
    toast.success("Project created", `${values.projectName} has been created.`);
  }

  function handleToggleSecret(secretId: string) {
    if (!selectedProject) return;
    const has = selectedProject.secrets?.includes(secretId);
    const updatedSecrets = has
      ? selectedProject.secrets.filter((id) => id !== secretId)
      : [...(selectedProject.secrets || []), secretId];
    const updated = { ...selectedProject, secrets: updatedSecrets, secretCount: updatedSecrets.length };
    dispatch(setSelectedProject(updated));
  }

  function handleToggleEnvironment(envId: string) {
    if (!selectedProject) return;
    const has = selectedProject.environments?.includes(envId);
    const updatedEnvs = has
      ? selectedProject.environments.filter((id) => id !== envId)
      : [...(selectedProject.environments || []), envId];
    const updated = { ...selectedProject, environments: updatedEnvs, environmentCount: updatedEnvs.length };
    dispatch(setSelectedProject(updated));
  }

  function handleToggleTeam(teamId: string) {
    if (!selectedProject) return;
    const has = selectedProject.teams?.includes(teamId);
    const updatedTeams = has
      ? selectedProject.teams.filter((id) => id !== teamId)
      : [...(selectedProject.teams || []), teamId];
    const updated = { ...selectedProject, teams: updatedTeams, teamCount: updatedTeams.length };
    dispatch(setSelectedProject(updated));
  }

  const detailTabs = [
    { label: "Overview", value: "overview" as DetailTab },
    { label: "Secrets", value: "secrets" as DetailTab },
    { label: "Environments", value: "environments" as DetailTab },
    { label: "Teams", value: "teams" as DetailTab },
    { label: "Settings", value: "settings" as DetailTab },
  ];

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#8E8E93]">Loading projects...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#FF3B30]">Something went wrong. Could not load projects.</p>
      </div>
    );
  }

  const projectDetail = selectedProject ? (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-5">
        <DashboardButton onClick={() => { dispatch(setSelectedProject(null)); setDetailTab("overview"); settingsFormik.resetForm(); }} className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.projectName}</h1>
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
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.projectName}</p>
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
                  <div className="sm:col-span-2">
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Repository</p>
                    {selectedProject.projectLink ? (
                      <a href={selectedProject.projectLink} target="_blank" rel="noopener noreferrer" className="text-sm text-[#007AFF] hover:underline inline-flex items-center gap-1">
                        {selectedProject.projectLink}
                      </a>
                    ) : (
                      <p className="text-sm text-[#8E8E93] dark:text-[#666]">—</p>
                    )}
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
              {[]}
            </div>
          </DashboardCard>
        )}

        {detailTab === "environments" && (
          <DashboardCard>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-5">Assigned Environments</h3>
            <div className="space-y-1">
              {[]}
            </div>
          </DashboardCard>
        )}

        {detailTab === "teams" && (
          <DashboardCard>
            <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-5">Assigned Teams</h3>
            <div className="space-y-1">
              {[]}
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
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">URL</label>
                      <div className="relative group">
                        <HelpCircle className="w-3.5 h-3.5 text-[#8E8E93] cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 text-[11px] text-white bg-[#1D1D1F] dark:bg-[#333] rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                          Link to the project — live site, deployed app, or GitHub/GitLab repository URL.
                        </div>
                      </div>
                    </div>
                    <FormInput
                      value={settingsFormik.values.projectLink}
                      onChange={(v) => settingsFormik.setFieldValue("projectLink", v)}
                      onBlur={settingsFormik.handleBlur}
                      placeholder="https://example.com"
                      error={settingsFormik.touched.projectLink ? settingsFormik.errors.projectLink : undefined}
                    />
                  </div>

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
              <DashboardCard key={p._id} hover padding="md" className="cursor-pointer" onClick={() => { dispatch(setSelectedProject(p)); setDetailTab("overview"); }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-[#8E8E93]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{p.projectName}</h3>
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

                {p.projectLink && (
                  <div className="mb-4">
                    <a href={p.projectLink} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1.5 text-xs text-[#007AFF] hover:underline">
                      <FolderKanban className="w-3 h-3" />
                      {p.projectLink.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Updated {p.updatedAt}</span>
                  <DashboardButton onClick={(e) => { e.stopPropagation(); dispatch(setSelectedProject(p)); setDetailTab("overview"); }} className="text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] hover:text-[#636363] dark:hover:text-[#999] gap-1">
                    Open <FolderKanban className="w-3 h-3" />
                  </DashboardButton>
                </div>
              </DashboardCard>
            ))}
          </div>
        </>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
