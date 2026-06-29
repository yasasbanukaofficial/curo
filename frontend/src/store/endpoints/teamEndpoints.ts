import { baseApi } from "../baseApi";
import type { Team } from "../../types";

export const teamEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
      query: () => ({ url: "/teams/all", method: "GET" }),
      providesTags: (result) =>
        result
          ? [{ type: "Team", id: "LIST" }, ...result.map((t) => ({ type: "Team" as const, id: t._id }))]
          : [{ type: "Team", id: "LIST" }],
    }),
    checkEmails: builder.mutation<{ registered: string[]; unregistered: string[] }, { emails: string[] }>({
      query: (body) => ({ url: "/teams/check-emails", method: "POST", body }),
    }),
    createTeam: builder.mutation<any, { name: string; slug: string; emails?: { email: string; role?: string }[] }>({
      query: (body) => ({ url: "/teams/create", method: "POST", body }),
      invalidatesTags: [{ type: "Team", id: "LIST" }],
    }),
    updateTeam: builder.mutation<any, { id: string; name?: string; slug?: string; billingEmail?: string }>({
      query: ({ id, ...body }) => ({ url: `/teams/update/${id}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Team", id: arg.id }, { type: "Team", id: "LIST" }],
    }),
    deleteTeam: builder.mutation<any, string>({
      query: (id) => ({ url: `/teams/delete/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, id) => [{ type: "Team", id: "LIST" }, { type: "Team", id }, { type: "Project", id: "LIST" }],
    }),
    getTeamById: builder.query<Team, string>({
      query: (teamId) => ({ url: `/teams/get/${teamId}`, method: "GET" }),
      providesTags: (_result, _error, teamId) => [{ type: "Team", id: teamId }],
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCheckEmailsMutation,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamByIdQuery,
} = teamEndpoints;
