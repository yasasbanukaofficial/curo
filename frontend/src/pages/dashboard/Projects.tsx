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
  Eye,
  EyeOff,
  Copy,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import CreateProjectModal from "../../components/dashboard/CreateProjectModal";
import FilterTabs from "../../components/dashboard/FilterTabs";
import FormField from "../../components/dashboard/FormField";
import FormInput from "../../components/dashboard/FormInput";
import FormTextarea from "../../components/dashboard/FormTextarea";
import Select from "../../components/dashboard/Select";
import AlertModal from "../../components/dashboard/AlertModal";
import Modal from "../../components/dashboard/Modal";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import {
  useGetProjectsQuery,
  useGetTeamsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetSecretsQuery,
  useCreateSecretMutation,
  useUpdateSecretMutation,
  useDeleteSecretMutation,
  useGetEnvironmentsQuery,
  useCreateEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useDeleteEnvironmentMutation,
} from "../../store";
import type { Project, Secret, Environment, Team } from "../../types";
import { useActiveTeamContext } from "../../contexts/ActiveTeamContext";
import { useTeamRole } from "../../hooks/useTeamRole";

type DetailTab = "overview" | "secrets" | "environments" | "teams" | "settings";
type EnvView = "list" | "secrets";

const updateProjectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(100, "Name is too long"),
  description: z.string().trim().min(1, "Description is required").max(500, "Description is too long"),
  projectLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const secretSchema = z.object({
  secName: z.string().trim().min(1, "Secret name is required"),
  secKey: z.string().trim().min(1, "Secret key is required"),
  environmentId: z.string().optional(),
});

const environmentSchema = z.object({
  name: z.string().trim().min(1, "Environment name is required"),
});

export default function Projects() {
  const { success: showSuccess, error: showError } = useToast();

  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();
  const { data: allTeams = [] } = useGetTeamsQuery();

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showSecretModal, setShowSecretModal] = useState(false);
  const [editingSecret, setEditingSecret] = useState<Secret | null>(null);
  const [showEnvModal, setShowEnvModal] = useState(false);
  const [editingEnv, setEditingEnv] = useState<Environment | null>(null);
  const [envFilter, setEnvFilter] = useState("");
  const [_envView, setEnvView] = useState<EnvView>("list");
  const [selectedEnvId, setSelectedEnvId] = useState<string>("");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const [confirmSecretDelete, setConfirmSecretDelete] = useState<string | null>(null);
  const [confirmEnvDelete, setConfirmEnvDelete] = useState<string | null>(null);

  const projectId = selectedProject?._id || "";

  const { data: projectSecrets = [], isLoading: secretsLoading } = useGetSecretsQuery(projectId, { skip: !projectId });
  const { data: projectEnvironments = [], isLoading: envsLoading } = useGetEnvironmentsQuery(projectId, { skip: !projectId });

  const [createSecret] = useCreateSecretMutation();
  const [updateSecret] = useUpdateSecretMutation();
  const [deleteSecret] = useDeleteSecretMutation();

  const [createEnvironment] = useCreateEnvironmentMutation();
  const [updateEnvironment] = useUpdateEnvironmentMutation();
  const [deleteEnvironment] = useDeleteEnvironmentMutation();

  const { activeTeamId } = useActiveTeamContext();
  const { canCreate, canDeleteResource } = useTeamRole(activeTeamId);

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

  function handleEnvClick(envId: string) {
    setSelectedEnvId(envId);
    setEnvView("secrets");
    setDetailTab("secrets");
  }

  const activeEnvId = selectedEnvId || envFilter;
  const filteredSecrets = projectSecrets.filter((s) => {
    const matchesSearch = s.secName.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesEnv = !activeEnvId || s.environmentId === activeEnvId;
    return matchesSearch && matchesEnv;
  });

  const settingsFormik = useFormik({
    initialValues: { name: "", description: "", projectLink: "" },
    validate: validateZod(updateProjectSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedProject) return;
      try {
        await updateProject({ projectId: selectedProject._id, projectName: values.name, description: values.description }).unwrap();
        showSuccess("Project saved", "Project settings have been updated.");
      } catch (err: any) {
        showError(err?.data?.msg || "Failed to update project");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const secretFormik = useFormik({
    initialValues: { secName: "", secKey: "", environmentId: "" },
    validate: validateZod(secretSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedProject) return;
      try {
        if (editingSecret) {
          await updateSecret({ projectId: selectedProject._id, secretId: editingSecret._id, secName: values.secName, secKey: values.secKey, environmentId: values.environmentId || undefined }).unwrap();
        } else {
          await createSecret({ projectId: selectedProject._id, secName: values.secName, secKey: values.secKey, environmentId: values.environmentId || undefined }).unwrap();
        }
        setShowSecretModal(false);
        setEditingSecret(null);
        resetForm();
        showSuccess("Secret saved", "The secret has been saved.");
      } catch (err: any) {
        showError(err?.data?.msg || "Failed to save secret");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const envFormik = useFormik({
    initialValues: { name: "" },
    validate: validateZod(environmentSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedProject) return;
      try {
        if (editingEnv) {
          await updateEnvironment({ projectId: selectedProject._id, envId: editingEnv._id, name: values.name }).unwrap();
        } else {
          await createEnvironment({ projectId: selectedProject._id, name: values.name }).unwrap();
        }
        setShowEnvModal(false);
        setEditingEnv(null);
        resetForm();
        showSuccess("Environment saved", "The environment has been saved.");
      } catch (err: any) {
        showError(err?.data?.msg || "Failed to save environment");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function openSettingsForm() {
    if (!selectedProject) return;
    if (!canCreate) return;
    settingsFormik.setValues({ name: selectedProject.projectName, description: selectedProject.description, projectLink: selectedProject.projectLink || "" });
    setDetailTab("settings");
  }

  async function handleDeleteProject() {
    if (!selectedProject) return;
    try {
      await deleteProject(selectedProject._id).unwrap();
      setSelectedProject(null);
      setShowDeleteModal(false);
      showSuccess("Project deleted", `${selectedProject.projectName} has been removed.`);
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to delete project");
    }
  }

  async function handleCreateProject(values: { projectName: string; description: string; team?: string; projectLink?: string }) {
    try {
      await createProject({ projectName: values.projectName, description: values.description, projectLink: values.projectLink || undefined, teamId: activeTeamId || undefined }).unwrap();
      showSuccess("Project created", `${values.projectName} has been created.`);
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to create project");
    }
  }

  async function handleConfirmSecretDelete() {
    if (!selectedProject || !confirmSecretDelete) return;
    try {
      await deleteSecret({ projectId: selectedProject._id, secretId: confirmSecretDelete }).unwrap();
      setConfirmSecretDelete(null);
      showSuccess("Secret deleted", "The secret has been removed.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to delete secret");
    }
  }

  async function handleConfirmEnvDelete() {
    if (!selectedProject || !confirmEnvDelete) return;
    try {
      await deleteEnvironment({ projectId: selectedProject._id, envId: confirmEnvDelete }).unwrap();
      setConfirmEnvDelete(null);
      showSuccess("Environment deleted", "The environment has been removed.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to delete environment");
    }
  }

  function openCreateSecret() {
    setEditingSecret(null);
    secretFormik.resetForm();
    setShowSecretModal(true);
    if (selectedEnvId) {
      secretFormik.setFieldValue("environmentId", selectedEnvId);
    }
  }

  function openEditSecret(secret: Secret) {
    setEditingSecret(secret);
    secretFormik.setValues({ secName: secret.secName, secKey: secret.secKey, environmentId: secret.environmentId || "" });
    setShowSecretModal(true);
  }

  function openCreateEnv() {
    setEditingEnv(null);
    envFormik.resetForm();
    setShowEnvModal(true);
  }

  function openEditEnv(env: Environment) {
    setEditingEnv(env);
    envFormik.setValues({ name: env.name });
    setShowEnvModal(true);
  }

  async function handleSecretEnvChange(secretId: string, environmentId: string) {
    if (!selectedProject) return;
    try {
      await updateSecret({ projectId: selectedProject._id, secretId, environmentId: environmentId || undefined }).unwrap();
      showSuccess("Environment updated", "Secret environment has been updated.");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to update environment");
    }
  }

  function copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    showSuccess("Copied", "Value copied to clipboard.");
  }

  if (projectsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  const detailTabs = [
    { label: "Overview", value: "overview" as DetailTab },
    { label: "All Secrets", value: "secrets" as DetailTab },
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
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.projectName}</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedProject.description}</p>
        </div>
      </div>

      <FilterTabs
        options={detailTabs.map((t) => t.label)}
        value={detailTabs.find((t) => t.value === detailTab)?.label || "Overview"}
        onChange={(v) => {
          const tab = detailTabs.find((t) => t.label === v)?.value || "overview";
          if (tab === "secrets") { setEnvView("list"); setSelectedEnvId(""); setEnvFilter(""); }
          setDetailTab(tab);
        }}
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
                  <DashboardButton onClick={openSettingsForm} disabled={!canCreate} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#F5F5F7] dark:disabled:hover:bg-[#1A1A1A]">
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
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : ""}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Secrets</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{projectSecrets.length} secrets</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Environments</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{projectEnvironments.length} environments</p>
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
                  <DashboardButton onClick={() => { setDetailTab("secrets"); }} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><KeyRound className="w-4 h-4" />Manage Secrets</DashboardButton>
                  <DashboardButton onClick={() => { setDetailTab("environments"); }} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Layers3 className="w-4 h-4" />Manage Environments</DashboardButton>
                  <DashboardButton onClick={() => { setDetailTab("teams"); }} className="w-full h-9 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222] justify-start"><Users className="w-4 h-4" />Assigned Teams</DashboardButton>
                </div>
              </DashboardCard>
              {canDeleteResource(selectedProject?.userId) && (
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
              )}
            </div>
          </div>
        )}

        {detailTab === "secrets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {selectedEnvId ? (
                  <div className="flex items-center gap-2">
                    <DashboardButton onClick={() => { setSelectedEnvId(""); setEnvView("list"); setEnvFilter(""); setDetailTab("environments"); }} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
                      <ArrowLeft className="w-3.5 h-3.5" />Back
                    </DashboardButton>
                    <span className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">
                      {projectEnvironments.find((e) => e._id === selectedEnvId)?.name} secrets
                    </span>
                  </div>
                ) : (
                  <>
                    <SearchInput value={projectSearch} onChange={setProjectSearch} placeholder="Search secrets..." className="max-w-[260px]" />
                    {projectEnvironments.length > 0 && (
                      <Select
                        value={envFilter}
                        onChange={(v) => setEnvFilter(v)}
                        options={[{ label: "All environments", value: "" }, ...projectEnvironments.map((env) => ({ label: env.name, value: env._id }))]}
                        className="w-40"
                      />
                    )}
                  </>
                )}
              </div>
              {canCreate && (
                <DashboardButton onClick={openCreateSecret} disabled={projectEnvironments.length === 0} title={projectEnvironments.length === 0 ? "Create an environment first" : undefined} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1D1D1F] dark:disabled:hover:bg-white">
                  <Plus className="w-3.5 h-3.5" />Add Secret
                </DashboardButton>
              )}
            </div>

            {secretsLoading || envsLoading ? (
              <DashboardCard><LoadingSpinner size={24} /></DashboardCard>
            ) : projectEnvironments.length === 0 ? (
              <DashboardCard>
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Layers3 className="w-10 h-10 text-[#8E8E93] mb-3" />
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No environments yet</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">
                    You need at least one environment before adding secrets.{" "}
                    {canCreate && <span className="underline cursor-pointer text-[#007AFF] hover:text-[#007AFF]/80" onClick={openCreateEnv}>Create one</span>}
                  </p>
                </div>
              </DashboardCard>
            ) : filteredSecrets.length === 0 ? (
              <DashboardCard>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <KeyRound className="w-10 h-10 text-[#8E8E93] mb-3" />
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No secrets yet</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">Add your first secret to this project.</p>
                  {canCreate && (
                    <DashboardButton onClick={openCreateSecret} disabled={projectEnvironments.length === 0} className="h-8 px-4 text-xs font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] disabled:opacity-40 disabled:cursor-not-allowed">
                      <Plus className="w-3.5 h-3.5" />Add Secret
                    </DashboardButton>
                  )}
                </div>
              </DashboardCard>
            ) : (
              <div className="space-y-1">
                {filteredSecrets.map((s) => {
                  const isRevealed = revealedKeys.has(s._id);
                  return (
                    <DashboardCard key={s._id} padding="sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <KeyRound className="w-4 h-4 text-[#8E8E93] flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{s.secName}</p>
                            <div className="flex flex-wrap items-center gap-3">
                              <Select
                                value={s.environmentId || ""}
                                onChange={(v) => handleSecretEnvChange(s._id, v)}
                                options={[{ label: "No env", value: "" }, ...projectEnvironments.map((e) => ({ label: e.name, value: e._id }))]}
                              />
                              <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">
                                {isRevealed ? s.secKey : "••••••••••••••••"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <DashboardButton onClick={() => { if (isRevealed) { setRevealedKeys((prev) => { const next = new Set(prev); next.delete(s._id); return next; }); } else { setRevealedKeys((prev) => new Set(prev).add(s._id)); } }} className="h-7 w-7 p-0 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </DashboardButton>
                          <DashboardButton onClick={() => copyToClipboard(s.secKey)} className="h-7 w-7 p-0 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
                            <Copy className="w-3.5 h-3.5" />
                          </DashboardButton>
                          {canCreate && (
                            <DashboardButton onClick={() => openEditSecret(s)} className="h-7 px-2 text-xs font-medium text-[#007AFF] hover:bg-[#007AFF]/10 rounded-lg">
                              Edit
                            </DashboardButton>
                          )}
                          {canDeleteResource(s.userId) && (
                            <DashboardButton onClick={() => setConfirmSecretDelete(s._id)} className="h-7 px-2 text-xs font-medium text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded-lg">
                              <Trash2 className="w-3 h-3" />
                            </DashboardButton>
                          )}
                        </div>
                      </div>
                    </DashboardCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {detailTab === "environments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#8E8E93] dark:text-[#666]">{projectEnvironments.length} environments</p>
              </div>
              {canCreate && (
                <DashboardButton onClick={openCreateEnv} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                  <Plus className="w-4 h-4" />Add Environment
                </DashboardButton>
              )}
            </div>

            {envsLoading ? (
              <DashboardCard><LoadingSpinner size={24} /></DashboardCard>
            ) : projectEnvironments.length === 0 ? (
              <DashboardCard>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Layers3 className="w-10 h-10 text-[#8E8E93] mb-3" />
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No environments yet</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">Create environments like Development, Staging, and Production.</p>
                  {canCreate && (
                    <DashboardButton onClick={openCreateEnv} className="h-8 px-4 text-xs font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px]">
                      <Plus className="w-3.5 h-3.5" />Add Environment
                    </DashboardButton>
                  )}
                </div>
              </DashboardCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectEnvironments.map((env) => {
                  const envSecretCount = projectSecrets.filter((s) => s.environmentId === env._id).length;
                  return (
                    <DashboardCard key={env._id} hover className="cursor-pointer" onClick={() => handleEnvClick(env._id)}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center">
                            <Layers3 className="w-4 h-4 text-[#8E8E93]" />
                          </div>
                          <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {canCreate && (
                            <DashboardButton onClick={(e) => { e.stopPropagation(); openEditEnv(env); }} className="h-7 w-7 p-0 rounded-lg text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#007AFF]/10">
                              <Settings className="w-3.5 h-3.5" />
                            </DashboardButton>
                          )}
                          {canDeleteResource(env.userId) && (
                            <DashboardButton onClick={(e) => { e.stopPropagation(); setConfirmEnvDelete(env._id); }} className="h-7 w-7 p-0 rounded-lg text-[#8E8E93] hover:text-[#FF3B30] hover:bg-[#FF3B30]/10">
                              <Trash2 className="w-3.5 h-3.5" />
                            </DashboardButton>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#8E8E93] dark:text-[#666]">
                        <span>{envSecretCount} secrets</span>
                      </div>
                    </DashboardCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {detailTab === "teams" && (
          <DashboardCard>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Assigned Teams</h3>
                <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">{(selectedProject.teams ?? []).length} teams assigned to this project.</p>
              </div>
            </div>
            <div className="space-y-1">
              {allTeams.length === 0 ? (
                <p className="text-sm text-[#8E8E93] dark:text-[#666] py-4 text-center">No teams available. Create a team first.</p>
              ) : (
                allTeams.map((team: Team) => {
                  const isAssigned = (selectedProject.teams ?? []).includes(team._id);
                  return (
                    <div key={team._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[#F5F5F7]/50 dark:hover:bg-[#1A1A1A]/50 transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-[#F5F5F7] dark:bg-[#1A1A1A] flex items-center justify-center text-xs font-semibold text-[#8E8E93] flex-shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] truncate">{team.name}</p>
                          <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">{team.slug}</p>
                        </div>
                      </div>
                      <DashboardButton
                        onClick={async () => {}}
                        className={`h-7 px-3 text-xs font-medium rounded-[8px] ${isAssigned ? "text-[#FF3B30] bg-[#FF3B30]/10 hover:bg-[#FF3B30]/20" : "text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"}`}
                      >
                        {isAssigned ? "Remove" : "Assign"}
                      </DashboardButton>
                    </div>
                  );
                })
              )}
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
                  <FormField label="Project Name" name="name" placeholder="e.g. Acme API" value={settingsFormik.values.name} onChange={(v) => settingsFormik.setFieldValue("name", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined} touched={!!settingsFormik.touched.name} required />
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
                    <FormInput value={settingsFormik.values.projectLink} onChange={(v) => settingsFormik.setFieldValue("projectLink", v)} onBlur={settingsFormik.handleBlur} placeholder="https://example.com" error={settingsFormik.touched.projectLink ? settingsFormik.errors.projectLink : undefined} />
                  </div>
                  <FormTextarea label="Description" name="description" placeholder="Describe what this project is for..." value={settingsFormik.values.description} onChange={(v) => settingsFormik.setFieldValue("description", v)} error={settingsFormik.touched.description ? settingsFormik.errors.description : undefined} touched={!!settingsFormik.touched.description} required rows={3} />
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

      <Modal
        open={showSecretModal}
        onClose={() => { setShowSecretModal(false); setEditingSecret(null); }}
        title={editingSecret ? "Edit Secret" : "Create Secret"}
        footer={
          <div className="flex items-center justify-end gap-3">
            <DashboardButton onClick={() => { setShowSecretModal(false); setEditingSecret(null); }} className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">Cancel</DashboardButton>
            <DashboardButton onClick={() => secretFormik.handleSubmit()} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
              {editingSecret ? "Save" : "Create"}
            </DashboardButton>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Secret Name" name="secName" placeholder="e.g. DATABASE_URL" value={secretFormik.values.secName} onChange={(v) => secretFormik.setFieldValue("secName", v)} onBlur={secretFormik.handleBlur} error={secretFormik.touched.secName ? secretFormik.errors.secName : undefined} touched={!!secretFormik.touched.secName} required />
          <FormField label="Secret Value" name="secKey" placeholder="e.g. postgres://..." value={secretFormik.values.secKey} onChange={(v) => secretFormik.setFieldValue("secKey", v)} onBlur={secretFormik.handleBlur} error={secretFormik.touched.secKey ? secretFormik.errors.secKey : undefined} touched={!!secretFormik.touched.secKey} required />
          {projectEnvironments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5">Environment</label>
              <Select
                value={secretFormik.values.environmentId || ""}
                onChange={(v) => secretFormik.setFieldValue("environmentId", v || undefined)}
                options={[{ label: "None (all environments)", value: "" }, ...projectEnvironments.map((env) => ({ label: env.name, value: env._id }))]}
              />
            </div>
          )}
        </div>
      </Modal>

      <Modal
        open={showEnvModal}
        onClose={() => { setShowEnvModal(false); setEditingEnv(null); }}
        title={editingEnv ? "Edit Environment" : "Create Environment"}
        footer={
          <div className="flex items-center justify-end gap-3">
            <DashboardButton onClick={() => { setShowEnvModal(false); setEditingEnv(null); }} className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">Cancel</DashboardButton>
            <DashboardButton onClick={() => envFormik.handleSubmit()} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
              {editingEnv ? "Save" : "Create"}
            </DashboardButton>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Environment Name" name="name" placeholder="e.g. Development" value={envFormik.values.name} onChange={(v) => envFormik.setFieldValue("name", v)} onBlur={envFormik.handleBlur} error={envFormik.touched.name ? envFormik.errors.name : undefined} touched={!!envFormik.touched.name} required />
        </div>
      </Modal>

      <AlertModal
        open={!!confirmSecretDelete}
        onClose={() => setConfirmSecretDelete(null)}
        variant="warning"
        title="Delete Secret"
        message="Are you sure you want to delete this secret? This action cannot be undone."
        buttons={[
          { label: "Cancel", onClick: () => setConfirmSecretDelete(null), variant: "secondary" },
          { label: "Delete", onClick: handleConfirmSecretDelete, variant: "destructive" },
        ]}
      />

      <AlertModal
        open={!!confirmEnvDelete}
        onClose={() => setConfirmEnvDelete(null)}
        variant="warning"
        title="Delete Environment"
        message="Are you sure you want to delete this environment? Secrets in this environment will not be deleted."
        buttons={[
          { label: "Cancel", onClick: () => setConfirmEnvDelete(null), variant: "secondary" },
          { label: "Delete", onClick: handleConfirmEnvDelete, variant: "destructive" },
        ]}
      />

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
                {filtered.length} projects
              </p>
            </div>
            <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
              <Plus className="w-4 h-4" />New Project
            </DashboardButton>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <FolderKanban className="w-12 h-12 text-[#8E8E93] mb-4" />
              <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No projects yet</h3>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6">Create your first project to get started.</p>
              <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
                <Plus className="w-4 h-4" />Add Project
              </DashboardButton>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <DashboardCard key={p._id} hover padding="md" className="cursor-pointer" onClick={() => { setSelectedProject(p); setDetailTab("overview"); }}>
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
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[#8E8E93] dark:text-[#666] flex items-center gap-1"><KeyRound className="w-3 h-3" />{p.secretCount || 0}</span>
                  <span className="text-xs text-[#8E8E93] dark:text-[#666] flex items-center gap-1"><Layers3 className="w-3 h-3" />{p.environmentCount || 0}</span>
                  <span className="text-xs text-[#8E8E93] dark:text-[#666] flex items-center gap-1"><Users className="w-3 h-3" />{p.teamCount || 0}</span>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/[0.04] dark:border-[#222]">
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Updated {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : ""}</span>
                </div>
              </DashboardCard>
            ))}
          </div>
          )}
        </>
      )}

      <CreateProjectModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateProject}
        teams={allTeams.map((t: Team) => ({ id: t._id, name: t.name }))}
      />
    </div>
  );
}
