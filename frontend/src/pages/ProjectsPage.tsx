import { useEffect, useState } from "react";
import api from "../lib/api";
import { FormInput } from "../components/ui/FormInput";
import { Button, ActionButtons } from "../components/ui/Button";
import { Table, TableHead, Th, TableRow, Td, EmptyRow } from "../components/ui/Table";
import { PlusIcon } from "../components/ui/Icons";
import SubmittedSuccess from "../components/ui/SubmittedSuccess";
import FetchById from "../components/ui/FetchById";
import CrudPageLayout, { FormCard, ListCard } from "../components/ui/CrudPageLayout";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const setErrorMsg = useState("")[1];

  useEffect(() => { fetchAllProjects(); }, []);

  const fetchAllProjects = async () => {
    const { data: { data: projectList } } = await api.get("/projects/all");
    if (projectList) setProjects(projectList);
  };

  const handleFetchProject = async () => {
    if (!projectId) return;
    try {
      const { data: { data: project } } = await api.get(`/projects/get/${projectId}`);
      setFetchedProject(project);
    } catch { setFetchedProject(null); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (editingId) {
        await api.put(`/projects/update/${editingId}`, { projectName, description });
        setEditingId(null);
      } else {
        await api.post("/projects/create", { projectName, description });
      }
      setSubmitted(true);
      fetchAllProjects();
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.msg || "Something went wrong");
    }
  };

  const handleEdit = (p: Project) => {
    setProjectName(p.projectName);
    setDescription(p.description);
    setEditingId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this project? This cannot be undone.")) return;
    await api.delete(`/projects/delete/${id}`);
    fetchAllProjects();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProjectName("");
    setDescription("");
  };

  const resetForm = () => {
    setSubmitted(false);
    setProjectName("");
    setDescription("");
    setEditingId(null);
  };

  if (submitted) {
    return (
      <SubmittedSuccess
        title={editingId ? "Project Updated" : "Project Created"}
        description={`Your project has been ${editingId ? "updated" : "created"} successfully.`}
        onAddAnother={resetForm}
      />
    );
  }

  return (
    <CrudPageLayout
      form={
        <FormCard
          title={editingId ? "Edit Project" : "Create a Project"}
          description={editingId ? "Update the project details below." : "Start a new project to organize your secrets."}
        >
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <FormInput id="name" label="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. My Awesome App" required />
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the project..." rows={3} required
                className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none resize-y"
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1"><PlusIcon /> {editingId ? "Update Project" : "Create Project"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={handleCancelEdit}>Cancel</Button>}
            </div>
          </form>
        </FormCard>
      }
      list={
        <ListCard title="Projects" count={projects.length}>
          <FetchById
            value={projectId} onChange={setProjectId} onFetch={handleFetchProject}
            placeholder="Paste project ID to fetch..."
            result={fetchedProject && <><strong>Fetched:</strong> {fetchedProject.projectName} — {fetchedProject.description}</>}
          />
          <div className="mt-4">
            <Table>
              <TableHead>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th>ID</Th>
                <Th className="pb-3">Actions</Th>
              </TableHead>
              <tbody>
                {projects.length === 0 && <EmptyRow colSpan={4} message="No projects yet." />}
                {projects.map((p: Project) => (
                  <TableRow key={p._id}>
                    <Td className="py-3 pr-4 font-medium text-slate-900">{p.projectName}</Td>
                    <Td className="py-3 pr-4 text-slate-600">{p.description}</Td>
                    <Td className="py-3 pr-4 font-mono text-xs text-slate-400">{p._id}</Td>
                    <Td className="py-3"><ActionButtons onEdit={() => handleEdit(p)} onDelete={() => handleDelete(p._id)} /></Td>
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

export default ProjectsPage;
