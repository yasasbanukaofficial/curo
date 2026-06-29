import { baseApi } from "../baseApi";

export interface OverviewStats {
  teams: number;
  projects: number;
  secrets: number;
  environments: number;
  recentProjects: {
    _id: string;
    projectName: string;
    secretCount: number;
    environmentCount: number;
  }[];
  recentSecrets: {
    _id: string;
    secName: string;
    projectId: string;
    projectName: string;
  }[];
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
