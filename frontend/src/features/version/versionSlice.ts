import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Version } from "../../types/version";

interface VersionState {
  items: Version[];
  loading: boolean;
  error: string | null;
}

const initialState: VersionState = {
  items: [],
  loading: false,
  error: null,
};

export const versionSlice = createSlice({
  name: "version",
  initialState,
  reducers: {
    setVersions: (state, action: PayloadAction<Version[]>) => {
      state.items = action.payload;
    },
    addVersion: (state, action: PayloadAction<Version>) => {
      state.items.push(action.payload);
    },
    setVersionsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setVersionsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setVersions, addVersion, setVersionsLoading, setVersionsError } = versionSlice.actions;
export default versionSlice.reducer;
