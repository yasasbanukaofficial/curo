import { baseApi } from "../baseApi";

export interface RecentProject {
  _id: string;
  projectName: string;
  teamId: string | null;
  teamName: string | null;
  secretCount: number;
  environmentCount: number;
  updatedAt: string | undefined;
}

export interface RecentSecret {
  _id: string;
  secName: string;
  projectId: string;
  projectName: string;
  createdAt: string | undefined;
}

export interface OverviewStats {
  teams: number;
  projects: number;
  secrets: number;
  environments: number;
  recentProjects: RecentProject[];
  recentSecrets: RecentSecret[];
}

export const overviewEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverviewStats: builder.query<OverviewStats, void>({
      query: () => ({ url: "/users/overview/stats", method: "GET" }),
      providesTags: [
        { type: "Project", id: "LIST" },
        { type: "Secret", id: "LIST" },
        { type: "Environment", id: "LIST" },
        { type: "Team", id: "LIST" },
      ],
    }),
  }),
});

export const { useGetOverviewStatsQuery } = overviewEndpoints;
