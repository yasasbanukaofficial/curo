import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { Plus, KeyRound, MoreHorizontal, Edit3, Trash2, ShieldAlert } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import FilterTabs from "../../components/dashboard/FilterTabs";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import FormField from "../../components/dashboard/FormField";
import FormSelect from "../../components/dashboard/FormSelect";
import { EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";

interface Secret {
  id: string;
  secName: string;
  secKey: string;
  projectId: string;
  userId: string;
  environmentId: string;
  updatedAt: string;
  author: string;
}

interface Project {
  id: string;
  name: string;
}

interface Environment {
  id: string;
  name: string;
}

const MOCK_SECRETS: Secret[] = [
  { id: "sec_1", secName: "DATABASE_URL", secKey: "postgresql://prod:••••••@db.example.com:5432/main", projectId: "proj_1", userId: "user_1", environmentId: "env_3", updatedAt: "2m ago", author: "Yasas" },
  { id: "sec_2", secName: "OPENAI_API_KEY", secKey: "sk-proj-••••••••••••", projectId: "proj_1", userId: "user_2", environmentId: "env_3", updatedAt: "5m ago", author: "System" },
  { id: "sec_3", secName: "JWT_SECRET", secKey: "••••••••••••••••", projectId: "proj_1", userId: "user_1", environmentId: "env_3", updatedAt: "10m ago", author: "Yasas" },
  { id: "sec_4", secName: "STRIPE_API_KEY", secKey: "sk_live_••••••••••••", projectId: "proj_2", userId: "user_3", environmentId: "env_3", updatedAt: "18m ago", author: "Alex" },
  { id: "sec_5", secName: "REDIS_URL", secKey: "redis://:••••••@redis.example.com:6379", projectId: "proj_2", userId: "user_4", environmentId: "env_1", updatedAt: "25m ago", author: "Sam" },
  { id: "sec_6", secName: "SENDGRID_API_KEY", secKey: "SG.••••••••••••", projectId: "proj_3", userId: "user_1", environmentId: "env_2", updatedAt: "1h ago", author: "Yasas" },
  { id: "sec_7", secName: "AWS_ACCESS_KEY_ID", secKey: "AKIA••••••••••••", projectId: "proj_3", userId: "user_3", environmentId: "env_2", updatedAt: "2h ago", author: "Alex" },
  { id: "sec_8", secName: "GITHUB_TOKEN", secKey: "ghp_••••••••••••", projectId: "proj_2", userId: "user_4", environmentId: "env_1", updatedAt: "3h ago", author: "Sam" },
];

const MOCK_PROJECTS: Project[] = [
  { id: "proj_1", name: "Acme API" },
  { id: "proj_2", name: "Main App" },
  { id: "proj_3", name: "Mobile Backend" },
];

const MOCK_ENVIRONMENTS: Environment[] = [
  { id: "env_1", name: "Development" },
  { id: "env_2", name: "Staging" },
  { id: "env_3", name: "Production" },
];

const envFilters = ["all", "production", "staging", "development"] as const;
type EnvFilter = (typeof envFilters)[number];

function getEnvName(envId: string): string {
  return MOCK_ENVIRONMENTS.find((e) => e.id === envId)?.name || "unknown";
}

const createSecretSchema = z.object({
  secName: z.string().trim().min(2, "Secret name is too short").max(100, "Name is too long"),
  secKey: z.string().trim().min(2, "Secret key is too short"),
  projectId: z.string().min(1, "Project is required"),
  environmentId: z.string().optional(),
});

const updateSecretSchema = z.object({
  secName: z.string().trim().min(2, "Secret name is too short").max(100, "Name is too long"),
  secKey: z.string().trim().optional(),
  projectId: z.string().min(1, "Project is required"),
  environmentId: z.string().optional(),
});

export default function Secrets() {
  const toast = useToast();
  const [secrets, setSecrets] = useState<Secret[]>(MOCK_SECRETS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<EnvFilter>("all");
  const isAdmin = true;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editSecret, setEditSecret] = useState<Secret | null>(null);
  const [deleteSecret, setDeleteSecret] = useState<Secret | null>(null);

  useEffect(() => {
    if (!openDropdown) return;
    const handleClick = () => setOpenDropdown(null);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [openDropdown]);

  const filtered = secrets.filter((s) => {
    const q = search.toLowerCase();
    const envName = getEnvName(s.environmentId).toLowerCase();
    return s.secName.toLowerCase().includes(q) && (filter === "all" || envName === filter);
  });

  const createFormik = useFormik({
    initialValues: { secName: "", secKey: "", projectId: "", environmentId: "" },
    validate: validateZod(createSecretSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      const newSecret: Secret = {
        id: `sec_${Date.now()}`,
        secName: values.secName,
        secKey: values.secKey,
        projectId: values.projectId,
        userId: "user_1",
        environmentId: values.environmentId,
        updatedAt: "Just now",
        author: "You",
      };
      setSecrets((prev) => [...prev, newSecret]);
      setSubmitting(false);
      setShowCreateModal(false);
      resetForm();
      toast.success("Secret created", `${newSecret.secName} has been created.`);
    },
  });

  const editFormik = useFormik({
    initialValues: { secName: "", secKey: "", projectId: "", environmentId: "" },
    validate: validateZod(updateSecretSchema),
    onSubmit: (values, { setSubmitting }) => {
      if (!editSecret) return;
      const updated: Secret = {
        ...editSecret,
        secName: values.secName,
        secKey: values.secKey || editSecret.secKey,
        projectId: values.projectId,
        environmentId: values.environmentId,
        updatedAt: "Just now",
      };
      setSecrets((prev) => prev.map((s) => s.id === editSecret.id ? updated : s));
      setEditSecret(null);
      setSubmitting(false);
      toast.success("Secret saved", `${updated.secName} has been updated.`);
    },
  });

  function openEditForm(secret: Secret) {
    setEditSecret(secret);
    editFormik.setValues({
      secName: secret.secName,
      secKey: "",
      projectId: secret.projectId,
      environmentId: secret.environmentId,
    });
    setOpenDropdown(null);
  }

  function handleDeleteSecret() {
    if (!deleteSecret) return;
    setSecrets((prev) => prev.filter((s) => s.id !== deleteSecret.id));
    setDeleteSecret(null);
    setOpenDropdown(null);
    toast.success("Secret deleted", `${deleteSecret.secName} has been removed.`);
  }

  const dropdownMenu = (secret: Secret) => {
    if (openDropdown !== secret.id) return null;
    return (
      <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-1 z-20">
        <button
          type="button"
          onClick={() => openEditForm(secret)}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#222] transition-colors duration-150 text-left"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#8E8E93]" />
          Edit
        </button>
        <button
          type="button"
          onClick={() => { setDeleteSecret(secret); setOpenDropdown(null); }}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-colors duration-150 text-left"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Secrets</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {filtered.length} secrets · {secrets.filter((s) => getEnvName(s.environmentId).toLowerCase() === "production").length} in production
          </p>
        </div>
        <DashboardButton onClick={() => { setShowCreateModal(true); createFormik.resetForm(); }} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          Add Secret
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search secrets..." />
        <div className="hidden sm:block">
          <FilterTabs options={[...envFilters]} value={filter} onChange={(v) => setFilter(v as EnvFilter)} />
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
            {filtered.map((s) => (
                <Tr key={s.id}>
                  <Td>
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="w-4 h-4 text-[#8E8E93]" />
                      <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.secName}</span>
                    </div>
                  </Td>
                  <Td className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#8E8E93]" />
                      <span className="text-xs text-[#8E8E93] dark:text-[#666]">Value hidden</span>
                    </div>
                  </Td>
                  <Td><EnvBadge label={getEnvName(s.environmentId)} /></Td>
                  <Td className="hidden md:table-cell text-sm text-[#8E8E93] dark:text-[#666]">
                    <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.author}</span> · {s.updatedAt}
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isAdmin && (
                        <div className="relative">
                          <DashboardButton
                            onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === s.id ? null : s.id); }}
                            className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </DashboardButton>
                          {dropdownMenu(s)}
                        </div>
                      )}
                    </div>
                  </Td>
                </Tr>
              ))}
          </tbody>
        </DashboardTable>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((s) => (
            <DashboardCard key={s.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#8E8E93]" />
                  <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.secName}</span>
                </div>
                {isAdmin && (
                  <div className="relative">
                    <DashboardButton
                      onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === s.id ? null : s.id); }}
                      className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </DashboardButton>
                    {openDropdown === s.id && (
                      <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-1 z-20">
                        <button type="button" onClick={() => openEditForm(s)} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#222] transition-colors duration-150 text-left"><Edit3 className="w-3.5 h-3.5 text-[#8E8E93]" />Edit</button>
                        <button type="button" onClick={() => { setDeleteSecret(s); setOpenDropdown(null); }} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-colors duration-150 text-left"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="text-xs text-[#8E8E93] dark:text-[#666]">Value hidden</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <EnvBadge label={getEnvName(s.environmentId)} />
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{s.updatedAt}</span>
                </div>
                <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">by {s.author}</span>
              </div>
            </DashboardCard>
          ))}
      </div>

      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); createFormik.resetForm(); }}
        title="Add Secret"
        description="Create a new secret for your project."
        submitLabel="Create Secret"
        submitDisabled={createFormik.isSubmitting}
        loading={createFormik.isSubmitting}
        onSubmit={() => createFormik.handleSubmit()}
      >
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#007AFF]/5 border border-[#007AFF]/20">
              <p className="text-xs font-medium text-[#007AFF] mb-1">Once created, the secret value cannot be viewed again</p>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] leading-relaxed">
                You can edit the name, rotate the key, or delete the secret. The original value
                will never be displayed to any user, including admins.
              </p>
            </div>
            <FormField
              label="Secret Name"
              name="secName"
              placeholder="e.g. DATABASE_URL"
              value={createFormik.values.secName}
              onChange={(v) => createFormik.setFieldValue("secName", v)}
              onBlur={createFormik.handleBlur}
              error={createFormik.touched.secName ? createFormik.errors.secName : undefined}
              touched={!!createFormik.touched.secName}
              required
            />
            <FormField
              label="Secret Key"
              name="secKey"
              placeholder="Enter the secret value"
              value={createFormik.values.secKey}
              onChange={(v) => createFormik.setFieldValue("secKey", v)}
              onBlur={createFormik.handleBlur}
              error={createFormik.touched.secKey ? createFormik.errors.secKey : undefined}
              touched={!!createFormik.touched.secKey}
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
            <FormSelect
              label="Environment"
              name="environmentId"
              value={createFormik.values.environmentId}
              onChange={(v) => createFormik.setFieldValue("environmentId", v)}
              options={MOCK_ENVIRONMENTS.map((e) => ({ label: e.name, value: e.id }))}
              placeholder="Select an environment (optional)"
              error={createFormik.touched.environmentId ? createFormik.errors.environmentId : undefined}
              touched={!!createFormik.touched.environmentId}
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editSecret}
        onClose={() => { setEditSecret(null); editFormik.resetForm(); }}
        title="Edit Secret"
        description={`Update ${editSecret?.secName || "secret"}.`}
        submitLabel="Save Changes"
        submitDisabled={editFormik.isSubmitting}
        loading={editFormik.isSubmitting}
        onSubmit={() => editFormik.handleSubmit()}
      >
        <form onSubmit={editFormik.handleSubmit} noValidate>
          <div className="space-y-4">
            <FormField
              label="Secret Name"
              name="secName"
              placeholder="e.g. DATABASE_URL"
              value={editFormik.values.secName}
              onChange={(v) => editFormik.setFieldValue("secName", v)}
              onBlur={editFormik.handleBlur}
              error={editFormik.touched.secName ? editFormik.errors.secName : undefined}
              touched={!!editFormik.touched.secName}
              required
            />
            <div className="p-3.5 rounded-xl bg-[#FF9F0A]/5 border border-[#FF9F0A]/20">
              <p className="text-xs font-medium text-[#FF9F0A] mb-1">Secret key hidden</p>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] leading-relaxed">
                The current secret value is not displayed for security reasons. If you need to rotate
                this secret, enter a new value below. Team members cannot view existing secret values.
              </p>
            </div>
            <FormField
              label="New Secret Key (optional)"
              name="secKey"
              placeholder="Enter a new secret value to rotate"
              value={editFormik.values.secKey}
              onChange={(v) => editFormik.setFieldValue("secKey", v)}
              onBlur={editFormik.handleBlur}
              error={editFormik.touched.secKey ? editFormik.errors.secKey : undefined}
              touched={!!editFormik.touched.secKey}
            />
            <FormSelect
              label="Project"
              name="projectId"
              value={editFormik.values.projectId}
              onChange={(v) => editFormik.setFieldValue("projectId", v)}
              options={MOCK_PROJECTS.map((p) => ({ label: p.name, value: p.id }))}
              placeholder="Select a project"
              error={editFormik.touched.projectId ? editFormik.errors.projectId : undefined}
              touched={!!editFormik.touched.projectId}
              required
            />
            <FormSelect
              label="Environment"
              name="environmentId"
              value={editFormik.values.environmentId}
              onChange={(v) => editFormik.setFieldValue("environmentId", v)}
              options={MOCK_ENVIRONMENTS.map((e) => ({ label: e.name, value: e.id }))}
              placeholder="Select an environment (optional)"
              error={editFormik.touched.environmentId ? editFormik.errors.environmentId : undefined}
              touched={!!editFormik.touched.environmentId}
            />
          </div>
        </form>
      </Modal>

      <AlertModal
        open={!!deleteSecret}
        onClose={() => setDeleteSecret(null)}
        variant="warning"
        title="Delete Secret"
        message={`Are you sure you want to delete "${deleteSecret?.secName}"? This action cannot be undone.`}
        buttons={[
          { label: "Cancel", onClick: () => setDeleteSecret(null), variant: "secondary" },
          { label: "Delete Secret", onClick: handleDeleteSecret, variant: "destructive" },
        ]}
      />
    </div>
  );
}
