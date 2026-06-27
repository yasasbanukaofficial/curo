import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Team } from "../../types/team";

interface TeamState {
  selectedTeam: Team | null;
}

const initialState: TeamState = {
  selectedTeam: null,
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setSelectedTeam: (state, action: PayloadAction<Team | null>) => {
      state.selectedTeam = action.payload;
    },
  },
});

export const { setSelectedTeam } = teamSlice.actions;

export const selectSelectedTeam = (state: { team: TeamState }) =>
  state.team.selectedTeam;

export default teamSlice.reducer;
