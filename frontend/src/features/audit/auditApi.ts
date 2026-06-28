import { baseApi } from "../../api/baseApi";
import type { Audit } from "../../types/audit";

export const auditApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAudits: builder.query<Audit[], void>({
      query: () => "/audits/all",
      transformResponse: (response: { data: Audit[] }) => response.data,
      providesTags: ["Audit"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAuditsQuery,
} = auditApi;
