import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  id: string;
  name: string;
  email: string;
  provider: string[];
  googleId?: string;
  githubId?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  user: UserData | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isEmailVerified: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<{ user: UserData }>) => {
      state.isAuthenticated = true;
      state.isEmailVerified = action.payload.user.emailVerified;
      state.user = action.payload.user;
    },
    setEmailVerified: (state) => {
      state.isEmailVerified = true;
      if (state.user) state.user.emailVerified = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      state.user = null;
      localStorage.clear();
    },
  },
});

export const { setAuthenticated, setEmailVerified, logout } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;

export const selectIsEmailVerified = (state: { auth: AuthState }) =>
  state.auth.isEmailVerified;

export const selectUser = (state: { auth: AuthState }) =>
  state.auth.user;

export default authSlice.reducer;
