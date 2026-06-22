import { useEffect, useState } from "react";
import api from "../lib/api";
import { Table, TableHead, Th, TableRow, Td, EmptyRow } from "../components/ui/Table";

function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetchAuditLogs();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (data.data) setCurrentUser(data.data);
    } catch {}
  };

  const fetchAuditLogs = async () => {
    const { data: { data: auditLogs } } = await api.get("/audits/all");
    if (auditLogs) setLogs(auditLogs);
  };

  const actionBadge = (action: string) => {
    const styles: Record<string, string> = {
      CREATED: "bg-emerald-100 text-emerald-700",
      UPDATED: "bg-blue-100 text-blue-700",
      DELETED: "bg-red-100 text-red-700",
      VIEWED: "bg-amber-100 text-amber-700",
    };
    return <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles[action] || "bg-slate-100 text-slate-600"}`}>{action}</span>;
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">Curo</span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Audit Logs</h1>
            <p className="mt-1 text-sm text-slate-500">Track every action on secrets.</p>
            {currentUser && (
              <p className="mt-1 text-xs text-slate-400">
                User: {currentUser.email || currentUser.name} — <code className="text-slate-500">{currentUser._id}</code>
              </p>
            )}
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{logs.length}</span>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <Table>
            <TableHead>
              <Th>Action</Th>
              <Th>Resource</Th>
              <Th>User</Th>
              <Th>Details</Th>
              <Th className="pb-3">Date</Th>
            </TableHead>
            <tbody>
              {logs.length === 0 && <EmptyRow colSpan={5} message="No audit logs yet." />}
              {logs.map((log: any) => (
                <TableRow key={log._id}>
                  <Td>{actionBadge(log.action)}</Td>
                  <Td>
                    <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">SECRET</span>
                  </Td>
                  <Td className="py-3 pr-4 text-xs text-slate-600">{currentUser?.name || currentUser?.email || "—"}</Td>
                  <Td className="py-3 pr-4"><code className="text-xs text-slate-600">{JSON.stringify(log.metadata)}</code></Td>
                  <Td className="py-3 whitespace-nowrap text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</Td>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </main>
  );
}

export default AuditLogsPage;
