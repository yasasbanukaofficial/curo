import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Version } from "../../types/version";

export const versionApi = createApi({
  reducerPath: "versionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Version"],
  endpoints: (builder) => ({
    getVersions: builder.query<Version[], string>({
      query: (secretId) => `/version/all/${secretId}`,
      transformResponse: (response: { data: Version[] }) => response.data,
      providesTags: ["Version"],
    }),
    addVersion: builder.mutation<Version, { secretId: string; secKey: string }>({
      query: (body) => ({
        url: "/version/save",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Version"],
    }),
  }),
});

export const {
  useGetVersionsQuery,
  useAddVersionMutation,
} = versionApi;
