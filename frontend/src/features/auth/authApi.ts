import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { User } from "../../types/user";

interface AuthResponse {
  success: boolean;
  status: number;
  data?: User & { verificationToken?: string };
  msg?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface VerifyOtpRequest {
  otp: string;
  token?: string;
  inviteToken?: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  token: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    verifySession: builder.query<{ data: User }, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    verifyOtp: builder.mutation<AuthResponse, VerifyOtpRequest>({
      query: (body) => ({ url: "/auth/verify-email/otp", method: "POST", body }),
    }),
    resendVerification: builder.mutation<AuthResponse, void>({
      query: () => ({ url: "/auth/verify-email/resend", method: "POST" }),
    }),
    forgotPassword: builder.mutation<AuthResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    changePassword: builder.mutation<AuthResponse, ChangePasswordRequest>({
      query: (body) => ({ url: "/auth/change-password", method: "PUT", body }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    disconnectOAuth: builder.mutation<AuthResponse, { provider: string }>({
      query: (body) => ({ url: "/auth/disconnect-oauth", method: "POST", body }),
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
    }),
    markOnboardingComplete: builder.mutation<AuthResponse, { skipped?: boolean }>({
      query: (body) => ({ url: "/auth/onboarding-complete", method: "PATCH", body }),
    }),
  }),
});

export const {
  useVerifySessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useLogoutMutation,
  useDisconnectOAuthMutation,
  useRefreshTokenMutation,
  useMarkOnboardingCompleteMutation,
} = authApi;
