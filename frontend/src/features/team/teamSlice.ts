import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Team } from "../../types/team";
import type { TeamMember, TeamRole, MemberStatus } from "../../types/teamMember";
import type { TeamInvite } from "../../types/teamInvite";

interface TeamState {
  items: Team[];
  selectedTeam: Team | null;
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  items: [],
  selectedTeam: null,
  loading: false,
  error: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.items = action.payload;
    },
    addTeam: (state, action: PayloadAction<Team>) => {
      state.items.push(action.payload);
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const index = state.items.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeTeam: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t._id !== action.payload);
    },
    setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
      state.selectedTeam = action.payload;
    },
    setTeamsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTeamsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addTeamMember: (state, action: PayloadAction<{ teamId: string; member: TeamMember }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) team.members.push(action.payload.member);
    },
    updateTeamMember: (state, action: PayloadAction<{ teamId: string; member: TeamMember }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) {
        const index = team.members.findIndex((m) => m._id === action.payload.member._id);
        if (index !== -1) team.members[index] = action.payload.member;
      }
    },
    removeTeamMember: (state, action: PayloadAction<{ teamId: string; memberId: string }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) team.members = team.members.filter((m) => m._id !== action.payload.memberId);
    },
    updateMemberRole: (state, action: PayloadAction<{ teamId: string; memberId: string; role: TeamRole }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) {
        const member = team.members.find((m) => m._id === action.payload.memberId);
        if (member) member.role = action.payload.role;
      }
    },
    updateMemberStatus: (state, action: PayloadAction<{ teamId: string; memberId: string; status: MemberStatus }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) {
        const member = team.members.find((m) => m._id === action.payload.memberId);
        if (member) member.status = action.payload.status;
      }
    },
    addTeamInvite: (state, action: PayloadAction<{ teamId: string; invite: TeamInvite }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) team.invites.push(action.payload.invite);
    },
    removeTeamInvite: (state, action: PayloadAction<{ teamId: string; inviteId: string }>) => {
      const team = state.items.find((t) => t._id === action.payload.teamId);
      if (team) team.invites = team.invites.filter((i) => i._id !== action.payload.inviteId);
    },
  },
});

export const {
  setTeams,
  addTeam,
  updateTeam,
  removeTeam,
  setSelectedTeam,
  setTeamsLoading,
  setTeamsError,
  addTeamMember,
  updateTeamMember,
  removeTeamMember,
  updateMemberRole,
  updateMemberStatus,
  addTeamInvite,
  removeTeamInvite,
} = teamSlice.actions;
export default teamSlice.reducer;
