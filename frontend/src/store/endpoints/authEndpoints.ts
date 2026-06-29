import { baseApi } from "../baseApi";

export const authEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    verifySession: builder.query<any, void>({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: [{ type: "User", id: "ME" }],
    }),
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<any, { name: string; email: string; password: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    verifyEmail: builder.mutation<any, { otp: string; token?: string }>({
      query: (body) => ({ url: "/auth/verify-email/otp", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    resendOtp: builder.mutation<any, void>({
      query: () => ({ url: "/auth/verify-email/resend", method: "POST" }),
    }),
    logout: builder.mutation<any, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["User", "Team", "TeamMember", "TeamInvite", "Project", "Secret", "Environment", "Version"],
    }),
    changePassword: builder.mutation<any, { currentPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/auth/change-password", method: "PUT", body }),
    }),
    disconnectOAuth: builder.mutation<any, { provider: string }>({
      query: (body) => ({ url: "/auth/disconnect-oauth", method: "POST", body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    updateProfile: builder.mutation<any, { name: string }>({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
      invalidatesTags: [{ type: "User", id: "ME" }],
    }),
    sendPasswordResetLink: builder.mutation<void, void>({
      query: () => ({ url: "/auth/send-reset-link", method: "POST" }),
    }),
    verifyResetToken: builder.query<any, string>({
      query: (token) => ({ url: `/auth/reset-password/${token}`, method: "GET" }),
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<any, { token: string; password: string }>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
    }),
    deleteAccount: builder.mutation<void, void>({
      query: () => ({ url: "/auth/account", method: "DELETE" }),
    }),
  }),
});

export const {
  useVerifySessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useSendPasswordResetLinkMutation,
  useVerifyResetTokenQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDisconnectOAuthMutation,
  useDeleteAccountMutation,
} = authEndpoints;
