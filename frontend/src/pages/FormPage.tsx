import { useCallback, useEffect, useState } from "react";
import api from "../lib/api";
import Toast from "../components/Toast";

function FormPage() {
  const [name, setName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [project, setProject] = useState("");
  const [environment, setEnvironment] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [secrets, setSecrets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [secretId, setSecretId] = useState("");
  const [fetchedSecret, setFetchedSecret] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [versions, setVersions] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historySecretName, setHistorySecretName] = useState("");

  const clearError = useCallback(() => setErrorMsg(""), []);

  useEffect(() => {
    fetchSecrets();
    fetchProjects();
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    const {
      data: { data: envs },
    } = await api.get("/environments/all");
    if (envs) {
      setEnvironments(envs);
    }
  };

  const filteredEnvironments = environments.filter(
    (e: any) => e.projectId === project,
  );

  const fetchSecrets = async () => {
    const {
      data: { data: secrets },
    } = await api.get("/secrets/all");
    if (secrets) {
      setSecrets(secrets);
    }
  };

  const fetchVersions = async (secretId: string) => {
    try {
      const {
        data: { data: versions },
      } = await api.get(`/versions/all/${secretId}`);
      if (versions) {
        setVersions(versions);
      }
    } catch {
      setVersions([]);
    }
  };

  const handleShowHistory = async (s: any) => {
    setHistorySecretName(s.secName);
    setVersions([]);
    setShowHistory(true);
    await fetchVersions(s._id);
  };

  const fetchProjects = async () => {
    const {
      data: { data: projects },
    } = await api.get("/projects/all");
    if (projects) {
      setProjects(projects);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const payload: any = {
      secName: name,
      projectId: project,
    };
    if (secretKey) payload.secKey = secretKey;
    if (environment) payload.environmentId = environment;

    try {
      if (editingId) {
        await api.put(`/secrets/update/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/secrets/save", payload);
      }
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Something went wrong");
    }
  };

  const handleFetchSecret = async () => {
    if (!secretId) return;
    try {
      const {
        data: { data: secret },
      } = await api.get(`/secrets/get/${secretId}`);
      setFetchedSecret(secret);
    } catch {
      setFetchedSecret(null);
    }
  };

  const handleEdit = (s: any) => {
    setName(s.secName);
    setSecretKey("");
    setProject(s.projectId);
    setEnvironment(s.environmentId ?? "");
    setEditingId(s._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this secret? This cannot be undone.")) return;
    await api.delete(`/secrets/delete/${id}`);
    fetchSecrets();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setSecretKey("");
    setProject("");
    setEnvironment("");
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
            {editingId ? "Secret Updated" : "Secret Added"}
          </h1>
          <p className="mt-2 text-slate-600">
            Your secret has been {editingId ? "updated" : "stored securely"}.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setSecretKey("");
              setProject("");
              setEnvironment("");
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
            {editingId ? "Edit Secret" : "Add a Secret"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {editingId ? "Update the secret details below." : "Store a new environment variable for your project."}
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. DATABASE_URL"
                required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="secretKey"
                className="block text-sm font-medium text-slate-700"
              >
                Secret Key
              </label>
              <div className="relative mt-1.5">
                <input
                  id="secretKey"
                  type={showSecret ? "text" : "password"}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  placeholder={editingId ? "Leave blank to keep current value" : "Enter your secret value"}
                  required={!editingId}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showSecret ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="project"
                className="block text-sm font-medium text-slate-700"
              >
                Project Name
              </label>
              <select
                id="project"
                value={project}
                onChange={(e) => {
                  setProject(e.target.value);
                  setEnvironment("");
                }}
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

            <div>
              <label
                htmlFor="environment"
                className="block text-sm font-medium text-slate-700"
              >
                Environment
              </label>
              <select
                id="environment"
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
              >
                <option value="">None</option>
                {filteredEnvironments.map((e: any) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
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
                {editingId ? "Update Secret" : "Save Secret"}
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
              Saved Secrets
            </h2>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {secrets.length}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={secretId}
              onChange={(e) => setSecretId(e.target.value)}
              placeholder="Paste secret ID to fetch..."
              className="block flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
            />
            <button
              onClick={handleFetchSecret}
              className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
            >
              Fetch
            </button>
          </div>

          {fetchedSecret && (
            <div className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              <strong>Fetched:</strong> {fetchedSecret.secName} ={" "}
              {fetchedSecret.secKey}
            </div>
          )}

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Key</th>
                  <th className="pb-3 pr-4">Env</th>
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {secrets.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-sm text-slate-400"
                    >
                      No secrets saved yet.
                    </td>
                  </tr>
                )}
                {secrets.map((s: any) => (
                  <tr
                    key={s._id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-900">
                      {s.secName}
                    </td>
                    <td className="py-3 pr-4 font-mono text-slate-600">
                      {s.secKey}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                      {s.environmentId ? (
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">
                          {environments.find((e: any) => e._id === s.environmentId)?.name ?? s.environmentId.slice(-6)}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                      {s._id}
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(s)}
                          className="cursor-pointer rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="cursor-pointer rounded-md bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handleShowHistory(s)}
                          className="cursor-pointer rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-600 transition hover:bg-amber-100"
                        >
                          History
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

      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-12 px-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  Version History
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">{historySecretName}</p>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="pb-3 pr-4">Version</th>
                    <th className="pb-3 pr-4">Value</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-sm text-slate-400">
                        {versions.length === 0 ? "Loading..." : "No previous versions found."}
                      </td>
                    </tr>
                  )}
                  {versions.map((v: any) => (
                    <tr key={v._id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-mono text-slate-900">
                        v{v.version}
                      </td>
                      <td className="py-3 pr-4 font-mono text-slate-600 max-w-[200px] truncate">
                        {v.secKey}
                      </td>
                      <td className="py-3 text-xs text-slate-400 whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default FormPage;
