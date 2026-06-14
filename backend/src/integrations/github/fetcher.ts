import { Octokit } from "octokit";

const createClient = (accessToken: string) =>
  new Octokit({ auth: accessToken });

export const fetchRepoList = async (accessToken: string) => {
  const octokit = createClient(accessToken);

  const response = await octokit.request("GET /user/repos", {
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    per_page: 50,
    sort: "updated",
    direction: "desc",
  });

  return response.data as any[];
};

async function fetchEndpoint<T>(
  octokit: Octokit,
  request: string,
  params: Record<string, unknown>,
  endpointLabel: string,
  repoFullName: string,
): Promise<{ data: T[]; error: string | null }> {
  try {
    const response = await octokit.request(request, params);
    return { data: response.data as T[], error: null };
  } catch (err: any) {
    if (err.status === 404) {
      console.log(`[Sync] ${endpointLabel} disabled for repo ${repoFullName} — skipping`);
      return { data: [], error: null };
    }
    console.error(`[Sync] Error fetching ${endpointLabel} for repo ${repoFullName}:`, err.message);
    return { data: [], error: err.message ?? "Unknown error" };
  }
}

export const fetchRepoActivity = async (
  accessToken: string,
  repoFullName: string,
) => {
  const octokit = createClient(accessToken);
  const [owner, repo] = repoFullName.split("/");

  const baseParams = {
    owner,
    repo,
    headers: { "X-GitHub-Api-Version": "2022-11-28" },
    per_page: 20,
  };

  const [commitsResult, pullsResult, issuesResult] = await Promise.all([
    fetchEndpoint<any>(octokit, "GET /repos/{owner}/{repo}/commits", baseParams, "Commits", repoFullName),
    fetchEndpoint<any>(octokit, "GET /repos/{owner}/{repo}/pulls", { ...baseParams, state: "all" }, "PRs", repoFullName),
    fetchEndpoint<any>(octokit, "GET /repos/{owner}/{repo}/issues", { ...baseParams, state: "all" }, "Issues", repoFullName),
  ]);

  return {
    commits: commitsResult.data,
    pulls: pullsResult.data,
    issues: issuesResult.data,
  };
};
