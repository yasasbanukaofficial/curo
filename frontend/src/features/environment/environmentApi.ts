import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Environment } from "../../types/environment";

export const environmentApi = createApi({
  reducerPath: "environmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Environment", "Project"],
  endpoints: (builder) => ({
    getEnvironments: builder.query<Environment[], void>({
      query: () => "/environments/all",
      transformResponse: (response: { data: Environment[] }) => response.data,
      providesTags: (result) => [
        { type: "Environment", id: "LIST" },
        ...(result ?? []).map((e) => ({ type: "Environment" as const, id: e._id })),
      ],
    }),
    addEnvironment: builder.mutation<Environment, Partial<Environment>>({
      query: (body) => ({
        url: "/environments/create",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Environment", id: "LIST" },
        ...(arg.projectId ? [{ type: "Project" as const, id: arg.projectId }] : []),
      ],
    }),
    updateEnvironment: builder.mutation<Environment, { id: string; body: Partial<Environment> }>({
      query: ({ id, body }) => ({
        url: `/environments/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Environment", id: arg.id },
        ...(arg.body.projectId ? [{ type: "Project" as const, id: arg.body.projectId }] : []),
      ],
    }),
    removeEnvironment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/environments/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Environment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetEnvironmentsQuery,
  useAddEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useRemoveEnvironmentMutation,
} = environmentApi;
