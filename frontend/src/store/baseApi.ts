import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../api/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["User", "Team", "TeamMember", "TeamInvite", "Project", "Secret", "Environment", "Version"],
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: () => ({}),
});
