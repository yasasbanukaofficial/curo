import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";

type Environment = {
  _id: string;
  name: string;
  projectId: string;
  userId: string;
  createdAt: string;
};

function EnvironmentsPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [environmentId, setEnvironmentId] = useState("");
  const [fetchedEnv, setFetchedEnv] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const clearError = useCallback(() => setErrorMsg(""), []);

  useEffect(() => {
    fetchAllEnvironments();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const {
      data: { data: projects },
    } = await api.get("/projects/all");
    if (projects) {
      setProjects(projects);
    }
  };

  const fetchAllEnvironments = async () => {
    const {
      data: { data: envList },
    } = await api.get("/environments/all");
    if (envList) {
      setEnvironments(envList);
    }
  };

  const handleFetchEnvironment = async () => {
    if (!environmentId) return;
    try {
      const {
        data: { data: env },
      } = await api.get(`/environments/get/${environmentId}`);
      setFetchedEnv(env);
    } catch {
      setFetchedEnv(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await api.put(`/environments/update/${editingId}`, {
          name,
          projectId,
        });
        setEditingId(null);
      } else {
        await api.post("/environments/create", {
          name,
          projectId,
        });
      }
      setSubmitted(true);
      fetchAllEnvironments();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Something went wrong");
    }
  };

  const handleEdit = (e: Environment) => {
    setName(e.name);
    setProjectId(e.projectId);
    setEditingId(e._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this environment? All secrets in it will also be deleted.")) return;
    await api.delete(`/environments/delete/${id}`);
    fetchAllEnvironments();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setProjectId("");
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
            {editingId ? "Environment Updated" : "Environment Created"}
          </h1>
          <p className="mt-2 text-slate-600">
            Your environment has been {editingId ? "updated" : "created"} successfully.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setProjectId("");
              setEditingId(null);
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
      {errorMsg && <Toast message={errorMsg} onClose={clearError} />}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
        <div className="w-full max-w-xl shrink-0 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
            Curo
          </span>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            {editingId ? "Edit Environment" : "Create an Environment"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {editingId ? "Update the environment details below." : "Create a new environment for your project."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Environment Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. development, staging, production"
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-slate-700"
              >
                Project Name
              </label>
              <select
                id="projectId"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="" disabled>
                  Select a project
                </option>
                {projects.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.projectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
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
                {editingId ? "Update Environment" : "Create Environment"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="min-w-0 flex-1 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Environments
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {environments.length}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={environmentId}
              onChange={(e) => setEnvironmentId(e.target.value)}
              placeholder="Paste environment ID to fetch..."
              className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <button
              onClick={handleFetchEnvironment}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Fetch
            </button>
          </div>

          {fetchedEnv && (
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <strong>Fetched:</strong> {fetchedEnv.name} — Project:{" "}
              {fetchedEnv.projectId}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Project</th>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {environments.length == 0 && (
                  <tr key="empty">
                    <td
                      colSpan={4}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      No environments yet.
                    </td>
                  </tr>
                )}
                {environments.map((e: Environment) => (
                  <tr key={e._id} className="border-b border-slate-100">
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {e.name}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">
                      {projects.find((p: any) => p._id === e.projectId)?.projectName ?? e.projectId.slice(-6)}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">{e._id}</td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(e)}
                          className="cursor-pointer rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="cursor-pointer rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
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

export default EnvironmentsPage;
