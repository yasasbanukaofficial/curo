import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Team } from "../../types/team";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Team", "Project"],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
        query: () => "/teams/all",
      transformResponse: (response: { data: Team[] }) => response.data,
      providesTags: (result) => [
        { type: "Team", id: "LIST" },
        ...(result ?? []).map((t) => ({ type: "Team" as const, id: t._id })),
      ],
    }),
    addTeam: builder.mutation<Team, Partial<Team>>({
      query: (body) => ({
        url: "/teams/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
    updateTeam: builder.mutation<Team, { id: string; body: Partial<Team> }>({
      query: ({ id, body }) => ({
        url: `/teams/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Team", id: arg.id }],
    }),
    removeTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }, { type: "Project", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
} = teamApi;
