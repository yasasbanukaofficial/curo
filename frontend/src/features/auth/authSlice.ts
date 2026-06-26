import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isEmailVerified: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<{ isEmailVerified: boolean }>) => {
      state.isAuthenticated = true;
      state.isEmailVerified = action.payload.isEmailVerified;
    },
    setEmailVerified: (state) => {
      state.isEmailVerified = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isEmailVerified = false;
    },
  },
});

export const { setAuthenticated, setEmailVerified, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const selectIsEmailVerified = (state: { auth: AuthState }) =>
  state.auth.isEmailVerified;

export default authSlice.reducer;
