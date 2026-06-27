import { useState } from "react";
import { useFormik } from "formik";
import { z } from "zod";
import { History, Plus, Search } from "lucide-react";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SearchInput from "../../components/dashboard/SearchInput";
import DashboardCard from "../../components/dashboard/DashboardCard";
import Modal from "../../components/dashboard/Modal";
import FormField from "../../components/dashboard/FormField";
import { DashboardTable, Th, Tr, Td } from "../../components/dashboard/DashboardTable";
import { useToast } from "../../components/dashboard/Toast";
import { validateZod } from "../../types/settings";
import {
  useGetVersionsQuery,
  useAddVersionMutation,
} from "../../features/version/versionApi";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setSelectedVersion, selectSelectedVersion } from "../../features/version/versionSlice";

const createVersionSchema = z.object({
  secretId: z.string().min(1, "Secret ID is required"),
  secKey: z.string().min(1, "Secret key is required"),
});

export default function Versioning() {
  const dispatch = useAppDispatch();
  const selectedVersion = useAppSelector(selectSelectedVersion);
  const toast = useToast();
  const [secretFilter, setSecretFilter] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const effectiveSecretId = selectedVersion?.secretId || secretFilter.trim();
  const { data: versions = [], isLoading, isError } = useGetVersionsQuery(effectiveSecretId, {
    skip: !effectiveSecretId,
  });

  const [addVersion] = useAddVersionMutation();

  const filtered = effectiveSecretId
    ? versions
    : [];

  const createFormik = useFormik({
    initialValues: { secretId: "", secKey: "" },
    validate: validateZod(createVersionSchema),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await addVersion({ secretId: values.secretId, secKey: values.secKey }).unwrap();
        setSubmitting(false);
        setShowCreateModal(false);
        resetForm();
        setSecretFilter(values.secretId);
        toast.success("Version created", "New version has been saved.");
      } catch (err: any) {
        setSubmitting(false);
        toast.error("Failed to create version", err?.data?.msg || "Something went wrong. Please try again.");
      }
    },
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Version History</h1>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
            {effectiveSecretId ? `${filtered.length} versions` : "Select a secret to view versions"}
          </p>
        </div>
        <DashboardButton onClick={() => { setShowCreateModal(true); createFormik.resetForm(); }} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
          <Plus className="w-4 h-4" />
          New Version
        </DashboardButton>
      </div>

      <div className="flex items-center gap-3 mb-5">
        <SearchInput value={secretFilter} onChange={setSecretFilter} placeholder="Search by Secret ID..." />
        {selectedVersion && (
          <DashboardButton onClick={() => dispatch(setSelectedVersion(null))} className="h-9 px-3 text-xs font-medium text-[#8E8E93] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]">
            Clear selection
          </DashboardButton>
        )}
      </div>

      {!effectiveSecretId ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Search className="w-12 h-12 text-[#8E8E93] mb-4" />
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No secret selected</h3>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6">Enter a Secret ID above or select a version to view history.</p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[#8E8E93]">Loading versions...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-[#FF3B30]">Something went wrong. Could not load versions.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History className="w-12 h-12 text-[#8E8E93] mb-4" />
          <h3 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">No versions yet</h3>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mb-6">Create the first version for this secret.</p>
        </div>
      ) : (
        <>
          <div className="hidden sm:block">
            <DashboardTable>
              <thead>
                <tr className="border-b border-black/[0.04] dark:border-[#222]">
                  <Th>Version</Th>
                  <Th>Secret ID</Th>
                  <Th className="hidden md:table-cell">Key Preview</Th>
                  <Th className="hidden md:table-cell">User</Th>
                  <Th>Created</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => (
                  <Tr key={v._id} onClick={() => dispatch(setSelectedVersion(v))}>
                    <Td>
                      <div className="flex items-center gap-2.5">
                        <History className="w-4 h-4 text-[#8E8E93]" />
                        <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">v{v.version}</span>
                      </div>
                    </Td>
                    <Td><span className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">{v.secretId}</span></Td>
                    <Td className="hidden md:table-cell">
                      <span className="text-xs text-[#8E8E93] dark:text-[#666]">
                        {v.secKey.slice(0, 20)}{v.secKey.length > 20 ? "..." : ""}
                      </span>
                    </Td>
                    <Td className="hidden md:table-cell text-sm text-[#8E8E93] dark:text-[#666]">{v.userId}</Td>
                    <Td className="text-sm text-[#8E8E93] dark:text-[#666]">{new Date(v.createdAt).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </tbody>
            </DashboardTable>
          </div>

          <div className="sm:hidden space-y-3">
            {filtered.map((v) => (
              <DashboardCard key={v._id} hover className="cursor-pointer" onClick={() => dispatch(setSelectedVersion(v))}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <History className="w-4 h-4 text-[#8E8E93]" />
                    <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">v{v.version}</span>
                  </div>
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{new Date(v.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-1">Secret: {v.secretId}</p>
                <p className="text-xs text-[#8E8E93] dark:text-[#666]">Key: {v.secKey.slice(0, 20)}...</p>
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/[0.04] dark:border-[#222]">
                  <span className="text-[11px] text-[#8E8E93] dark:text-[#666]">{v.userId}</span>
                </div>
              </DashboardCard>
            ))}
          </div>
        </>
      )}

      <Modal
        open={showCreateModal}
        onClose={() => { setShowCreateModal(false); createFormik.resetForm(); }}
        title="New Version"
        description="Create a new version for a secret."
        submitLabel="Create Version"
        submitDisabled={createFormik.isSubmitting}
        loading={createFormik.isSubmitting}
        onSubmit={() => createFormik.handleSubmit()}
      >
        <form onSubmit={createFormik.handleSubmit} noValidate>
          <div className="space-y-4">
            <FormField
              label="Secret ID"
              name="secretId"
              placeholder="Enter the secret ID"
              value={createFormik.values.secretId}
              onChange={(v) => createFormik.setFieldValue("secretId", v)}
              onBlur={createFormik.handleBlur}
              error={createFormik.touched.secretId ? createFormik.errors.secretId : undefined}
              touched={!!createFormik.touched.secretId}
              required
            />
            <div className="p-3.5 rounded-xl bg-[#FF9F0A]/5 border border-[#FF9F0A]/20">
              <p className="text-xs font-medium text-[#FF9F0A] mb-1">Version will be auto-incremented</p>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] leading-relaxed">
                Creating a new version snapshots the current secret value and increments the version number.
              </p>
            </div>
            <FormField
              label="Secret Key"
              name="secKey"
              placeholder="Enter the secret value for this version"
              value={createFormik.values.secKey}
              onChange={(v) => createFormik.setFieldValue("secKey", v)}
              onBlur={createFormik.handleBlur}
              error={createFormik.touched.secKey ? createFormik.errors.secKey : undefined}
              touched={!!createFormik.touched.secKey}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
