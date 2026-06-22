import { useEffect, useState } from "react";
import api from "../lib/api";
import { FormInput, FormSelect } from "../components/ui/FormInput";
import { Button, ActionButtons } from "../components/ui/Button";
import { Table, TableHead, Th, TableRow, Td, EmptyRow } from "../components/ui/Table";
import { PlusIcon, EyeIcon, EyeOffIcon } from "../components/ui/Icons";
import SubmittedSuccess from "../components/ui/SubmittedSuccess";
import FetchById from "../components/ui/FetchById";
import CrudPageLayout, { FormCard, ListCard } from "../components/ui/CrudPageLayout";

function FormPage() {
  const [name, setName] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [project, setProject] = useState("");
  const [environment, setEnvironment] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [secrets, setSecrets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [environments, setEnvironmentsState] = useState<any[]>([]);
  const [secretId, setSecretId] = useState("");
  const [fetchedSecret, setFetchedSecret] = useState<any>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const setErrorMsg = useState("")[1];
  const setVersions = useState<any[]>([])[1];
  const setShowHistory = useState(false)[1];
  const setHistorySecretName = useState("")[1];

  useEffect(() => {
    fetchSecrets();
    fetchProjects();
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    const { data: { data: envs } } = await api.get("/environments/all");
    if (envs) setEnvironmentsState(envs);
  };

  const filteredEnvironments = environments.filter((e: any) => e.projectId === project);

  const fetchSecrets = async () => {
    const { data: { data: secrets } } = await api.get("/secrets/all");
    if (secrets) setSecrets(secrets);
  };

  const fetchVersions = async (secretId: string) => {
    try {
      const { data: { data: versions } } = await api.get(`/versions/all/${secretId}`);
      if (versions) setVersions(versions);
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
    const { data: { data: projects } } = await api.get("/projects/all");
    if (projects) setProjects(projects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const payload: any = { secName: name, projectId: project };
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
      const { data: { data: secret } } = await api.get(`/secrets/get/${secretId}`);
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

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setSecretKey("");
    setProject("");
    setEnvironment("");
    setEditingId(null);
  };

  if (submitted) {
    return (
      <SubmittedSuccess
        title={editingId ? "Secret Updated" : "Secret Added"}
        description={`Your secret has been ${editingId ? "updated" : "stored securely"}.`}
        onAddAnother={resetForm}
      />
    );
  }

  return (
    <CrudPageLayout
      form={
        <FormCard
          title={editingId ? "Edit Secret" : "Add a Secret"}
          description={editingId ? "Update the secret details below." : "Store a new environment variable for your project."}
        >
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormInput id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. DATABASE_URL" required />
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-slate-700">Secret Key</label>
              <div className="relative mt-1.5">
                <input id="secretKey" type={showSecret ? "text" : "password"} value={secretKey} onChange={(e) => setSecretKey(e.target.value)}
                  placeholder={editingId ? "Leave blank to keep current value" : "Enter your secret value"}
                  required={!editingId}
                  className="block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 pr-11 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
                <button type="button" onClick={() => setShowSecret((v) => !v)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 cursor-pointer">
                  {showSecret ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <FormSelect id="project" label="Project Name" value={project} onChange={(e) => { setProject(e.target.value); setEnvironment(""); }} required>
              <option value="" disabled>Select a project</option>
              {projects.map((p: any) => <option key={p._id} value={p._id}>{p.projectName}</option>)}
            </FormSelect>
            <FormSelect id="environment" label="Environment" value={environment} onChange={(e) => setEnvironment(e.target.value)}>
              <option value="">None</option>
              {filteredEnvironments.map((e: any) => <option key={e._id} value={e._id}>{e.name}</option>)}
            </FormSelect>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <PlusIcon /> {editingId ? "Update Secret" : "Save Secret"}
              </Button>
              {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
            </div>
          </form>
        </FormCard>
      }
      list={
        <ListCard title="Saved Secrets" count={secrets.length}>
          <FetchById
            value={secretId}
            onChange={setSecretId}
            onFetch={handleFetchSecret}
            placeholder="Paste secret ID to fetch..."
            result={fetchedSecret && <><strong>Fetched:</strong> {fetchedSecret.secName} = {fetchedSecret.secKey}</>}
          />
          <div className="mt-4">
            <Table>
              <TableHead>
                <Th>Name</Th>
                <Th>Key</Th>
                <Th>Env</Th>
                <Th>ID</Th>
                <Th className="pb-3">Actions</Th>
              </TableHead>
              <tbody>
                {secrets.length === 0 && <EmptyRow colSpan={5} message="No secrets saved yet." />}
                {secrets.map((s: any) => (
                  <TableRow key={s._id}>
                    <Td className="py-3 pr-4 font-medium text-slate-900">{s.secName}</Td>
                    <Td className="py-3 pr-4 font-mono text-slate-600">{s.secKey}</Td>
                    <Td className="py-3 pr-4 font-mono text-xs text-slate-400">
                      {s.environmentId ? (
                        <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-indigo-700">
                          {environments.find((e: any) => e._id === s.environmentId)?.name ?? s.environmentId.slice(-6)}
                        </span>
                      ) : <span className="text-slate-300">—</span>}
                    </Td>
                    <Td className="py-3 pr-4 font-mono text-xs text-slate-400">{s._id}</Td>
                    <Td className="py-3"><ActionButtons onEdit={() => handleEdit(s)} onDelete={() => handleDelete(s._id)} onHistory={() => handleShowHistory(s)} /></Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
        </ListCard>
      }
    />
  );
}

export default FormPage;
