import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "./baseQuery"

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Team",
    "TeamMembers",
    "TeamInvite",
    "Project",
    "Environment",
    "Secret",

    "Audit",
  ],
  endpoints: () => ({}),
})
