import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Secret } from "../../types/secret";

interface SecretState {
  selectedSecret: Secret | null;
}

const initialState: SecretState = {
  selectedSecret: null,
};

export const secretSlice = createSlice({
  name: "secret",
  initialState,
  reducers: {
    setSelectedSecret: (state, action: PayloadAction<Secret | null>) => {
      state.selectedSecret = action.payload;
    },
  },
});

export const { setSelectedSecret } = secretSlice.actions;
export const selectSelectedSecret = (state: { secret: SecretState }) =>
  state.secret.selectedSecret;

export default secretSlice.reducer;
