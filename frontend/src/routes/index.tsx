import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage";
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
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import PricingPage from "../pages/PricingPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<Overview />} />
        <Route path="projects" element={<Projects />} />
        <Route path="secrets" element={<Secrets />} />
        <Route path="environments" element={<Environments />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="audits" element={<AuditLogs />} />
        <Route path="teams" element={<Teams />} />
        <Route path="account" element={<Account />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
