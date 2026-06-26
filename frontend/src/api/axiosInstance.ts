import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const guestPaths = ["/login", "/register", "/forgot-password", "/verify-email", "/reset-password"];

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export function setupInterceptors(dispatch: (action: unknown) => void) {
  axiosInstance.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (err.response?.status === 401) {
        const { logout } = await import("../features/auth/authSlice");
        dispatch(logout());
        const currentPath = window.location.pathname;
        if (!guestPaths.some((p) => currentPath.startsWith(p))) {
          window.location.replace("/login");
        }
      }
      return Promise.reject(err);
    },
  );
}

export default axiosInstance;
