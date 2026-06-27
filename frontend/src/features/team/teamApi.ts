import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Team } from "../../types/team";
import type { TeamInvite } from "../../types/teamInvite";

export const teamApi = createApi({
  reducerPath: "teamApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Team", "Project", "TeamInvite"],
  endpoints: (builder) => ({
    getTeams: builder.query<Team[], void>({
        query: () => "/teams/all",
      transformResponse: (response: { data: Team[] }) => response.data,
      providesTags: (result) => [
        { type: "Team", id: "LIST" },
        ...(result ?? []).map((t) => ({ type: "Team" as const, id: t._id })),
      ],
    }),
    checkEmails: builder.mutation<{ registered: string[]; unregistered: string[] }, { emails: string[] }>({
      query: (body) => ({
        url: "/teams/check-emails",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: { registered: string[]; unregistered: string[] } }) => response.data,
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
    getTeamInvites: builder.query<TeamInvite[], string>({
      query: (teamId) => `/teams/get/${teamId}/invites`,
      transformResponse: (response: { data: TeamInvite[] }) => response.data,
      providesTags: (result, error, teamId) => [
        { type: "TeamInvite", id: teamId },
      ],
    }),
    inviteMember: builder.mutation<void, { teamId: string; email: string; role?: string }>({
      query: ({ teamId, ...body }) => ({
        url: `/teams/get/${teamId}/invites`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "TeamInvite", id: teamId }],
    }),
    revokeInvite: builder.mutation<void, { teamId: string; inviteId: string }>({
      query: ({ teamId, inviteId }) => ({
        url: `/teams/get/${teamId}/invites/${inviteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [{ type: "TeamInvite", id: teamId }],
    }),
    acceptInvite: builder.query<{ redirect: string }, string>({
      query: (token) => `/teams/invite/accept/${token}`,
      transformResponse: (response: { data: { redirect: string } }) => response.data,
    }),
  }),
});

export const {
  useGetTeamsQuery,
  useCheckEmailsMutation,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
  useGetTeamInvitesQuery,
  useInviteMemberMutation,
  useRevokeInviteMutation,
  useLazyAcceptInviteQuery,
} = teamApi;
