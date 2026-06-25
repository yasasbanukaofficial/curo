import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import {
  CheckCircle,
  Plus,
  KeyRound,
  Users,
  ArrowLeft,
  Settings,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle as CheckCircleIcon,
  ExternalLink,
} from "lucide-react";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import FormField from "../../components/dashboard/FormField";
import FormSelect from "../../components/dashboard/FormSelect";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";

interface Environment {
  id: string;
  name: string;
  projectId: string;
  userId: string;
  secretCount: number;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: string;
  name: string;
}

const MOCK_ENVIRONMENTS: Environment[] = [
  { id: "env_1", name: "Development", projectId: "proj_1", userId: "user_1", secretCount: 342, projectName: "Acme API", createdAt: "2025-06-01", updatedAt: "2m ago" },
  { id: "env_2", name: "Staging", projectId: "proj_1", userId: "user_1", secretCount: 289, projectName: "Acme API", createdAt: "2025-06-15", updatedAt: "5m ago" },
  { id: "env_3", name: "Production", projectId: "proj_2", userId: "user_1", secretCount: 617, projectName: "Main App", createdAt: "2025-07-01", updatedAt: "1m ago" },
];

const MOCK_PROJECTS: Project[] = [
  { id: "proj_1", name: "Acme API" },
  { id: "proj_2", name: "Main App" },
  { id: "proj_3", name: "Mobile Backend" },
];

const createEnvironmentSchema = z.object({
  name: z.string().trim().min(1, "Environment name is required").max(50, "Name is too long"),
  projectId: z.string().min(1, "Project is required"),
});

const updateEnvironmentSchema = z.object({
  name: z.string().trim().min(1, "Environment name is required").max(50, "Name is too long"),
  projectId: z.string().min(1, "Project is required"),
});

export default function Environments() {
  const toast = useToast();
  const [environments, setEnvironments] = useState<Environment[]>(MOCK_ENVIRONMENTS);
  const [selectedEnv, setSelectedEnv] = useState<Environment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const createFormik = useFormik({
    initialValues: { name: "", projectId: "" },
    validate: validateZod(createEnvironmentSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const newEnv: Environment = {
        id: `env_${Date.now()}`,
        name: values.name,
        projectId: values.projectId,
        userId: "user_1",
        secretCount: 0,
        projectName: MOCK_PROJECTS.find((p) => p.id === values.projectId)?.name || "",
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: "Just now",
      };
      setEnvironments((prev) => [...prev, newEnv]);
      setSubmitting(false);
      setShowCreateModal(false);
      resetForm();
      toast.success("Environment created", `${newEnv.name} has been created.`);
    },
  });

  const settingsFormik = useFormik({
    initialValues: { name: "", projectId: "" },
    validate: validateZod(updateEnvironmentSchema),
    onSubmit: (values, { setSubmitting }) => {
      if (!selectedEnv) return;
      const updated: Environment = {
        ...selectedEnv,
        name: values.name,
        projectId: values.projectId,
        projectName: MOCK_PROJECTS.find((p) => p.id === values.projectId)?.name || "",
      };
      setEnvironments((prev) => prev.map((e) => e.id === selectedEnv.id ? updated : e));
      setSelectedEnv(updated);
      setSubmitting(false);
      toast.success("Environment saved", "Environment settings have been updated.");
    },
  });

  function openSettingsForm() {
    if (!selectedEnv) return;
    settingsFormik.setValues({ name: selectedEnv.name, projectId: selectedEnv.projectId });
  }

  function handleDeleteEnvironment() {
    if (!selectedEnv) return;
    setEnvironments((prev) => prev.filter((e) => e.id !== selectedEnv.id));
    setSelectedEnv(null);
    setShowDeleteModal(false);
    toast.success("Environment deleted", `${selectedEnv.name} has been removed.`);
  }

  if (selectedEnv) {
    return (
      <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
        <div className="flex items-center gap-3 mb-5">
          <DashboardButton onClick={() => { setSelectedEnv(null); settingsFormik.resetForm(); }} className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
            <ArrowLeft className="w-5 h-5" />
          </DashboardButton>
          <div className="flex items-center gap-3 flex-1">
            <CheckCircle className="w-6 h-6 text-[#30D158]" />
            <div>
              <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.name}</h1>
              <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">{selectedEnv.projectName}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 flex flex-col gap-6">
            <DashboardCard>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Environment Information</h3>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Details about this environment.</p>
                </div>
                <DashboardButton onClick={() => { openSettingsForm(); }} className="h-8 px-3 text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
                  <Settings className="w-3.5 h-3.5" />Edit
                </DashboardButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Name</p>
                  <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Project</p>
                  <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.projectName}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Created</p>
                  <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.createdAt}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1">Secrets</p>
                  <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.secretCount} secrets</p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard>
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">Settings</h3>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mb-5">Modify environment details.</p>
              <form onSubmit={settingsFormik.handleSubmit} noValidate>
                <div className="space-y-4 max-w-xl">
                  <FormField
                    label="Environment Name"
                    name="name"
                    placeholder="e.g. Production"
                    value={settingsFormik.values.name}
                    onChange={(v) => settingsFormik.setFieldValue("name", v)}
                    onBlur={settingsFormik.handleBlur}
                    error={settingsFormik.touched.name ? settingsFormik.errors.name : undefined}
                    touched={!!settingsFormik.touched.name}
                    required
                  />
                  <FormSelect
                    label="Project"
                    name="projectId"
                    value={settingsFormik.values.projectId}
                    onChange={(v) => settingsFormik.setFieldValue("projectId", v)}
                    options={MOCK_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
                    placeholder="Select a project"
                    error={settingsFormik.touched.projectId ? settingsFormik.errors.projectId : undefined}
                    touched={!!settingsFormik.touched.projectId}
                    required
                  />
                </div>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  <DashboardButton type="submit" disabled={settingsFormik.isSubmitting} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed">
                    {settingsFormik.isSubmitting ? <CheckCircleIcon className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </DashboardButton>
                </div>
              </form>
            </DashboardCard>
          </div>

          <div className="xl:col-span-1 flex flex-col gap-6">
            <DashboardCard>
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E8E93] dark:text-[#666]">
                    <KeyRound className="w-4 h-4" /> Secrets
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.secretCount}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-sm text-[#8E8E93] dark:text-[#666]">
                    <Users className="w-4 h-4" /> Project
                  </div>
                  <span className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{selectedEnv.projectName}</span>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
              <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Danger Zone</h3>
              <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4">
                <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Environment</p>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Permanently delete this environment and all its secrets.</p>
                </div>
              </div>
              <DashboardButton onClick={() => setShowDeleteModal(true)} className="w-full h-9 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90">
                <Trash2 className="w-4 h-4" />Delete Environment
              </DashboardButton>
            </DashboardCard>
          </div>
        </div>

        <AlertModal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          variant="warning"
          title="Delete Environment"
          message="Are you sure you want to delete this environment? All associated secrets will be removed."
          buttons={[
            { label: "Cancel", onClick: () => setShowDeleteModal(false), variant: "secondary" },
            { label: "Delete Environment", onClick: handleDeleteEnvironment, variant: "destructive" },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Environments</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {environments.length} environments · All systems operational
          </p>
        </div>
        <DashboardButton onClick={() => setShowCreateModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          Add Environment
        </DashboardButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {environments.map((env) => (
          <DashboardCard key={env.id} hover padding="lg" className="cursor-pointer" onClick={() => { setSelectedEnv(env); settingsFormik.resetForm(); }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[#30D158]" />
                <div>
                  <h3 className="text-base font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.name}</h3>
                  <p className="text-xs text-[#8E8E93] dark:text-[#666]">{env.projectName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <KeyRound className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.secretCount}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Secrets</p>
              </div>
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <Users className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.projectName}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Project</p>
              </div>
              <div className="bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl p-3">
                <ExternalLink className="w-3.5 h-3.5 text-[#8E8E93] mb-1.5" />
                <p className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">{env.createdAt}</p>
                <p className="text-[10px] text-[#8E8E93] dark:text-[#666]">Created</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-black/[0.04] dark:border-[#222]">
              <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">Updated {env.updatedAt}</span>
              <DashboardButton onClick={(e) => { e.stopPropagation(); setSelectedEnv(env); }} className="text-xs font-medium text-[#1D1D1F] dark:text-[#E5E5E5] hover:text-[#636363] dark:hover:text-[#999]">
                Open
              </DashboardButton>
            </div>
          </DashboardCard>
        ))}
      </div>

      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); createFormik.resetForm(); }}
        title="Add Environment"
        description="Create a new environment for your project."
        submitLabel="Create Environment"
        submitDisabled={createFormik.isSubmitting}
        loading={createFormik.isSubmitting}
        onSubmit={() => createFormik.handleSubmit()}
      >
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-4">
            <FormField
              label="Environment Name"
              name="name"
              placeholder="e.g. Production"
              value={createFormik.values.name}
              onChange={(v) => createFormik.setFieldValue("name", v)}
              onBlur={createFormik.handleBlur}
              error={createFormik.touched.name ? createFormik.errors.name : undefined}
              touched={!!createFormik.touched.name}
              required
            />
            <FormSelect
              label="Project"
              name="projectId"
              value={createFormik.values.projectId}
              onChange={(v) => createFormik.setFieldValue("projectId", v)}
              options={MOCK_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
              placeholder="Select a project"
              error={createFormik.touched.projectId ? createFormik.errors.projectId : undefined}
              touched={!!createFormik.touched.projectId}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
