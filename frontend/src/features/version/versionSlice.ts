import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Version } from "../../types/version";

interface VersionState {
  selectedVersion: Version | null;
}

const initialState: VersionState = {
  selectedVersion: null,
};

export const versionSlice = createSlice({
  name: "version",
  initialState,
  reducers: {
    setSelectedVersion: (state, action: PayloadAction<Version | null>) => {
      state.selectedVersion = action.payload;
    },
  },
});

export const { setSelectedVersion } = versionSlice.actions;

export const selectSelectedVersion = (state: { version: VersionState }) =>
  state.version.selectedVersion;

export default versionSlice.reducer;
