import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/store";

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!token) return;

    sessionStorage.setItem("inviteToken", token);

    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/register", { replace: true });
    }
  }, [token, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <p className="text-[#8E8E93]">Processing your invitation...</p>
    </div>
  );
}
