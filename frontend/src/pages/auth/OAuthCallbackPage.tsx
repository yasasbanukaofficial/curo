import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/axiosClient";
import { useAppDispatch } from "../../app/store";
import { setCredentials } from "../../store/slices/authSlice";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [emailConflict, setEmailConflict] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    async function handleCallback() {
      if (error === "email_conflict") {
        setEmailConflict(searchParams.get("email") || "this email");
        return;
      }

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

  if (emailConflict) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-xl border border-black/[0.04] dark:border-[#222] p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#FF9F0A]/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-[#FF9F0A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h2 className="text-lg font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Account Already Exists</h2>
          </div>
          <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-3 leading-relaxed">
            A user with the email <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{emailConflict}</span> already exists. Try logging in with that account instead.
          </p>
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mt-6 w-full h-10 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] transition-colors"
          >
            Okay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <p className="text-[#8E8E93]">Completing authentication...</p>
    </div>
  );
}
