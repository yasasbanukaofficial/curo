import { RawRepo } from "../types";

export const githubResponseConverter = (
  rawRepoLists: RawRepo[],
  userId: string,
) => {
  return rawRepoLists.map((repo: RawRepo) => ({
    userId,
    repoId: repo.id,
    repoName: repo.full_name,
    htmlUrl: repo.html_url,
    language: repo.language,
    isPrivate: repo.private,
    isFork: repo.fork,
    defaultBranch: repo.default_branch,
    pushedAt: repo.pushed_at,
    topics: repo.topics,
    is_active: true,
    has_issues: repo.has_issues,
  }));
};
