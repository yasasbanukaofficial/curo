import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Secret } from "../../types/secret";

interface SecretState {
  items: Secret[];
  selectedSecret: Secret | null;
  loading: boolean;
  error: string | null;
}

const initialState: SecretState = {
  items: [],
  selectedSecret: null,
  loading: false,
  error: null,
};

export const secretSlice = createSlice({
  name: "secret",
  initialState,
  reducers: {
    setSecrets: (state, action: PayloadAction<Secret[]>) => {
      state.items = action.payload;
    },
    addSecret: (state, action: PayloadAction<Secret>) => {
      state.items.push(action.payload);
    },
    updateSecret: (state, action: PayloadAction<Secret>) => {
      const index = state.items.findIndex((s) => s._id === action.payload._id);
      if (index !== -1) state.items[index] = action.payload;
    },
    removeSecret: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((s) => s._id !== action.payload);
    },
    setSelectedSecret: (state, action: PayloadAction<Secret | null>) => {
      state.selectedSecret = action.payload;
    },
    setSecretsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSecretsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSecrets,
  addSecret,
  updateSecret,
  removeSecret,
  setSelectedSecret,
  setSecretsLoading,
  setSecretsError,
} = secretSlice.actions;
export default secretSlice.reducer;
