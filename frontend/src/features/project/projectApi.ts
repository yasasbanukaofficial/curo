import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Project } from "../../types/project";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Project", "Team"],
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects/all",
      transformResponse: (response: { data: Project[] }) => response.data,
      providesTags: (result) => [
        { type: "Project", id: "LIST" },
        ...(result ?? []).map((p) => ({ type: "Project" as const, id: p._id })),
      ],
    }),
    addProject: builder.mutation<Project, Partial<Project>>({
      query: (body) => ({
        url: "/projects/create",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Project }) => response.data,
      invalidatesTags: [{ type: "Project", id: "LIST" }, { type: "Team", id: "LIST" }],
    }),
    updateProject: builder.mutation<Project, { id: string; body: Partial<Project> }>({
      query: ({ id, body }) => ({
        url: `/projects/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Project", id: arg.id }],
    }),
    removeProject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/projects/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }, { type: "Team", id: "LIST" }],
    }),
    addTeamToProject: builder.mutation<void, { projectId: string; teamId: string }>({
      query: ({ projectId, teamId }) => ({
        url: `/projects/${projectId}/teams`,
        method: "POST",
        body: { teamId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: arg.projectId },
        { type: "Team", id: "LIST" },
      ],
    }),
    removeTeamFromProject: builder.mutation<void, { projectId: string; teamId: string }>({
      query: ({ projectId, teamId }) => ({
        url: `/projects/${projectId}/teams/${teamId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Project", id: arg.projectId },
        { type: "Team", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useRemoveProjectMutation,
  useAddTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
} = projectApi;
