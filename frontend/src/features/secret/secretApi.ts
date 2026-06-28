import { baseApi } from "../../api/baseApi";
import type { Secret } from "../../types/secret";

export const secretApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectSecrets: builder.query<Secret[], string>({
      query: (projectId) => `/projects/${projectId}/secrets`,
      transformResponse: (response: { data: Secret[] }) => response.data,
      providesTags: (result, error, projectId) => [
        { type: "Secret", id: "LIST" },
        { type: "Secret", id: projectId },
        ...(result ?? []).map((s) => ({ type: "Secret" as const, id: s._id })),
      ],
    }),
    addProjectSecret: builder.mutation<Secret, { projectId: string; body: Partial<Secret> }>({
      query: ({ projectId, body }) => ({
        url: `/projects/${projectId}/secrets`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Secret", id: "LIST" },
        { type: "Secret", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
    updateProjectSecret: builder.mutation<Secret, { projectId: string; secretId: string; body: Partial<Secret> }>({
      query: ({ projectId, secretId, body }) => ({
        url: `/projects/${projectId}/secrets/${secretId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { projectId, secretId }) => [
        { type: "Secret", id: secretId },
        { type: "Secret", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
    removeProjectSecret: builder.mutation<void, { projectId: string; secretId: string }>({
      query: ({ projectId, secretId }) => ({
        url: `/projects/${projectId}/secrets/${secretId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Secret", id: "LIST" },
        { type: "Secret", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetProjectSecretsQuery,
  useAddProjectSecretMutation,
  useUpdateProjectSecretMutation,
  useRemoveProjectSecretMutation,
} = secretApi;
