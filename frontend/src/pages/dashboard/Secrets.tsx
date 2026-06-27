import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { z } from "zod";
import { Plus, KeyRound, MoreHorizontal, Edit3, Trash2, ShieldAlert } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import FormField from "../../components/dashboard/FormField";
import FormSelect from "../../components/dashboard/FormSelect";
import { EnvBadge } from "../../components/dashboard/Badges";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import type { Secret } from "../../types/secret";
import {
  useGetSecretsQuery,
  useAddSecretMutation,
  useUpdateSecretMutation,
  useRemoveSecretMutation,
} from "../../features/secret/secretApi";
import { useGetProjectsQuery } from "../../features/project/projectApi";
import { useGetEnvironmentsQuery } from "../../features/environment/environmentApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedSecret, selectSelectedSecret } from "../../features/secret/secretSlice";

function getEnvName(envId: string, allEnvironments: { _id: string; name: string }[]): string {
  return allEnvironments.find((e) => e._id === envId)?.name ?? "unknown";
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
  const dispatch = useAppDispatch();
  const selectedSecret = useAppSelector(selectSelectedSecret);
  const toast = useToast();
  const location = useLocation();
  const { data: secrets = [], isLoading, isError } = useGetSecretsQuery();
  const { data: projects = [] } = useGetProjectsQuery();
  const { data: environments = [] } = useGetEnvironmentsQuery();
  const [addSecret] = useAddSecretMutation();
  const [updateSecret] = useUpdateSecretMutation();
  const [removeSecret] = useRemoveSecretMutation();
  const [search, setSearch] = useState("");
  const [dropdownTarget, setDropdownTarget] = useState<{ id: string; anchor: DOMRect } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editSecret, setEditSecret] = useState<Secret | null>(null);
  const [deleteSecret, setDeleteSecret] = useState<Secret | null>(null);

  useEffect(() => {
    if ((location.state as { openCreateSecret?: boolean })?.openCreateSecret) {
      setShowCreateModal(true);
      window.history.replaceState({}, document.title);
    }
  }, []);

  useEffect(() => {
    if (!dropdownTarget) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown-menu]')) {
        setDropdownTarget(null);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [dropdownTarget]);

  function handleMoreClick(e: React.MouseEvent, secretId: string) {
    e.stopPropagation();
    const btn = e.currentTarget as HTMLElement;
    if (dropdownTarget?.id === secretId) {
      setDropdownTarget(null);
    } else {
      setDropdownTarget({ id: secretId, anchor: btn.getBoundingClientRect() });
    }
  }

  const projectOptions: { label: string; value: string }[] = projects.map((p) => ({
    label: p.projectName,
    value: p._id,
  }));

  const filtered = secrets.filter((s) => {
    const q = search.toLowerCase();
    return s.secName.toLowerCase().includes(q);
  });

  const createFormik = useFormik({
    initialValues: { secName: "", secKey: "", projectId: "", environmentId: "" },
    validate: validateZod(createSecretSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await addSecret(values).unwrap();
        setSubmitting(false);
        setShowCreateModal(false);
        resetForm();
        toast.success("Secret created", `${values.secName} has been created.`);
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to create secret", err?.data?.msg || "Something went wrong. Please try again.");
      }
    },
  });

  const editFormik = useFormik({
    initialValues: { secName: "", secKey: "", projectId: "", environmentId: "" },
    validate: validateZod(updateSecretSchema),
    onSubmit: async (values, { setSubmitting }) => {
      if (!editSecret) return;
      try {
        await updateSecret({ id: editSecret._id, body: values }).unwrap();
        setEditSecret(null);
        setSubmitting(false);
        toast.success("Secret saved", `${values.secName} has been updated.`);
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to update secret", err?.data?.msg || "Something went wrong. Please try again.");
      }
    },
  });

  const environmentOptions: { label: string; value: string }[] = environments
    .filter((e) => e.projectId === (createFormik.values.projectId || editFormik.values.projectId))
    .map((e) => ({ label: e.name, value: e._id }));

  function openEditForm(secret: Secret) {
    setEditSecret(secret);
    editFormik.setValues({
      secName: secret.secName,
      secKey: "",
      projectId: secret.projectId,
      environmentId: secret.environmentId ?? "",
    });
    setDropdownTarget(null);
  }

  async function handleDeleteSecret() {
    if (!deleteSecret) return;
    try {
      await removeSecret(deleteSecret._id).unwrap();
      setDeleteSecret(null);
      setDropdownTarget(null);
      toast.success("Secret deleted", `${deleteSecret.secName} has been removed.`);
    } catch (err: any) {
      toast.error("Failed to delete secret", err?.data?.msg || "Something went wrong. Please try again.");
    }
  }

  function handleEditClick(secret: Secret) {
    openEditForm(secret);
    setDropdownTarget(null);
  }

  function handleDeleteClick(secret: Secret) {
    setDeleteSecret(secret);
    setDropdownTarget(null);
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#8E8E93]">Loading secrets...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 xl:p-8 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#FF3B30]">Something went wrong. Could not load secrets.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Secrets</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {filtered.length} secrets
          </p>
        </div>
        <DashboardButton onClick={() => { setShowCreateModal(true); createFormik.resetForm(); }} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          Add Secret
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={search} onChange={setSearch} placeholder="Search secrets..." />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <KeyRound className="w-12 h-12 text-[#8E8E93] mb-4" />
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No secrets yet</h3>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6">Create your first secret to get started.</p>
          <DashboardButton onClick={() => { setShowCreateModal(true); createFormik.resetForm(); }} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
            <Plus className="w-4 h-4" />Add Secret
          </DashboardButton>
        </div>
      ) : (
      <>
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
                <Tr key={s._id}>
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
                  <Td><EnvBadge label={getEnvName(s.environmentId ?? "", environments)} /></Td>
                  <Td className="hidden md:table-cell text-sm text-[#8E8E93] dark:text-[#666]">
                    <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.author}</span> · {s.updatedAt}
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DashboardButton
                        onClick={(e) => handleMoreClick(e, s._id)}
                        className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </DashboardButton>
                    </div>
                  </Td>
                </Tr>
              ))}
          </tbody>
        </DashboardTable>
      </div>

      <div className="sm:hidden space-y-3">
        {filtered.map((s) => (
            <DashboardCard key={s._id}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <KeyRound className="w-4 h-4 text-[#8E8E93]" />
                  <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{s.secName}</span>
                </div>
                <DashboardButton
                  onClick={(e) => handleMoreClick(e, s._id)}
                  className="p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </DashboardButton>
              </div>

              <div className="mb-3 flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-[#8E8E93]" />
                <span className="text-xs text-[#8E8E93] dark:text-[#666]">Value hidden</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-black/[0.04] dark:border-[#222]">
                <div className="flex items-center gap-2">
                  <EnvBadge label={getEnvName(s.environmentId ?? "", environments)} />
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{s.updatedAt}</span>
                </div>
                <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">by {s.author}</span>
              </div>
            </DashboardCard>
          ))}
      </div>
      </>
      )}

      {dropdownTarget && (() => {
        const secret = secrets.find((s) => s._id === dropdownTarget.id);
        if (!secret) return null;
        return (
          <div
            data-dropdown-menu
            className="fixed w-36 bg-white dark:bg-[#1A1A1A] rounded-xl border border-black/[0.04] dark:border-[#222] shadow-lg py-1 z-50"
            style={{ top: dropdownTarget.anchor.bottom + 4, right: document.body.offsetWidth - dropdownTarget.anchor.right }}
          >
            <button
              type="button"
              onClick={() => handleEditClick(secret)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#1D1D1F] dark:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#222] transition-colors duration-150 text-left"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#8E8E93]" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => handleDeleteClick(secret)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#FF3B30] hover:bg-[#FF3B30]/5 transition-colors duration-150 text-left"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        );
      })()}

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
              onChange={(v) => { createFormik.setFieldValue("projectId", v); createFormik.setFieldValue("environmentId", ""); }}
              options={projectOptions}
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
              options={environmentOptions}
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
              onChange={(v) => { editFormik.setFieldValue("projectId", v); editFormik.setFieldValue("environmentId", ""); }}
              options={projectOptions}
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
              options={environmentOptions}
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
