import { useEffect, useState } from "react";
import api from "../lib/api";

type Project = {
  _id: string;
  projectName: string;
  description: string;
  userId: string;
  createdAt: string;
};

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [fetchedProject, setFetchedProject] = useState<any>(null);

  useEffect(() => {
    fetchAllProjects();
  }, []);

  const fetchAllProjects = async () => {
    const {
      data: { data: projectList },
    } = await api.get("/projects/all");
    if (projectList) {
      setProjects(projectList);
    }
  };

  const handleFetchProject = async () => {
    if (!projectId) return;
    try {
      const {
        data: { data: project },
      } = await api.get(`/projects/get/${projectId}`);
      setFetchedProject(project);
    } catch {
      setFetchedProject(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/projects/create", {
      projectName,
      description,
    });
    setSubmitted(true);
    fetchAllProjects();
  };

  if (submitted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-slate-900">
        <div className="w-full max-w-xl rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
            <svg
              className="h-7 w-7 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Project Created
          </h1>
          <p className="mt-2 text-slate-600">
            Your project has been created successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setProjectName("");
              setDescription("");
            }}
            className="mt-6 cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            Add Another
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-start justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full max-w-xl shrink-0 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
            Curo
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Create a Project
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start a new project to organize your secrets.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Project Name
              </label>
              <input
                id="name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. My Awesome App"
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the project..."
                rows={3}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-y"
              />
            </div>

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Create Project
            </button>
          </form>
        </div>

        <div className="min-w-0 flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Projects
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {projects.length}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="Paste project ID to fetch..."
              className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <button
              onClick={handleFetchProject}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Fetch
            </button>
          </div>

          {fetchedProject && (
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <strong>Fetched:</strong> {fetchedProject.projectName} —{" "}
              {fetchedProject.description}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Description</th>
                  <th className="pb-3">ID</th>
                </tr>
              </thead>
              <tbody>
                {projects.length == 0 && (
                  <tr key="empty">
                    <td
                      colSpan={3}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      No projects yet.
                    </td>
                  </tr>
                )}
                {projects.map((p: Project) => (
                  <tr key={p._id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {p.projectName}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {p.description}
                    </td>
                    <td className="py-3 font-mono text-xs text-slate-400">{p._id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProjectsPage;
