import { useEffect, useState } from "react";
import api from "../lib/api";
import { FormInput, FormSelect } from "../components/ui/FormInput";
import { Button, ActionButtons } from "../components/ui/Button";
import { Table, TableHead, Th, TableRow, Td, EmptyRow } from "../components/ui/Table";
import { PlusIcon } from "../components/ui/Icons";
import SubmittedSuccess from "../components/ui/SubmittedSuccess";
import FetchById from "../components/ui/FetchById";
import CrudPageLayout, { FormCard, ListCard } from "../components/ui/CrudPageLayout";

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
  const setErrorMsg = useState("")[1];

  useEffect(() => {
    fetchAllEnvironments();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data: { data: projects } } = await api.get("/projects/all");
    if (projects) setProjects(projects);
  };

  const fetchAllEnvironments = async () => {
    const { data: { data: envList } } = await api.get("/environments/all");
    if (envList) setEnvironments(envList);
  };

  const handleFetchEnvironment = async () => {
    if (!environmentId) return;
    try {
      const { data: { data: env } } = await api.get(`/environments/get/${environmentId}`);
      setFetchedEnv(env);
    } catch { setFetchedEnv(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await api.put(`/environments/update/${editingId}`, { name, projectId });
        setEditingId(null);
      } else {
        await api.post("/environments/create", { name, projectId });
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

  const resetForm = () => {
    setSubmitted(false);
    setName("");
    setProjectId("");
    setEditingId(null);
  };

  if (submitted) {
    return (
      <SubmittedSuccess
        title={editingId ? "Environment Updated" : "Environment Created"}
        description={`Your environment has been ${editingId ? "updated" : "created"} successfully.`}
        onAddAnother={resetForm}
      />
    );
  }

  return (
    <CrudPageLayout
      form={
        <FormCard
          title={editingId ? "Edit Environment" : "Create an Environment"}
          description={editingId ? "Update the environment details below." : "Create a new environment for your project."}
        >
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormInput id="name" label="Environment Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. development, staging, production" required />
            <FormSelect id="projectId" label="Project Name" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
              <option value="" disabled>Select a project</option>
              {projects.map((p: any) => <option key={p._id} value={p._id}>{p.projectName}</option>)}
            </FormSelect>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1"><PlusIcon /> {editingId ? "Update Environment" : "Create Environment"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
            </div>
          </form>
        </FormCard>
      }
      list={
        <ListCard title="Environments" count={environments.length}>
          <FetchById
            value={environmentId} onChange={setEnvironmentId} onFetch={handleFetchEnvironment}
            placeholder="Paste environment ID to fetch..."
            result={fetchedEnv && <><strong>Fetched:</strong> {fetchedEnv.name} — Project: {fetchedEnv.projectId}</>}
          />
          <div className="mt-4">
            <Table>
              <TableHead>
                <Th>Name</Th>
                <Th>Project</Th>
                <Th>ID</Th>
                <Th className="pb-3">Actions</Th>
              </TableHead>
              <tbody>
                {environments.length === 0 && <EmptyRow colSpan={4} message="No environments yet." />}
                {environments.map((e: Environment) => (
                  <TableRow key={e._id}>
                    <Td className="py-3 pr-4 font-medium text-slate-900">{e.name}</Td>
                    <Td className="py-3 pr-4 text-slate-600">
                      {projects.find((p: any) => p._id === e.projectId)?.projectName ?? e.projectId.slice(-6)}
                    </Td>
                    <Td className="py-3 pr-4 font-mono text-xs text-slate-400">{e._id}</Td>
                    <Td className="py-3"><ActionButtons onEdit={() => handleEdit(e)} onDelete={() => handleDelete(e._id)} /></Td>
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

export default EnvironmentsPage;
