import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout } from "../features/auth/authSlice";

const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({ baseUrl: API_URL, credentials: "include" });

let refreshPromise: Promise<any> | null = null;

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  const isRefreshRequest = typeof args === "string" 
    ? args.includes("/auth/refresh")
    : args.url?.includes("/auth/refresh");

  if (result.error && result.error.status === 401 && !isRefreshRequest) {
    if (!refreshPromise) {
      refreshPromise = baseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );
    }

    const refreshResult = await refreshPromise;
    
    // Only nullify if we are the ones that resolved it, or just always nullify here.
    // If multiple waiting, the first one passing this point will nullify it.
    if (refreshPromise) {
        refreshPromise = null;
    }

    if (refreshResult.data) {
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      
      const guestPaths = ["/login", "/register", "/forgot-password", "/verify-email", "/reset-password"];
      const currentPath = window.location.pathname;
      if (!guestPaths.some((p) => currentPath.startsWith(p))) {
        window.location.replace("/login");
      }
    }
  }

  return result;
};
