import { baseApi } from "../baseApi";
import type { ActivityLogResponse, ActivityLogFilters } from "../../types/activity";

export const activityEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActivityLog: builder.query<ActivityLogResponse, ActivityLogFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        if (filters.dateRange?.start) params.set("startDate", filters.dateRange.start);
        if (filters.dateRange?.end) params.set("endDate", filters.dateRange.end);
        if (filters.entityType) params.set("entityType", filters.entityType);
        if (filters.projectId) params.set("projectId", filters.projectId);
        if (filters.teamId) params.set("teamId", filters.teamId);
        if (filters.userId) params.set("userId", filters.userId);
        if (filters.search) params.set("search", filters.search);
        if (filters.page) params.set("page", String(filters.page));
        if (filters.limit) params.set("limit", String(filters.limit));
        const qs = params.toString();
        return { url: qs ? `/activity?${qs}` : "/activity", method: "GET" };
      },
      providesTags: [{ type: "Version" as any, id: "ACTIVITY" }],
    }),
  }),
});

export const { useGetActivityLogQuery } = activityEndpoints;
