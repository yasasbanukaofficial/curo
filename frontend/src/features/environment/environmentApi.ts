import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Environment } from "../../types/environment";

export const environmentApi = createApi({
  reducerPath: "environmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Environment"],
  endpoints: (builder) => ({
    getEnvironments: builder.query<Environment[], void>({
      query: () => "/environments/all",
      transformResponse: (response: { data: Environment[] }) => response.data,
      providesTags: ["Environment"],
    }),
    addEnvironment: builder.mutation<Environment, Partial<Environment>>({
      query: (body) => ({
        url: "/environments/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Environment"],
    }),
    updateEnvironment: builder.mutation<Environment, { id: string; body: Partial<Environment> }>({
      query: ({ id, body }) => ({
        url: `/environments/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Environment"],
    }),
    removeEnvironment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/environments/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Environment"],
    }),
  }),
});

export const {
  useGetEnvironmentsQuery,
  useAddEnvironmentMutation,
  useUpdateEnvironmentMutation,
  useRemoveEnvironmentMutation,
} = environmentApi;
