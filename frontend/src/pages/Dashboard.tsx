import { useState } from "react";
import api from "../services/api";

interface SyncResult {
  reposSynced: number;
  eventsSynced: number;
}

export default function Dashboard() {
  const [result, setResult] = useState<SyncResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sync = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/unified/github-data");
      if (data.success) {
        setResult(data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
            Curo
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>
        </div>

        <button
          onClick={sync}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Syncing..." : "Sync GitHub Data"}
        </button>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Repos synced</p>
              <p className="mt-1 text-2xl font-semibold">{result.reposSynced}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="text-sm text-slate-500">Events synced</p>
              <p className="mt-1 text-2xl font-semibold">{result.eventsSynced}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
