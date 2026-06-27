import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Secret } from "../../types/secret";

export const secretApi = createApi({
  reducerPath: "secretApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Secret", "Project", "Environment"],
  endpoints: (builder) => ({
    getSecrets: builder.query<Secret[], void>({
      query: () => "/secrets/all",
      transformResponse: (response: { data: Secret[] }) => response.data,
      providesTags: (result) => [
        { type: "Secret", id: "LIST" },
        ...(result ?? []).map((s) => ({ type: "Secret" as const, id: s._id })),
      ],
    }),
    addSecret: builder.mutation<Secret, Partial<Secret>>({
      query: (body) => ({
        url: "/secrets/save",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Secret", id: "LIST" },
        { type: "Project", id: arg.projectId! },
        ...(arg.environmentId ? [{ type: "Environment" as const, id: arg.environmentId }] : []),
      ],
    }),
    updateSecret: builder.mutation<Secret, { id: string; body: Partial<Secret> }>({
      query: ({ id, body }) => ({
        url: `/secrets/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Secret", id: arg.id },
        { type: "Project", id: arg.body.projectId! },
        ...(arg.body.environmentId ? [{ type: "Environment" as const, id: arg.body.environmentId }] : []),
      ],
    }),
    removeSecret: builder.mutation<void, string>({
      query: (id) => ({
        url: `/secrets/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Secret", id: "LIST" }],
    }),
  }),
});

export const { useGetSecretsQuery, useAddSecretMutation, useUpdateSecretMutation, useRemoveSecretMutation } = secretApi;
