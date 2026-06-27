import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Environment } from "../../types/environment";

interface EnvironmentState {
  selectedEnvironment: Environment | null;
}

const initialState: EnvironmentState = {
  selectedEnvironment: null,
};

export const environmentSlice = createSlice({
  name: "environment",
  initialState,
  reducers: {
    setSelectedEnvironment: (state, action: PayloadAction<Environment | null>) => {
      state.selectedEnvironment = action.payload;
    },
  },
});

export const { setSelectedEnvironment } = environmentSlice.actions;

export const selectSelectedEnvironment = (state: { environment: EnvironmentState }) =>
  state.environment.selectedEnvironment;

export default environmentSlice.reducer;
