import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Version } from "../../types/version";

export const versionApi = createApi({
  reducerPath: "versionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Version", "Secret"],
  endpoints: (builder) => ({
    getVersions: builder.query<Version[], string>({
      query: (secretId) => `/version/all/${secretId}`,
      transformResponse: (response: { data: Version[] }) => response.data,
      providesTags: (result, error, secretId) => [{ type: "Version", id: secretId }],
    }),
    addVersion: builder.mutation<Version, { secretId: string; secKey: string }>({
      query: (body) => ({
        url: "/version/save",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Version", id: arg.secretId },
        { type: "Secret", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetVersionsQuery,
  useAddVersionMutation,
} = versionApi;
