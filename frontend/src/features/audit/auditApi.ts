import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../../api/baseQuery";
import type { Audit } from "../../types/audit";

export const auditApi = createApi({
  reducerPath: "auditApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Audit"],
  endpoints: (builder) => ({
    getAudits: builder.query<Audit[], void>({
      query: () => "/audits/all",
      transformResponse: (response: { data: Audit[] }) => response.data,
      providesTags: ["Audit"],
    }),
  }),
});

export const {
  useGetAuditsQuery,
} = auditApi;
