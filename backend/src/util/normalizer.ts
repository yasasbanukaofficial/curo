import { RawRepo } from "../types";

export const githubResponseConverter = (
  rawRepoLists: RawRepo[],
  userId: string,
) => {
  const repoLists = rawRepoLists.map((repo: RawRepo) => ({
    userId,
    repoName: repo.full_name,
    topics: repo.topics,
    is_active: true,
    has_issues: repo.has_issues,
  }));

  return repoLists;
};
