import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectIsEmailVerified } from "../../features/auth/authSlice";

export default function VerifiedLayout() {
  const navigate = useNavigate();
  const isEmailVerified = useAppSelector(selectIsEmailVerified);

  useEffect(() => {
    if (!isEmailVerified) {
      navigate("/verify-email", { replace: true });
    }
  }, [isEmailVerified, navigate]);

  if (!isEmailVerified) return null;

  return <Outlet />;
}
