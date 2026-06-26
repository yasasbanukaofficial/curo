import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Secret } from "../../types/secret";

const API_URL = import.meta.env.VITE_API_URL;

export const secretApi = createApi({
  reducerPath: "secretApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL, credentials: "include" }),
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
