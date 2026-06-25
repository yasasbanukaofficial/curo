import { useFormik } from "formik";
import { z } from "zod";
import { FolderKanban, Users, HelpCircle } from "lucide-react";
import Modal from "./Modal";
import FormField from "./FormField";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormTextarea from "./FormTextarea";
import { validateZod } from "../../types/settings";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const TEAMS: { id: string; name: string }[] = [];

const createProjectSchema = z.object({
  projectName: z.string().trim().min(2, "Project name must be at least 2 characters").max(100, "Project name is too long"),
  description: z.string().trim().min(2, "Description must be at least 2 characters").max(500, "Description is too long"),
  team: z.string().min(1, "Please select a team"),
  projectLink: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const formik = useFormik({
    initialValues: { projectName: "", description: "", team: "", projectLink: "" },
    validate: validateZod(createProjectSchema),
    onSubmit: (values, { setSubmitting, resetForm }) => {
      console.log("Project created:", values);
      setSubmitting(false);
      resetForm();
      onClose();
    },
  });

  return (
    <Modal
      open={open}
      onClose={() => { formik.resetForm(); onClose(); }}
      title="New Project"
      description="Create a new project to organize your secrets and environments."
      size="2xl"
      submitLabel="Create Project"
      submitDisabled={formik.isSubmitting}
      loading={formik.isSubmitting}
      onSubmit={() => formik.handleSubmit()}
    >
      <form onSubmit={formik.handleSubmit} noValidate className="space-y-5 pt-1">
        <div className="flex items-start gap-4 p-4 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl border border-black/[0.04] dark:border-[#222]">
          <div className="w-10 h-10 rounded-xl bg-[#1D1D1F]/10 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-5 h-5 text-[#1D1D1F] dark:text-[#E5E5E5]" />
          </div>
          <div className="text-sm text-[#8E8E93] dark:text-[#666] leading-relaxed">
            Projects group related secrets, environments, and access controls together. Each project gets its own isolated vault.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormField
            label="Project Name"
            name="projectName"
            placeholder="e.g. Acme API"
            value={formik.values.projectName}
            onChange={(v) => formik.setFieldValue("projectName", v)}
            onBlur={formik.handleBlur}
            error={formik.touched.projectName ? formik.errors.projectName : undefined}
            touched={!!formik.touched.projectName}
            required
          />
          <FormSelect
            label="Team"
            name="team"
            value={formik.values.team}
            onChange={(v) => formik.setFieldValue("team", v)}
            options={TEAMS.map((t) => ({ label: t.name, value: t.id }))}
            placeholder="Select a team"
            icon={<Users className="w-4 h-4 text-[#8E8E93]" />}
            error={formik.touched.team ? formik.errors.team : undefined}
            touched={!!formik.touched.team}
            required
          />
        </div>

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
            value={formik.values.projectLink}
            onChange={(v) => formik.setFieldValue("projectLink", v)}
            onBlur={formik.handleBlur}
            placeholder="https://example.com"
            error={formik.touched.projectLink ? formik.errors.projectLink : undefined}
          />
        </div>


        <FormTextarea
          label="Description"
          name="description"
          placeholder="Describe what this project is for..."
          value={formik.values.description}
          onChange={(v) => formik.setFieldValue("description", v)}
          error={formik.touched.description ? formik.errors.description : undefined}
          touched={!!formik.touched.description}
          required
          rows={4}
        />
      </form>
    </Modal>
  );
}
