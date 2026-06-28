import { baseApi } from "../../api/baseApi";
import type { Team } from "../../types/team";
import type { TeamInvite } from "../../types/teamInvite";
import type { TeamMember } from "../../types/teamMember";

interface InviteDetails {
  teamName: string;
  teamAvatar?: string;
  memberCount: number;
  role: string;
  hasAccount: boolean;
}

export const teamApi = baseApi.injectEndpoints({
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
        { type: "TeamInvite", id: "LIST" },
        { type: "TeamInvite", id: teamId },
      ],
    }),
    getTeamMembers: builder.query<TeamMember[], string>({
      query: (teamId) => `/teams/get/${teamId}/members`,
      transformResponse: (response: { data: TeamMember[] }) => response.data,
      providesTags: (result, error, teamId) => [
        { type: "TeamMembers", id: "LIST" },
        { type: "TeamMembers", id: teamId },
      ],
    }),
    removeTeamMember: builder.mutation<void, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({
        url: `/teams/get/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "TeamMembers", id: teamId },
        { type: "Team", id: "LIST" },
      ],
    }),
    removeMemberToInvite: builder.mutation<void, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({
        url: `/teams/get/${teamId}/members/${memberId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "TeamMembers", id: teamId },
        { type: "TeamInvite", id: teamId },
        { type: "Team", id: "LIST" },
      ],
    }),
    inviteMember: builder.mutation<void, { teamId: string; email: string; role?: string }>({
      query: ({ teamId, ...body }) => ({
        url: `/teams/get/${teamId}/invites`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "TeamInvite", id: teamId },
        { type: "TeamMembers", id: teamId },
      ],
    }),
    revokeInvite: builder.mutation<void, { teamId: string; inviteId: string }>({
      query: ({ teamId, inviteId }) => ({
        url: `/teams/get/${teamId}/invites/${inviteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { teamId }) => [
        { type: "TeamInvite", id: teamId },
        { type: "TeamMembers", id: teamId },
      ],
    }),
    acceptInvite: builder.query<{ redirect: string }, string>({
      query: (token) => `/teams/invite/accept/${token}`,
      transformResponse: (response: { data: { redirect: string } }) => response.data,
    }),
    getInviteDetails: builder.query<InviteDetails, string>({
      query: (token) => `/teams/invite/${token}`,
      transformResponse: (response: { data: InviteDetails }) => response.data,
    }),
    acceptInviteExplicit: builder.mutation<void, { token: string }>({
      query: (body) => ({
        url: "/teams/invite/accept",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Team", id: "LIST" }, { type: "TeamInvite", id: "LIST" }, { type: "TeamMembers", id: "LIST" }],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetTeamsQuery,
  useCheckEmailsMutation,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useRemoveTeamMutation,
  useGetTeamInvitesQuery,
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useRevokeInviteMutation,
  useRemoveTeamMemberMutation,
  useRemoveMemberToInviteMutation,
  useLazyAcceptInviteQuery,
  useLazyGetInviteDetailsQuery,
  useAcceptInviteExplicitMutation,
} = teamApi;
