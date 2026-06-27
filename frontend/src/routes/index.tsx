import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GuestLayout from "../pages/auth/GuestLayout";
import ProtectedLayout from "../pages/dashboard/ProtectedLayout";
import VerifiedLayout from "../pages/dashboard/VerifiedLayout";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Overview from "../pages/dashboard/Overview";
import Projects from "../pages/dashboard/Projects";
import Secrets from "../pages/dashboard/Secrets";
import Environments from "../pages/dashboard/Environments";
import Integrations from "../pages/dashboard/Integrations";
import AuditLogs from "../pages/dashboard/AuditLogs";
import Account from "../pages/dashboard/Account";
import Settings from "../pages/dashboard/Settings";
import Teams from "../pages/dashboard/Teams";
import Versioning from "../pages/dashboard/Versioning";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import PricingPage from "../pages/PricingPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<ProtectedLayout />}>
        <Route element={<VerifiedLayout />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="secrets" element={<Secrets />} />
            <Route path="environments" element={<Environments />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="audits" element={<AuditLogs />} />
            <Route path="teams" element={<Teams />} />
            <Route path="versions" element={<Versioning />} />
            <Route path="account" element={<Account />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
