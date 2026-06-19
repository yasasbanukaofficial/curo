import { useEffect, useState } from "react";
import api from "../lib/api";

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
    const {
      data: { data: auditLogs },
    } = await api.get("/audits/all");
    if (auditLogs) {
      setLogs(auditLogs);
    }
  };

  const actionBadge = (action: string) => {
    const styles: Record<string, string> = {
      CREATED: "bg-emerald-100 text-emerald-700",
      UPDATED: "bg-blue-100 text-blue-700",
      DELETED: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles[action] || "bg-slate-100 text-slate-600"}`}
      >
        {action}
      </span>
    );
  };

  const resourceBadge = (resource: string) => {
    const styles: Record<string, string> = {
      SECRET: "bg-purple-100 text-purple-700",
      PROJECT: "bg-indigo-100 text-indigo-700",
      ENVIRONMENT: "bg-amber-100 text-amber-700",
    };
    return (
      <span
        className={`rounded-md px-2 py-0.5 text-xs font-medium ${styles[resource] || "bg-slate-100 text-slate-600"}`}
      >
        {resource}
      </span>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
              Curo
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Audit Logs
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track every action on secrets, projects and environments.
            </p>
            {currentUser && (
              <p className="mt-1 text-xs text-slate-400">
                User: {currentUser.email || currentUser.name} —{" "}
                <code className="text-slate-500">{currentUser._id}</code>
              </p>
            )}
          </div>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
            {logs.length}
          </span>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="pb-3 pr-4">Action</th>
                <th className="pb-3 pr-4">Resource</th>
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Details</th>
                <th className="pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-sm text-slate-400"
                  >
                    No audit logs yet.
                  </td>
                </tr>
              )}
              {logs.map((log: any) => (
                <tr
                  key={log._id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-3 pr-4">{actionBadge(log.action)}</td>
                  <td className="py-3 pr-4">{resourceBadge(log.resource)}</td>
                  <td className="py-3 pr-4 text-xs text-slate-600">
                    {currentUser?.name || currentUser?.email || "—"}
                  </td>
                  <td className="py-3 pr-4">
                    <code className="text-xs text-slate-600">
                      {JSON.stringify(log.metadata)}
                    </code>
                  </td>
                  <td className="py-3 whitespace-nowrap text-xs text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

export default AuditLogsPage;
