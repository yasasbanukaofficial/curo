import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store, useAppSelector, useAppDispatch } from "./app/store";
import { useVerifySessionQuery, setCredentials, clearCredentials } from "./store";
import HomePage from "./pages/HomePage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Projects from "./pages/dashboard/Projects";
import TeamSecrets from "./pages/dashboard/TeamSecrets";
import TeamEnvironments from "./pages/dashboard/TeamEnvironments";
import TeamAudit from "./pages/dashboard/TeamAudit";
import Integrations from "./pages/dashboard/Integrations";
import Account from "./pages/dashboard/Account";
import Settings from "./pages/dashboard/Settings";
import Teams from "./pages/dashboard/Teams";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import PricingPage from "./pages/PricingPage";
import InviteAcceptPage from "./pages/InviteAcceptPage";
import InviteExpiredPage from "./pages/InviteExpiredPage";
import NotFoundPage from "./pages/NotFoundPage";
import LoadingSpinner from "./components/dashboard/LoadingSpinner";

function ProtectedRoute() {
  const { data, isLoading, isError } = useVerifySessionQuery();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data && !isLoading) {
      dispatch(setCredentials({ user: data as any }));
    }
  }, [data, isLoading, dispatch]);

  useEffect(() => {
    if (isError && !isLoading) {
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    }
  }, [isError, isLoading, dispatch, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (isError) return null;

  return <Outlet />;
}

function PublicRoute() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useVerifySessionQuery();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated) || !!data;

  useEffect(() => {
    if (data && !isLoading) {
      dispatch(setCredentials({ user: data as any }));
    }
  }, [data, isLoading, dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project/:projectId" element={<Projects />} />
            <Route path="project/:projectId/secrets" element={<Projects />} />
            <Route path="project/:projectId/environments" element={<Projects />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="teams">
              <Route index element={<Teams />} />
              <Route path=":teamId" element={<Teams />} />
              <Route path=":teamId/secrets" element={<TeamSecrets />} />
              <Route path=":teamId/environments" element={<TeamEnvironments />} />
              <Route path=":teamId/audit" element={<TeamAudit />} />
              <Route path=":teamId/settings" element={<Teams />} />
            </Route>
            <Route path="account" element={<Account />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/invite/:token" element={<InviteAcceptPage />} />
        <Route path="/invite/accept/:token" element={<InviteAcceptPage />} />
        <Route path="/invite/expired" element={<InviteExpiredPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
