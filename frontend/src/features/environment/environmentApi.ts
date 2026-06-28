import { baseApi } from "../../api/baseApi";
import type { Environment } from "../../types/environment";

export const environmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjectEnvironments: builder.query<Environment[], string>({
      query: (projectId) => `/projects/${projectId}/environments`,
      transformResponse: (response: { data: Environment[] }) => response.data,
      providesTags: (result, error, projectId) => [
        { type: "Environment", id: "LIST" },
        { type: "Environment", id: projectId },
        ...(result ?? []).map((e) => ({ type: "Environment" as const, id: e._id })),
      ],
    }),
    addProjectEnvironment: builder.mutation<Environment, { projectId: string; name: string }>({
      query: ({ projectId, name }) => ({
        url: `/projects/${projectId}/environments`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Environment", id: "LIST" },
        { type: "Environment", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
    updateProjectEnvironment: builder.mutation<Environment, { projectId: string; environmentId: string; name: string }>({
      query: ({ projectId, environmentId, name }) => ({
        url: `/projects/${projectId}/environments/${environmentId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: (result, error, { projectId, environmentId }) => [
        { type: "Environment", id: environmentId },
        { type: "Environment", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
    removeProjectEnvironment: builder.mutation<void, { projectId: string; environmentId: string }>({
      query: ({ projectId, environmentId }) => ({
        url: `/projects/${projectId}/environments/${environmentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { projectId }) => [
        { type: "Environment", id: "LIST" },
        { type: "Environment", id: projectId },
        { type: "Project", id: projectId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetProjectEnvironmentsQuery,
  useAddProjectEnvironmentMutation,
  useUpdateProjectEnvironmentMutation,
  useRemoveProjectEnvironmentMutation,
} = environmentApi;
