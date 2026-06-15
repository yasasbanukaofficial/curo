import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/github/repos", {
        withCredentials: true,
      })
      .then((res) => setRepos(res.data.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          window.location.href = "http://localhost:5000/api/v1/auth/github";
        } else {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-2xl">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Dashboard</h1>
        {loading ? (
          <p className="text-slate-500">Loading repositories...</p>
        ) : (
          <ul className="space-y-3">
            {repos.map((repo: any) => (
              <li
                key={repo.repoName}
                className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
              >
                <p className="font-medium">{repo.repoName}</p>
                <p className="text-sm text-slate-500">
                  Issues: {repo.has_issues ? "Enabled" : "Disabled"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
