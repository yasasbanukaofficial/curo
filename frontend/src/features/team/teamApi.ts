import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Team } from "../../types/team";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Team"],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
        query: () => "/teams/all",
      transformResponse: (response: { data: Team[] }) => response.data,
      providesTags: ["Team"],
    }),
    addTeam: builder.mutation<Team, Partial<Team>>({
      query: (body) => ({
        url: "/teams/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    updateTeam: builder.mutation<Team, { id: string; body: Partial<Team> }>({
      query: ({ id, body }) => ({
        url: `/teams/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Team"],
    }),
    removeTeam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teams/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Team"],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
} = teamApi;
