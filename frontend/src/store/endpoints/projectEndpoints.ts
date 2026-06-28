import { baseApi } from "../baseApi";
import type { Project } from "../../types";

export const projectEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({ url: "/projects/all", method: "GET" }),
      providesTags: (result) =>
        result
          ? [{ type: "Project", id: "LIST" }, ...result.map((p) => ({ type: "Project" as const, id: p._id }))]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProjectById: builder.query<Project, string>({
      query: (projectId) => ({ url: `/projects/get/${projectId}`, method: "GET" }),
      providesTags: (_result, _error, projectId) => [{ type: "Project", id: projectId }],
    }),
    createProject: builder.mutation<any, { projectName: string; description?: string; projectLink?: string; teamId?: string }>({
      query: (body) => ({ url: "/projects/create", method: "POST", body }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation<any, { projectId: string; projectName?: string; description?: string; projectLink?: string }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/update/${projectId}`, method: "PUT", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg.projectId },
      ],
    }),
    deleteProject: builder.mutation<any, string>({
      query: (projectId) => ({ url: `/projects/delete/${projectId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, projectId) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: projectId },
      ],
    }),
    addTeamToProject: builder.mutation<any, { projectId: string; teamId: string }>({
      query: ({ projectId, ...body }) => ({ url: `/projects/${projectId}/teams`, method: "POST", body }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg.projectId },
      ],
    }),
    removeTeamFromProject: builder.mutation<any, { projectId: string; teamId: string }>({
      query: ({ projectId, teamId }) => ({ url: `/projects/${projectId}/teams/${teamId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg.projectId },
      ],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useAddTeamToProjectMutation,
  useRemoveTeamFromProjectMutation,
} = projectEndpoints;
