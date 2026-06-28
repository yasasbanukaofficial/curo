import { baseApi } from "../baseApi";
import type { Secret } from "../../types";

export const secretEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSecrets: builder.query<Secret[], string>({
      query: (projectId) => ({ url: `/projects/${projectId}/secrets`, method: "GET" }),
      providesTags: (_result, _error, projectId) => [
        { type: "Secret", id: projectId },
        { type: "Secret", id: "LIST" },
        ...(_result ?? []).map((s) => ({ type: "Secret" as const, id: s._id })),
      ],
    }),
    createSecret: builder.mutation<any, { projectId: string; secName: string; secKey: string; environmentId?: string }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/${projectId}/secrets`, method: "POST", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Secret", id: arg.projectId },
        { type: "AuditLog", id: "LIST" },
      ],
    }),
    updateSecret: builder.mutation<any, { projectId: string; secretId: string; secName?: string; secKey?: string; environmentId?: string }>({
      query: ({ projectId, secretId, ...body }) => ({ url: `/projects/${projectId}/secrets/${secretId}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Secret", id: arg.projectId },
        { type: "AuditLog", id: "LIST" },
      ],
    }),
    deleteSecret: builder.mutation<any, { projectId: string; secretId: string }>({
      query: ({ projectId, secretId }) => ({ url: `/projects/${projectId}/secrets/${secretId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Secret", id: arg.projectId },
        { type: "AuditLog", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSecretsQuery,
  useCreateSecretMutation,
  useUpdateSecretMutation,
  useDeleteSecretMutation,
} = secretEndpoints;
