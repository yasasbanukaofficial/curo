import { useFormik } from "formik";
import { z } from "zod";
import { FolderKanban, Users } from "lucide-react";
import Modal from "./Modal";
import FormField from "./FormField";
import FormTextarea from "./FormTextarea";
import { validateZod } from "../../types/settings";

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const TEAMS = [
  { id: "team_1", name: "Acme Corp" },
  { id: "team_2", name: "Personal" },
  { id: "team_3", name: "Side Project" },
];

const createProjectSchema = z.object({
  projectName: z.string().trim().min(2, "Project name must be at least 2 characters").max(100, "Project name is too long"),
  description: z.string().trim().min(2, "Description must be at least 2 characters").max(500, "Description is too long"),
  team: z.string().min(1, "Please select a team"),
});

export default function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const formik = useFormik({
    initialValues: { projectName: "", description: "", team: "" },
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
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5">
              Team <span className="text-[#FF3B30] ml-0.5">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93] pointer-events-none" />
              <select
                name="team"
                value={formik.values.team}
                onChange={(e) => formik.setFieldValue("team", e.target.value)}
                onBlur={formik.handleBlur}
                className={`w-full h-10 pl-10 pr-3 text-sm bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl border-none outline-none text-[#1D1D1F] dark:text-[#E5E5E5] transition-colors duration-200 appearance-none cursor-pointer ${
                  !formik.values.team ? "text-[#8E8E93]" : ""
                }`}
              >
                <option value="" disabled>Select a team</option>
                {TEAMS.map((t) => (
                  <option key={t.id} value={t.id} className="text-[#1D1D1F] dark:text-[#E5E5E5]">{t.name}</option>
                ))}
              </select>
            </div>
            {formik.touched.team && formik.errors.team && (
              <p className="mt-1.5 text-xs text-[#FF3B30]">{formik.errors.team}</p>
            )}
          </div>
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
