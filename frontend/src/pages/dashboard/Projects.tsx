import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { motion } from "framer-motion";
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
  Search,
  Clock,
  ChevronRight,
  Globe,
} from "lucide-react";

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
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
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
  description: z.string().trim().max(500, "Description is too long").optional().or(z.literal("")),
  projectLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

const createSecretSchema = z.object({
  secName: z.string().trim().min(1, "Secret name is required"),
  secKey: z.string().trim().min(1, "Secret key is required"),
  environmentId: z.string().optional(),
});

const editSecretSchema = z.object({
  secName: z.string().trim().optional(),
  secKey: z.string().trim().optional(),
  environmentId: z.string().optional(),
});

const environmentSchema = z.object({
  name: z.string().trim().min(1, "Environment name is required"),
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5 cursor-pointer transition-all duration-200 hover:border-white/[0.10] hover:shadow-xl group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <FolderKanban className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">{project.projectName}</h3>
            {project.description && (
              <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5 line-clamp-1">{project.description}</p>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 dark:text-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-white/40">
        <span className="flex items-center gap-1.5">
          <KeyRound className="w-3 h-3" />{project.secretCount || 0} secrets
        </span>
        <span className="flex items-center gap-1.5">
          <Layers3 className="w-3 h-3" />{project.environmentCount || 0} envs
        </span>
      </div>
      <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-200 dark:border-white/[0.06]">
        <span className="text-[11px] text-gray-400 dark:text-white/30">
          Updated {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : ""}
        </span>
      </div>
    </motion.div>
  );
}

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
  const [confirmSecretDelete, setConfirmSecretDelete] = useState<string | null>(null);
  const [confirmEnvDelete, setConfirmEnvDelete] = useState<string | null>(null);

  const params = useParams<{ projectId: string }>();
  const urlProjectId = params.projectId;
  const urlPathTab = location.pathname.endsWith("/secrets") ? "secrets" : location.pathname.endsWith("/environments") ? "environments" : "overview";
  const [urlError, setUrlError] = useState(false);

  const { data: projectById, isLoading: projectByIdLoading, isError: projectByIdError } = useGetProjectByIdQuery(
    urlProjectId!,
    { skip: !urlProjectId }
  );
  const detailLoading = !!(urlProjectId && projectByIdLoading);

  useEffect(() => {
    if (!urlProjectId) {
      setSelectedProject(null);
      setUrlError(false);
      setDetailTab("overview");
    }
  }, [urlProjectId]);

  useEffect(() => {
    if (urlProjectId && projectById) {
      setUrlError(false);
      setSelectedProject(projectById);
      setDetailTab(urlPathTab as DetailTab);
    }
  }, [urlProjectId, projectById, urlPathTab]);

  const projectId = selectedProject?._id || "";

  const { data: projectSecrets = [], isLoading: secretsLoading } = useGetSecretsQuery(projectId, { skip: !projectId });
  const { data: projectEnvironments = [], isLoading: envsLoading } = useGetEnvironmentsQuery(projectId, { skip: !projectId });

  const [createSecret] = useCreateSecretMutation();
  const [updateSecret] = useUpdateSecretMutation();
  const [deleteSecret] = useDeleteSecretMutation();

  const [createEnvironment] = useCreateEnvironmentMutation();
  const [updateEnvironment] = useUpdateEnvironmentMutation();
  const [deleteEnvironment] = useDeleteEnvironmentMutation();
  const [addTeamToProject] = useAddTeamToProjectMutation();
  const [removeTeamFromProject] = useRemoveTeamFromProjectMutation();

  const { activeTeamId } = useActiveTeamContext();
  const { currentUserId } = useTeamRole(activeTeamId);

  const projectRole = selectedProject?.role ?? (activeTeamId ? "viewer" : "owner");
  const canCreate = ["owner", "admin", "developer"].includes(projectRole);
  const canDeleteResource = (resourceUserId: string | undefined) => {
    if (!resourceUserId) return false;
    if (projectRole === "owner" || projectRole === "admin") return true;
    if (projectRole === "developer") return resourceUserId === currentUserId;
    return false;
  };

  useEffect(() => {
    if (location.state?.openNewProject) {
      setShowCreateModal(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  const filtered = projects.filter((p) =>
    p.projectName.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? "").toLowerCase().includes(search.toLowerCase())
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
    enableReinitialize: true,
    initialValues: {
      name: selectedProject?.projectName ?? "",
      description: selectedProject?.description ?? "",
      projectLink: selectedProject?.projectLink ?? "",
    },
    validate: validateZod(updateProjectSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!selectedProject) return;
      try {
        await updateProject({ projectId: selectedProject._id, projectName: values.name, description: values.description, projectLink: values.projectLink || undefined }).unwrap();
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
    validate: (values) => validateZod(editingSecret ? editSecretSchema : createSecretSchema)(values),
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
      await createProject({ projectName: values.projectName, description: values.description, projectLink: values.projectLink || undefined, teamId: values.team || undefined }).unwrap();
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
    secretFormik.setValues({ secName: secret.secName, secKey: "", environmentId: secret.environmentId || "" });
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

  const isMember = !urlProjectId || (!projectByIdError && !!projectById);

  if (projectsLoading || detailLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (urlError || !isMember || (urlProjectId && (projectByIdError || !projectById))) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-5">
            <FolderKanban className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] mb-2">Project not found</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6">The project you're looking for doesn't exist or you don't have access to it.</p>
          <button type="button" onClick={() => navigate("/dashboard/projects", { replace: true })} className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-colors">
            Back to Projects
          </button>
        </div>
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
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 pb-8 overflow-y-auto">
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => { setSelectedProject(null); setDetailTab("overview"); settingsFormik.resetForm(); navigate("/dashboard/projects"); }}
          className="cursor-pointer p-2 rounded-xl text-gray-500 dark:text-white/40 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA] truncate">{selectedProject.projectName}</h1>
          {selectedProject.description && (
            <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5 truncate">{selectedProject.description}</p>
          )}
        </div>
        <button
          type="button"
          onClick={openSettingsForm}
          disabled={!canCreate}
          className="h-9 px-4 text-xs font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 flex-shrink-0"
        >
          <Settings className="w-3.5 h-3.5" />Settings
        </button>
      </div>

      <FilterTabs
        options={detailTabs.map((t) => t.label)}
        value={detailTabs.find((t) => t.value === detailTab)?.label || "Overview"}
        onChange={(v) => {
          const tab = detailTabs.find((t) => t.label === v)?.value || "overview";
          if (tab === "secrets") { setEnvView("list"); setSelectedEnvId(""); setEnvFilter(""); }
          setDetailTab(tab);
          if (selectedProject) {
            const base = `/dashboard/project/${selectedProject._id}`;
            if (tab === "secrets") navigate(`${base}/secrets`);
            else if (tab === "environments") navigate(`${base}/environments`);
            else navigate(base);
          }
        }}
      />

      <div className="mt-6">
        {detailTab === "overview" && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {projectSecrets.length === 0 && projectEnvironments.length === 0 && !selectedProject.teamId ? (
              <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                    <FolderKanban className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">This project is empty</h3>
                  <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">Add environments and secrets to get started with {selectedProject.projectName}.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    {canCreate && (
                      <>
                        <button type="button" onClick={openCreateEnv} className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-colors inline-flex items-center gap-2">
                          <Layers3 className="w-4 h-4" />Add Environment
                        </button>
                        <button type="button" onClick={() => { setDetailTab("teams"); }} className="cursor-pointer h-10 px-5 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-colors inline-flex items-center gap-2">
                          <Users className="w-4 h-4" />Assign Team
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : null}

            <motion.div variants={cardVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Secrets", value: projectSecrets.length, icon: KeyRound },
                { label: "Environments", value: projectEnvironments.length, icon: Layers3 },
                { label: "Team", value: (() => { const team = allTeams.find((t: Team) => t._id === selectedProject.teamId); return team ? team.name : selectedProject.teamId ? "Unknown" : "Personal"; })(), icon: Users, isText: true },
                { label: "Created", value: new Date(selectedProject.createdAt ?? (parseInt(selectedProject._id.substring(0, 8), 16) * 1000)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), icon: Clock, isText: true },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-white/40" />
                      <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide uppercase">{stat.label}</p>
                    </div>
                    <p className={`${(stat as any).isText ? "text-sm" : "text-2xl"} font-semibold text-gray-900 dark:text-[#FAFAFA]`}>{stat.value}</p>
                  </div>
                );
              })}
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Project Information</h3>
                      <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">General details about this project.</p>
                    </div>
                    <button type="button" onClick={openSettingsForm} disabled={!canCreate} className="h-8 px-3 text-xs font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5">
                      <Settings className="w-3 h-3" />Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Name</p>
                      <p className="text-sm text-gray-900 dark:text-[#FAFAFA]">{selectedProject.projectName}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Description</p>
                      <p className="text-sm text-gray-700 dark:text-white/60">{selectedProject.description || "—"}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1">Repository</p>
                      {selectedProject.projectLink ? (
                        <a href={selectedProject.projectLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {selectedProject.projectLink}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400 dark:text-white/30">—</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button type="button" onClick={() => { setDetailTab("secrets"); }} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start">
                      <KeyRound className="w-4 h-4" />Manage Secrets
                    </button>
                    <button type="button" onClick={() => { setDetailTab("environments"); }} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start">
                      <Layers3 className="w-4 h-4" />Manage Environments
                    </button>
                    <button type="button" onClick={() => { setDetailTab("teams"); }} className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-white/70 hover:text-accent hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200 justify-start">
                      <Users className="w-4 h-4" />Assigned Teams
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {detailTab === "secrets" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                {selectedEnvId ? (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => { setSelectedEnvId(""); setEnvView("list"); setEnvFilter(""); setDetailTab("environments"); }} className="cursor-pointer h-8 px-3 text-xs font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200 inline-flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" />Back
                    </button>
                    <span className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">
                      {projectEnvironments.find((e) => e._id === selectedEnvId)?.name} secrets
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="relative flex-1 max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 dark:text-white/40" />
                      <input
                        type="text"
                        value={projectSearch}
                        onChange={(e) => setProjectSearch(e.target.value)}
                        placeholder="Search secrets..."
                        className="w-full h-9 pl-10 pr-3 text-sm bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-white placeholder-gray-400 dark:placeholder-white/30 transition-colors duration-200 focus:border-white/[0.12]"
                      />
                    </div>
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
                <button type="button" onClick={openCreateSecret} disabled={projectEnvironments.length === 0} title={projectEnvironments.length === 0 ? "Create an environment first" : undefined} className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 glow-accent">
                  <Plus className="w-3.5 h-3.5" />Add Secret
                </button>
              )}
            </div>

            {secretsLoading || envsLoading ? (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8 flex items-center justify-center"><LoadingSpinner size={24} /></div>
            ) : projectEnvironments.length === 0 ? (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Layers3 className="w-10 h-10 text-gray-400 dark:text-white/30 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">No environments yet</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mb-4">
                    You need at least one environment before adding secrets.{" "}
                    {canCreate && <span className="underline cursor-pointer text-accent hover:text-accent/80" onClick={openCreateEnv}>Create one</span>}
                  </p>
                </div>
              </div>
            ) : filteredSecrets.length === 0 ? (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <KeyRound className="w-10 h-10 text-gray-400 dark:text-white/30 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">No secrets yet</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mb-4">Add your first secret to this project.</p>
                  {canCreate && (
                    <button type="button" onClick={openCreateSecret} disabled={projectEnvironments.length === 0} className="h-8 px-4 text-xs font-medium text-white bg-accent rounded-xl disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5">
                      <Plus className="w-3 h-3" />Add Secret
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredSecrets.map((s) => (
                  <div key={s._id} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-4 hover:border-white/[0.10] transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{s.secName}</p>
                        <p className="text-[11px] text-gray-400 dark:text-white/30 font-mono mt-0.5 tracking-widest select-none">
                          ••••••••••••••••
                        </p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <div className="hidden sm:block w-px h-6 bg-gray-200 dark:bg-white/[0.06]" />
                        <div className="flex items-center gap-2">
                          <Select
                            value={s.environmentId || ""}
                            onChange={(v) => handleSecretEnvChange(s._id, v)}
                            options={projectEnvironments.map((e) => ({ label: e.name, value: e._id }))}
                            className="min-w-[100px]"
                          />
                        </div>
                        <div className="w-px h-6 bg-gray-200 dark:bg-white/[0.06]" />
                        <div className="flex items-center gap-1">
                          {canCreate && (
                            <button type="button" onClick={() => openEditSecret(s)} className="cursor-pointer h-7 w-7 p-0 rounded-lg text-gray-500 dark:text-white/40 hover:text-accent hover:bg-accent/10 transition-all duration-200 inline-flex items-center justify-center">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                          )}
                          {canDeleteResource(s.userId) && (
                            <button type="button" onClick={() => setConfirmSecretDelete(s._id)} className="cursor-pointer h-7 w-7 p-0 rounded-lg text-gray-500 dark:text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 inline-flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {detailTab === "environments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-white/40">{projectEnvironments.length} environments</p>
              {canCreate && (
                <button type="button" onClick={openCreateEnv} className="cursor-pointer h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2 glow-accent">
                  <Plus className="w-4 h-4" />Add Environment
                </button>
              )}
            </div>

            {envsLoading ? (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8 flex items-center justify-center"><LoadingSpinner size={24} /></div>
            ) : projectEnvironments.length === 0 ? (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-8">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Layers3 className="w-10 h-10 text-gray-400 dark:text-white/30 mb-3" />
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">No environments yet</h3>
                  <p className="text-xs text-gray-500 dark:text-white/40 mb-4">Create environments like Development, Staging, and Production.</p>
                  {canCreate && (
                    <button type="button" onClick={openCreateEnv} className="cursor-pointer h-8 px-4 text-xs font-medium text-white bg-accent rounded-xl inline-flex items-center gap-1.5">
                      <Plus className="w-3 h-3" />Add Environment
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectEnvironments.map((env) => {
                  const envSecretCount = projectSecrets.filter((s) => s.environmentId === env._id).length;
                  return (
                    <div
                      key={env._id}
                      className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-4 cursor-pointer transition-all duration-200 hover:border-white/[0.10] hover:shadow-xl group"
                      onClick={() => handleEnvClick(env._id)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center">
                            <Layers3 className="w-4 h-4 text-gray-500 dark:text-white/40" />
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">{env.name}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {canCreate && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); openEditEnv(env); }} className="cursor-pointer h-7 w-7 p-0 rounded-lg text-gray-500 dark:text-white/40 hover:text-accent hover:bg-accent/10 transition-all duration-200 inline-flex items-center justify-center">
                              <Settings className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {canDeleteResource(env.userId) && (
                            <button type="button" onClick={(e) => { e.stopPropagation(); setConfirmEnvDelete(env._id); }} className="cursor-pointer h-7 w-7 p-0 rounded-lg text-gray-500 dark:text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 inline-flex items-center justify-center">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40">
                        <span>{envSecretCount} secrets</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {detailTab === "teams" && (
          <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">Assigned Teams</h3>
                <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">{selectedProject.teamId ? `Assigned to a team` : "Not assigned to any team."}</p>
              </div>
            </div>
            <div className="space-y-1">
              {allTeams.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-white/40 py-4 text-center">No teams available. Create a team first.</p>
              ) : (
                allTeams.map((team: Team) => {
                  const isAssigned = selectedProject.teamId === team._id;
                  return (
                    <div key={team._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-colors duration-200">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-white/40 flex-shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{team.name}</p>
                          <p className="text-[11px] text-gray-500 dark:text-white/40">{team.slug}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (isAssigned) {
                            try {
                              await removeTeamFromProject({ projectId: selectedProject._id }).unwrap();
                              showSuccess("Team removed", `"${team.name}" has been removed from the project.`);
                            } catch { showError("Failed to remove team"); }
                          } else {
                            try {
                              await addTeamToProject({ projectId: selectedProject._id, teamId: team._id }).unwrap();
                              showSuccess("Team assigned", `"${team.name}" has been assigned to the project.`);
                            } catch { showError("Failed to assign team"); }
                          }
                        }}
                        className={`cursor-pointer h-7 px-3 text-xs font-medium rounded-lg transition-all duration-200 ${isAssigned ? "text-red-400 bg-red-500/10 hover:bg-red-500/20" : "text-white bg-accent hover:bg-accent/90"}`}
                      >
                        {isAssigned ? "Remove" : "Assign"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {detailTab === "settings" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">Project Settings</h3>
              <p className="text-[11px] text-gray-500 dark:text-white/40 mb-5">Modify your project details.</p>
              <form onSubmit={settingsFormik.handleSubmit} noValidate>
                <div className="space-y-4">
                  <FormField label="Project Name" name="name" placeholder={settingsFormik.values.name || "e.g. Acme API"} value={settingsFormik.values.name} onChange={(v) => settingsFormik.setFieldValue("name", v)} onBlur={settingsFormik.handleBlur} error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined} touched={!!settingsFormik.touched.name} required />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="block text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">URL</label>
                      <div className="relative group">
                        <HelpCircle className="w-3.5 h-3.5 text-gray-500 dark:text-white/40 cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 px-3 py-2 text-[11px] text-white bg-[#18181B] rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 border border-gray-200 dark:border-white/[0.06]">
                          Link to the project — live site, deployed app, or GitHub/GitLab repository URL.
                        </div>
                      </div>
                    </div>
                    <FormInput value={settingsFormik.values.projectLink} onChange={(v) => settingsFormik.setFieldValue("projectLink", v)} onBlur={settingsFormik.handleBlur} placeholder={settingsFormik.values.projectLink || "https://example.com"} error={settingsFormik.touched.projectLink ? settingsFormik.errors.projectLink : undefined} />
                  </div>
                  <FormTextarea label="Description" name="description" placeholder={settingsFormik.values.description || "Describe what this project is for..."} value={settingsFormik.values.description} onChange={(v) => settingsFormik.setFieldValue("description", v)} error={settingsFormik.touched.description ? settingsFormik.errors.description : undefined} touched={!!settingsFormik.touched.description} rows={3} />
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-white/[0.06]">
                  <button type="submit" disabled={settingsFormik.isSubmitting} className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                    {settingsFormik.isSubmitting ? <CheckCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            {canDeleteResource(selectedProject?.userId) && (
              <div className="bg-white dark:bg-[#111113] rounded-2xl border border-red-500/20 p-5">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">Danger Zone</h3>
                <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Delete Project</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Permanently delete this project and all its data.</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowDeleteModal(true)} className="cursor-pointer w-full h-9 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-500/90 transition-all duration-200 inline-flex items-center justify-center gap-2">
                  <Trash2 className="w-4 h-4" />Delete Project
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal
        open={showSecretModal}
        onClose={() => { setShowSecretModal(false); setEditingSecret(null); }}
        title={editingSecret ? "Edit Secret" : "Create Secret"}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setShowSecretModal(false); setEditingSecret(null); }} className="cursor-pointer h-9 px-4 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200">Cancel</button>
            <button type="button" onClick={() => secretFormik.handleSubmit()} className="cursor-pointer h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200">
              {editingSecret ? "Save" : "Create"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Secret Name" name="secName" placeholder={secretFormik.values.secName || "e.g. DATABASE_URL"} value={secretFormik.values.secName} onChange={(v) => secretFormik.setFieldValue("secName", v)} onBlur={secretFormik.handleBlur} error={secretFormik.touched.secName ? secretFormik.errors.secName : undefined} touched={!!secretFormik.touched.secName} required={!editingSecret} />
          <FormField label="Secret Value" name="secKey" placeholder={editingSecret ? "Leave blank to keep current value" : "e.g. postgres://..."} value={secretFormik.values.secKey} onChange={(v) => secretFormik.setFieldValue("secKey", v)} onBlur={secretFormik.handleBlur} error={secretFormik.touched.secKey ? secretFormik.errors.secKey : undefined} touched={!!secretFormik.touched.secKey} required={!editingSecret} />
          {projectEnvironments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1.5">Environment</label>
              <Select
                value={secretFormik.values.environmentId || ""}
                onChange={(v) => secretFormik.setFieldValue("environmentId", v || undefined)}
                options={projectEnvironments.map((env) => ({ label: env.name, value: env._id }))}
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
            <button type="button" onClick={() => { setShowEnvModal(false); setEditingEnv(null); }} className="cursor-pointer h-9 px-4 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200">Cancel</button>
            <button type="button" onClick={() => envFormik.handleSubmit()} className="cursor-pointer h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200">
              {editingEnv ? "Save" : "Create"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Environment Name" name="name" placeholder={envFormik.values.name || "e.g. Development"} value={envFormik.values.name} onChange={(v) => envFormik.setFieldValue("name", v)} onBlur={envFormik.handleBlur} error={envFormik.touched.name ? envFormik.errors.name : undefined} touched={!!envFormik.touched.name} required />
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
        message="Secrets in this environment will not be deleted."
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
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 pb-8 overflow-y-auto">
      {projectDetail || (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Projects</h1>
              <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
            </div>
            <button type="button" onClick={() => setShowCreateModal(true)} className="cursor-pointer h-10 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2 glow-accent">
              <Plus className="w-4 h-4" />New Project
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full h-10 pl-10 pr-4 text-sm bg-gray-100 dark:bg-white/[0.04] rounded-xl border border-gray-200 dark:border-white/[0.06] outline-none text-white placeholder-gray-400 dark:placeholder-white/30 transition-colors duration-200 focus:border-white/[0.12]"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
              <FolderKanban className="w-12 h-12 text-gray-400 dark:text-white/30 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">{search ? "No results found" : "No projects yet"}</h3>
              <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">
                {search ? "Try a different search term." : "You don't have any projects yet. Create one to start managing your secrets and environments."}
              </p>
              {!search && (
                <button type="button" onClick={() => setShowCreateModal(true)} className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2 glow-accent">
                  <Plus className="w-4 h-4" />Create Your First Project
                </button>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1"
            >
              {(() => {
                const teamMap = new Map(allTeams.map((t: Team) => [t._id, t.name]));
                const personal = filtered.filter((p) => !p.teamId);
                const teamProjects = filtered.filter((p) => p.teamId);
                const grouped = new Map<string, typeof teamProjects>();
                teamProjects.forEach((p) => {
                  const name = teamMap.get(p.teamId!) || "Unknown Team";
                  if (!grouped.has(name)) grouped.set(name, []);
                  grouped.get(name)!.push(p);
                });

                return (
                  <>
                    {personal.length > 0 && (
                      <div className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-white/40 mb-4 uppercase tracking-wider">Personal Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {personal.map((p) => (
                            <ProjectCard key={p._id} project={p} onClick={() => navigate(`/dashboard/project/${p._id}`)} />
                          ))}
                        </div>
                      </div>
                    )}
                    {Array.from(grouped.entries()).map(([teamName, projects]) => (
                      <div key={teamName} className="mb-8">
                        <h2 className="text-sm font-semibold text-gray-500 dark:text-white/40 mb-4 uppercase tracking-wider flex items-center gap-2">
                          <Users className="w-3.5 h-3.5" />{teamName}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                          {projects.map((p) => (
                            <ProjectCard key={p._id} project={p} onClick={() => navigate(`/dashboard/project/${p._id}`)} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                );
              })()}
            </motion.div>
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
