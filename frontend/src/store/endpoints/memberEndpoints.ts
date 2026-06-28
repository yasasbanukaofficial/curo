import { baseApi } from "../baseApi";
import type { TeamMember, TeamInvite } from "../../types";

export const memberEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeamMembers: builder.query<TeamMember[], string>({
      query: (teamId) => ({ url: `/teams/get/${teamId}/members`, method: "GET" }),
      providesTags: (_result, _error, teamId) => [
        { type: "TeamMember", id: teamId },
        { type: "TeamMember", id: "LIST" },
        ...(_result ?? []).map((m) => ({ type: "TeamMember" as const, id: m._id })),
      ],
    }),
    inviteMember: builder.mutation<any, { teamId: string; email: string; role?: string }>({
      query: ({ teamId, ...body }) => ({ url: `/teams/get/${teamId}/invites`, method: "POST", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "TeamMember", id: arg.teamId },
        { type: "TeamInvite", id: arg.teamId },
      ],
    }),
    removeMember: builder.mutation<any, { teamId: string; memberId: string }>({
      query: ({ teamId, memberId }) => ({ url: `/teams/get/${teamId}/members/${memberId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "TeamMember", id: arg.teamId },
        { type: "TeamMember", id: "LIST" },
      ],
    }),
    updateMemberRole: builder.mutation<any, { teamId: string; memberId: string; role: string }>({
      query: ({ teamId, memberId, ...body }) => ({ url: `/teams/get/${teamId}/members/${memberId}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => [{ type: "TeamMember", id: arg.teamId }],
    }),
    getTeamInvites: builder.query<TeamInvite[], string>({
      query: (teamId) => ({ url: `/teams/get/${teamId}/invites`, method: "GET" }),
      providesTags: (_result, _error, teamId) => [
        { type: "TeamInvite", id: teamId },
        { type: "TeamInvite", id: "LIST" },
      ],
    }),
    revokeInvite: builder.mutation<any, { teamId: string; inviteId: string }>({
      query: ({ teamId, inviteId }) => ({ url: `/teams/get/${teamId}/invites/${inviteId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [{ type: "TeamInvite", id: arg.teamId }],
    }),
    acceptInviteExplicit: builder.mutation<any, { token: string }>({
      query: (body) => ({ url: "/teams/invite/accept", method: "POST", body }),
      invalidatesTags: [
        { type: "TeamMember", id: "LIST" },
        { type: "Team", id: "LIST" },
        { type: "Project", id: "LIST" },
      ],
    }),
    getInviteDetails: builder.query<any, string>({
      query: (token) => ({ url: `/teams/invite/${token}`, method: "GET" }),
    }),
  }),
});

export const {
  useGetTeamMembersQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
  useGetTeamInvitesQuery,
  useRevokeInviteMutation,
  useAcceptInviteExplicitMutation,
  useLazyGetInviteDetailsQuery,
} = memberEndpoints;
