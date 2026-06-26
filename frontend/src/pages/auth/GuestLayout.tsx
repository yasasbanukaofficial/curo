import { Outlet, useNavigate } from "react-router-dom";
import { useVerifySessionQuery } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setAuthenticated } from "../../features/auth/authSlice";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import { useEffect } from "react";

export default function GuestLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useVerifySessionQuery();

  useEffect(() => {
    if (data) {
      dispatch(setAuthenticated({ user: data.data as any }));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (!isError && data) {
      navigate("/dashboard", { replace: true });
    }
  }, [data, isError, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (!isError && data) return null;

  return <Outlet />;
}
