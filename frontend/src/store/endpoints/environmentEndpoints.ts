import { baseApi } from "../baseApi";
import type { Environment } from "../../types";

export const environmentEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnvironments: builder.query<Environment[], string>({
      query: (projectId) => ({ url: `/projects/${projectId}/environments`, method: "GET" }),
      providesTags: (_result, _error, projectId) => [
        { type: "Environment", id: projectId },
        { type: "Environment", id: "LIST" },
        ...(_result ?? []).map((e) => ({ type: "Environment" as const, id: e._id })),
      ],
    }),
    createEnvironment: builder.mutation<any, { projectId: string; name: string }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/${projectId}/environments`, method: "POST", body }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Environment", id: arg.projectId }],
    }),
    updateEnvironment: builder.mutation<any, { projectId: string; envId: string; name: string }>({
      query: ({ projectId, envId, ...body }) => ({ url: `/projects/${projectId}/environments/${envId}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Environment", id: arg.projectId },
      ],
    }),
    deleteEnvironment: builder.mutation<any, { projectId: string; envId: string }>({
      query: ({ projectId, envId }) => ({ url: `/projects/${projectId}/environments/${envId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Environment", id: arg.projectId },
        { type: "Secret", id: arg.projectId },
      ],
    }),
  }),
});

export const {
  useGetEnvironmentsQuery,
  useCreateEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useDeleteEnvironmentMutation,
} = environmentEndpoints;
