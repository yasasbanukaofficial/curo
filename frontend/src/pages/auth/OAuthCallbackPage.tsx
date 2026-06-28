import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosClient";
import { useAppDispatch } from "../../app/store";
import { setCredentials } from "../../store/slices/authSlice";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    async function handleCallback() {
      if (error) {
        navigate("/login", { replace: true });
        return;
      }

      function redirectAfterAuth() {
        navigate("/dashboard", { replace: true });
      }

      if (token) {
        try {
          const response = await apiClient.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          dispatch(setCredentials({ user: response.data.data }));
          redirectAfterAuth();
        } catch {
          navigate("/login", { replace: true });
        }
      } else {
        try {
          const response = await apiClient.get("/auth/me");
          dispatch(setCredentials({ user: response.data.data }));
          redirectAfterAuth();
        } catch {
          navigate("/login", { replace: true });
        }
      }
    }

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <p className="text-[#8E8E93]">Completing authentication...</p>
    </div>
  );
}
