import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound, ChevronDown, FolderKanban, Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { useGetProjectsQuery } from "../../store";
import { useGetSecretsQuery } from "../../store";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

function SecretCard({ secret }: { secret: any }) {
  const [showValue, setShowValue] = useState(false);

  return (
    <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-white/[0.06] p-3.5 hover:border-gray-300 dark:hover:border-white/[0.1] transition-all duration-200">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-3 h-3 text-accent" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA] truncate">{secret.secName}</p>
        </div>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-gray-200/60 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 capitalize flex-shrink-0">
          {secret.environmentId ? "env" : "global"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-mono tracking-widest select-none truncate text-gray-400 dark:text-white/30">
            {showValue ? secret.secKey : "••••••••••••••••"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowValue(!showValue)}
          className="cursor-pointer p-1 rounded-md text-gray-400 dark:text-white/30 hover:text-accent hover:bg-accent/10 transition-all duration-200 flex-shrink-0"
        >
          {showValue ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
}

function ProjectSecretsGroup({ project, defaultExpanded }: { project: any; defaultExpanded: boolean }) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { data: secrets = [], isLoading } = useGetSecretsQuery(project._id, { skip: !expanded });

  return (
    <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="cursor-pointer w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <FolderKanban className="w-4 h-4 text-accent" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA]">{project.projectName}</h3>
            <p className="text-[11px] text-gray-500 dark:text-white/40">{project.secretCount || 0} secrets</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-white/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-white/[0.06]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <LoadingSpinner size={20} />
            </div>
          ) : secrets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <KeyRound className="w-8 h-8 text-gray-400 dark:text-white/20 mb-2" />
              <p className="text-sm text-gray-500 dark:text-white/40">No secrets in this project</p>
            </div>
          ) : (
            <div className="p-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {secrets.map((secret) => (
                <SecretCard key={secret._id} secret={secret} />
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function SecretsPage() {
  const navigate = useNavigate();
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsQuery();

  const projectsWithSecrets = useMemo(
    () => projects.filter((p) => (p.secretCount || 0) > 0),
    [projects]
  );

  const projectsWithoutSecrets = useMemo(
    () => projects.filter((p) => !p.secretCount || p.secretCount === 0),
    [projects]
  );

  if (projectsLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 lg:p-8 pb-8 overflow-y-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Secrets</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
          All secrets across your projects
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
          <KeyRound className="w-12 h-12 text-gray-400 dark:text-white/20 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-1">No projects yet</h3>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6">Create a project to start managing secrets.</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/projects")}
            className="cursor-pointer h-10 px-5 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200"
          >
            Go to Projects
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {projectsWithSecrets.map((project) => (
            <ProjectSecretsGroup key={project._id} project={project} defaultExpanded />
          ))}

          {projectsWithoutSecrets.length > 0 && (
            <>
              {projectsWithSecrets.length > 0 && (
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-xs font-medium text-gray-400 dark:text-white/30 bg-gray-50 dark:bg-[#09090B]">
                      Projects with no secrets
                    </span>
                  </div>
                </div>
              )}
              {projectsWithoutSecrets.map((project) => (
                <ProjectSecretsGroup key={project._id} project={project} defaultExpanded={false} />
              ))}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
