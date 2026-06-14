export interface RawCommit {
  sha: string;
  commit: {
    message: string;
    author: { name: string; email: string; date: string };
  };
  author: { login: string; avatar_url: string } | null;
}

export interface RawPR {
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: { login: string; avatar_url: string };
  assignees: { login: string }[];
}

export interface RawIssue {
  number: number;
  title: string;
  body: string | null;
  state: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  user: { login: string; avatar_url: string };
  assignees: { login: string }[];
  labels: { name: string }[];
}

export const normalizeCommit = (raw: RawCommit, repoFullName: string) => ({
  sourceEventId: `${repoFullName}/commits/${raw.sha}`,
  type: "commit" as const,
  content: raw.commit.message,
  entities: [raw.author?.login ?? raw.commit.author.name].filter(Boolean),
  timestamp: new Date(raw.commit.author.date),
  metadata: {
    sha: raw.sha,
    repo: repoFullName,
    authorName: raw.commit.author.name,
    authorLogin: raw.author?.login ?? null,
  },
});

export const normalizePR = (raw: RawPR, repoFullName: string) => ({
  sourceEventId: `${repoFullName}/pulls/${raw.number}`,
  type: "pr" as const,
  content: `${raw.title}\n\n${raw.body ?? ""}`.trim(),
  entities: [
    raw.user.login,
    ...raw.assignees.map((a) => a.login),
  ],
  timestamp: new Date(raw.created_at),
  metadata: {
    prNumber: raw.number,
    repo: repoFullName,
    state: raw.state,
    htmlUrl: raw.html_url,
    author: raw.user.login,
  },
});

export const normalizeIssue = (raw: RawIssue, repoFullName: string) => ({
  sourceEventId: `${repoFullName}/issues/${raw.number}`,
  type: "issue" as const,
  content: `${raw.title}\n\n${raw.body ?? ""}`.trim(),
  entities: [
    raw.user.login,
    ...raw.assignees.map((a) => a.login),
    ...raw.labels.map((l) => l.name),
  ],
  timestamp: new Date(raw.created_at),
  metadata: {
    issueNumber: raw.number,
    repo: repoFullName,
    state: raw.state,
    htmlUrl: raw.html_url,
    author: raw.user.login,
    labels: raw.labels.map((l) => l.name),
  },
});

export const normalizeRepoDoc = (repo: any, userId: string) => ({
  userId,
  repoId: repo.id,
  fullName: repo.full_name,
  htmlUrl: repo.html_url,
  language: repo.language ?? null,
  private: repo.private,
  defaultBranch: repo.default_branch,
  status: "active" as const,
});
