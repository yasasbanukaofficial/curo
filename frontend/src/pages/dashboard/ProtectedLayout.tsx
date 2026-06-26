import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { useVerifySessionQuery } from "../../features/auth/authApi";
import { setAuthenticated } from "../../features/auth/authSlice";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";

export default function ProtectedLayout() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useVerifySessionQuery();

  useEffect(() => {
    if (data?.data) {
      dispatch(setAuthenticated({ user: data.data as any }));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (isError) return <Navigate to="/login" replace />;

  return <Outlet />;
}
