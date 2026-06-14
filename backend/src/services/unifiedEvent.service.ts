import { UserModel, ConnectedRepoModel, UnifiedEventModel } from "../models";
import { fetchRepoList, fetchRepoActivity } from "../integrations/github/fetcher";
import {
  normalizeCommit,
  normalizePR,
  normalizeIssue,
  normalizeRepoDoc,
  RawCommit,
  RawPR,
  RawIssue,
} from "../integrations/github/normalizer";
import { encrypt } from "../util";
import { AppError } from "../middlewares";

interface RepoSyncResult {
  repoName: string;
  status: "synced" | "skipped" | "partial";
  reasons: string[];
}

export const unifiedEventService = {
  syncGithubRepos: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    if (!user.githubAccessToken) throw new AppError(400, "No GitHub access token found for this user");

    const token = encrypt.compare(user.githubAccessToken);
    if (!token) throw new AppError(500, "Failed to decrypt GitHub access token");

    const repos = await fetchRepoList(token);

    const repoDocs = repos.map((r: any) => normalizeRepoDoc(r, userId));

    await ConnectedRepoModel.bulkWrite(
      repoDocs.map((doc) => ({
        updateOne: {
          filter: { userId: doc.userId, repoId: doc.repoId },
          update: { $set: doc },
          upsert: true,
        },
      })),
    );

    const tracked = repos
      .filter((r: any) => !r.fork && !r.private)
      .slice(0, 3);

    const allEvents: any[] = [];
    const results: RepoSyncResult[] = [];

    for (const repo of tracked) {
      try {
        const activity = await fetchRepoActivity(token, repo.full_name);
        const reasons: string[] = [];

        if (activity.commits.length === 0 && activity.pulls.length === 0 && activity.issues.length === 0) {
          reasons.push("No activity found");
        }

        allEvents.push(
          ...activity.commits.map((c: RawCommit) => ({
            userId,
            source: "github" as const,
            ...normalizeCommit(c, repo.full_name),
          })),
          ...activity.pulls.map((p: RawPR) => ({
            userId,
            source: "github" as const,
            ...normalizePR(p, repo.full_name),
          })),
          ...activity.issues.map((i: RawIssue) => ({
            userId,
            source: "github" as const,
            ...normalizeIssue(i, repo.full_name),
          })),
        );

        results.push({
          repoName: repo.full_name,
          status: reasons.length > 0 ? "partial" : "synced",
          reasons,
        });
      } catch (err: any) {
        console.error(`[Sync] Unexpected error processing repo ${repo.full_name}:`, err.message);
        results.push({
          repoName: repo.full_name,
          status: "partial",
          reasons: [err.message ?? "Unknown error"],
        });
      }
    }

    if (allEvents.length > 0) {
      await UnifiedEventModel.bulkWrite(
        allEvents.map((event) => ({
          updateOne: {
            filter: { userId: event.userId, source: event.source, sourceEventId: event.sourceEventId },
            update: { $set: event },
            upsert: true,
          },
        })),
      );
    }

    const synced = results.filter((r) => r.status === "synced").length;
    const partial = results.filter((r) => r.status === "partial").length;
    const skipped = tracked.length - results.length;

    console.log(`[Sync] Complete: ${synced} repos synced fully, ${partial} repos partial, ${skipped} repos skipped`);

    return { reposSynced: repoDocs.length, eventsSynced: allEvents.length, results };
  },
};
