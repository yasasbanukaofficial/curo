import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Secret } from "../../types/secret";

export const secretApi = createApi({
  reducerPath: "secretApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Secret"],
  endpoints: (builder) => ({
    getSecrets: builder.query<Secret[], void>({
      query: () => "/secrets/all",
      transformResponse: (response: { data: Secret[] }) => response.data,
      providesTags: ["Secret"],
    }),
    addSecret: builder.mutation<Secret, Partial<Secret>>({
      query: (body) => ({
        url: "/secrets/save",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Secret"],
    }),
    updateSecret: builder.mutation<Secret, { id: string; body: Partial<Secret> }>({
      query: ({ id, body }) => ({
        url: `/secrets/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Secret"],
    }),
    removeSecret: builder.mutation<void, string>({
      query: (id) => ({
        url: `/secrets/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Secret"],
    }),
  }),
});

export const { useGetSecretsQuery, useAddSecretMutation, useUpdateSecretMutation, useRemoveSecretMutation } = secretApi;
