import { baseApi } from "../baseApi";
import type { Audit } from "../../types";

export const auditEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuditLogs: builder.query<Audit[], void>({
      query: () => ({ url: "/audits/all", method: "GET" }),
      providesTags: (result) =>
        result
          ? [{ type: "AuditLog", id: "LIST" }, ...result.map((a) => ({ type: "AuditLog" as const, id: a._id }))]
          : [{ type: "AuditLog", id: "LIST" }],
    }),
  }),
});

export const { useGetAuditLogsQuery } = auditEndpoints;
