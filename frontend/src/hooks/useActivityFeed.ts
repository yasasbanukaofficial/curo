import { useMemo } from "react";
import {
  useGetOverviewStatsQuery,
  useGetTeamsQuery,
  useGetProjectsQuery,
  useVerifySessionQuery,
} from "../store";
import type { ActivityLogEntry } from "../types/activity";

interface UseActivityFeedOptions {
  entityType?: string;
  search?: string;
  dateRange?: string;
}

function toEntry(
  entity: "project" | "secret" | "team",
  action: string,
  id: string,
  name: string,
  description: string,
  dateStr: string | undefined,
  userName: string,
  extra?: Partial<ActivityLogEntry>,
): ActivityLogEntry | null {
  if (!dateStr) return null;
  return {
    _id: `${entity}-${id}`,
    action,
    entityType: entity,
    entityId: id,
    entityName: name,
    description,
    userId: "",
    userName,
    projectName: extra?.projectName,
    projectId: extra?.projectId,
    teamName: extra?.teamName,
    teamId: extra?.teamId,
    environmentName: extra?.environmentName,
    createdAt: dateStr,
  };
}

export function useActivityFeed(options: UseActivityFeedOptions = {}) {
  const { data: userData } = useVerifySessionQuery();
  const { data: stats } = useGetOverviewStatsQuery();
  const { data: teams = [] } = useGetTeamsQuery();
  const { data: allProjects = [] } = useGetProjectsQuery();

  const userName = (userData as any)?.displayName || (userData as any)?.name || (userData as any)?.email || "User";

  const allEntries = useMemo(() => {
    const entries: ActivityLogEntry[] = [];

    const recentProjects = stats?.recentProjects ?? [];
    const recentSecrets = stats?.recentSecrets ?? [];

    for (const p of recentProjects) {
      const entry = toEntry(
        "project", "created",
        p._id, p.projectName,
        `Created project ${p.projectName}`,
        p.updatedAt, userName,
        { teamName: p.teamName ?? undefined, teamId: p.teamId ?? undefined },
      );
      if (entry) entries.push(entry);
    }

    for (const s of recentSecrets) {
      const entry = toEntry(
        "secret", "created",
        s._id, s.secName,
        `Added secret ${s.secName}`,
        s.createdAt, userName,
        { projectName: s.projectName, projectId: s.projectId },
      );
      if (entry) entries.push(entry);
    }

    for (const t of teams) {
      const entry = toEntry(
        "team", "created",
        t._id, t.name,
        `Created team ${t.name}`,
        t.createdAt, userName,
      );
      if (entry) entries.push(entry);

      if (t.updatedAt && t.updatedAt !== t.createdAt) {
        const updateEntry = toEntry(
          "team", "updated",
          `${t._id}-update`, t.name,
          `Updated team ${t.name}`,
          t.updatedAt, userName,
        );
        if (updateEntry) entries.push(updateEntry);
      }
    }

    for (const p of allProjects) {
      if (!recentProjects.some((rp: any) => rp._id === p._id)) {
        const entry = toEntry(
          "project", "created",
          p._id, p.projectName,
          `Created project ${p.projectName}`,
          p.createdAt, userName,
          { teamId: p.teamId ?? undefined },
        );
        if (entry) entries.push(entry);
      }

      if (p.updatedAt && p.updatedAt !== p.createdAt) {
        const updateEntry = toEntry(
          "project", "updated",
          `${p._id}-update`, p.projectName,
          `Updated project ${p.projectName}`,
          p.updatedAt, userName,
          { teamId: p.teamId ?? undefined },
        );
        if (updateEntry) entries.push(updateEntry);
      }
    }

    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return entries;
  }, [stats, teams, allProjects, userName]);

  const filtered = useMemo(() => {
    let result = allEntries;

    if (options.entityType) {
      result = result.filter((e) => e.entityType === options.entityType);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.entityName.toLowerCase().includes(q) ||
          e.userName.toLowerCase().includes(q) ||
          (e.projectName && e.projectName.toLowerCase().includes(q)),
      );
    }

    if (options.dateRange && options.dateRange !== "custom") {
      const days = parseInt(options.dateRange);
      if (!isNaN(days)) {
        const cutoff = Date.now() - days * 86400000;
        result = result.filter((e) => new Date(e.createdAt).getTime() > cutoff);
      }
    }

    return result;
  }, [allEntries, options.entityType, options.search, options.dateRange]);

  return {
    entries: filtered,
    total: filtered.length,
  };
}
