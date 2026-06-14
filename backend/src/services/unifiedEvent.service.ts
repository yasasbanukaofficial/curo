import { UserModel, ConnectedRepoModel, UnifiedEventModel } from "../models";
import {
  fetchRepoList,
  fetchRepoActivity,
} from "../integrations/github/fetcher";
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
import { SYNC_EVENT_DAYS } from "../config/env";

interface RawRepo {
  id: number;
  full_name: string;
  html_url: string;
  language: string | null;
  private: boolean;
  default_branch: string;
  fork: boolean;
  pushed_at: string;
}

const getSyncEventDays = () => {
  const days = parseInt(SYNC_EVENT_DAYS ?? "30", 10);
  return isNaN(days) || days < 1 ? 30 : days;
};

const daysAgo = (days: number): string =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

const isWithinDays = (dateStr: string, days: number): boolean => {
  const then = new Date(dateStr).getTime();
  return Date.now() - then < days * 24 * 60 * 60 * 1000;
};

interface RepoSyncResult {
  repoName: string;
  status: "synced" | "skipped" | "partial";
  reasons: string[];
}

export const unifiedEventService = {
  syncGithubRepos: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError(404, "User not found");
    if (!user.githubAccessToken)
      throw new AppError(400, "No GitHub access token found for this user");

    const token = encrypt.compare(user.githubAccessToken);
    if (!token)
      throw new AppError(500, "Failed to decrypt GitHub access token");

    const eventDays = getSyncEventDays();
    const since = daysAgo(eventDays);

    const repos = await fetchRepoList(token);

    const activeRepos = repos.filter((r: RawRepo) =>
      isWithinDays(r.pushed_at, eventDays),
    );

    const repoDocs = activeRepos.map((r: RawRepo) => normalizeRepoDoc(r, userId));

    await ConnectedRepoModel.bulkWrite(
      repoDocs.map((doc) => ({
        updateOne: {
          filter: { userId: doc.userId, repoId: doc.repoId },
          update: { $set: doc },
          upsert: true,
        },
      })),
    );

    const allEvents: any[] = [];
    const results: RepoSyncResult[] = [];

    for (const repo of activeRepos) {
      try {
        const activity = await fetchRepoActivity(token, repo.full_name, since);

        if (activity.commits.length === 0) {
          results.push({
            repoName: repo.full_name,
            status: "skipped",
            reasons: ["No commits in the last 30 days"],
          });
          continue;
        }

        const repoEvents: any[] = [
          ...activity.commits.map((c: RawCommit) => ({
            userId,
            source: "github" as const,
            ...normalizeCommit(c, repo.full_name),
          })),
        ];

        for (const pr of activity.pulls as RawPR[]) {
          if (!isWithinDays(pr.updated_at, eventDays)) continue;
          repoEvents.push({
            userId,
            source: "github" as const,
            ...normalizePR(pr, repo.full_name),
          });
        }

        for (const issue of activity.issues as RawIssue[]) {
          if (!isWithinDays(issue.updated_at, eventDays)) continue;
          repoEvents.push({
            userId,
            source: "github" as const,
            ...normalizeIssue(issue, repo.full_name),
          });
        }

        allEvents.push(...repoEvents);

        results.push({
          repoName: repo.full_name,
          status: "synced",
          reasons: [],
        });
      } catch (err: any) {
        console.error(
          `[Sync] Unexpected error processing repo ${repo.full_name}:`,
          err.message,
        );
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
            filter: {
              userId: event.userId,
              source: event.source,
              sourceEventId: event.sourceEventId,
            },
            update: { $set: event },
            upsert: true,
          },
        })),
      );
    }

    const synced = results.filter((r) => r.status === "synced").length;
    const skipped = results.filter((r) => r.status === "skipped").length;
    const partial = results.filter((r) => r.status === "partial").length;

    console.log(
      `[Sync] Complete: ${synced} synced, ${skipped} skipped (no recent commits), ${partial} partial`,
    );

    return {
      reposSynced: repoDocs.length,
      eventsSynced: allEvents.length,
      results,
    };
  },
};
