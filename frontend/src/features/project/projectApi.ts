import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "../../types/project";

const API_URL = import.meta.env.VITE_API_URL;

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: "include" }),
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects/all",
      transformResponse: (response: { data: Project[] }) => response.data,
      providesTags: ["Project"],
    }),
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: "/projects/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation<Project, { id: string; body: Partial<Project> }>({
      query: ({ id, body }) => ({
        url: `/projects/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
    removeProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRemoveProjectMutation,
} = projectApi;
