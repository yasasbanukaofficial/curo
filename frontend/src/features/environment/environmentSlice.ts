import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Environment } from "../../types/environment";

interface EnvironmentState {
  items: Environment[];
  selectedEnvironment: Environment | null;
  loading: boolean;
  error: string | null;
}

const initialState: EnvironmentState = {
  items: [],
  selectedEnvironment: null,
  loading: false,
  error: null,
};

export const environmentSlice = createSlice({
  name: "environment",
  initialState,
  reducers: {
    setEnvironments: (state, action: PayloadAction<Environment[]>) => {
      state.items = action.payload;
    },
    addEnvironment: (state, action: PayloadAction<Environment>) => {
      state.items.push(action.payload);
    },
    updateEnvironment: (state, action: PayloadAction<Environment>) => {
      const index = state.items.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeEnvironment: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((e) => e._id !== action.payload);
    },
    setSelectedEnvironment: (state, action: PayloadAction<Environment | null>) => {
      state.selectedEnvironment = action.payload;
    },
    setEnvironmentsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setEnvironmentsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEnvironments,
  addEnvironment,
  updateEnvironment,
  removeEnvironment,
  setSelectedEnvironment,
  setEnvironmentsLoading,
  setEnvironmentsError,
} = environmentSlice.actions;
export default environmentSlice.reducer;
