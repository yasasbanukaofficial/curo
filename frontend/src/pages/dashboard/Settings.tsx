import { useNavigate } from "react-router-dom";
import { Sun, Moon, Check, CreditCard, ArrowLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 pb-24 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6">
        <DashboardButton onClick={() => navigate("/dashboard")} className="p-2 rounded-[10px] text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Settings</h1>
      </div>

      <div className="space-y-6">
        <DashboardCard>
          <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Appearance</h3>
          <p className="text-xs font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-2">Theme</p>
          <div className="flex items-center gap-2">
            <DashboardButton
              onClick={theme === "dark" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-[10px] font-medium ${
                theme === "light"
                  ? "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] shadow-sm"
                  : "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </DashboardButton>
            <DashboardButton
              onClick={theme === "light" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-[10px] font-medium ${
                theme === "dark"
                  ? "bg-[#1D1D1F] dark:bg-white text-white dark:text-[#1D1D1F] shadow-sm"
                  : "bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </DashboardButton>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">Billing & Plan</h3>
          <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">You are currently on the <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Team</span> plan.</p>

          <div className="rounded-2xl border border-[#1D1D1F] dark:border-white bg-[#1D1D1F] dark:bg-white p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-bold text-white dark:text-[#1D1D1F]">Team</p>
                <p className="text-sm text-white/70 dark:text-[#1D1D1F]/70 mt-0.5">$29/mo per seat</p>
              </div>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/20 dark:bg-[#1D1D1F]/20 text-white dark:text-[#1D1D1F]">Current Plan</span>
            </div>
            <ul className="space-y-2">
              {[
                "Unlimited projects",
                "Unlimited secrets",
                "Up to 25 team members",
                "Advanced audit logs",
                "Environment sync",
                "Priority email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80 dark:text-[#1D1D1F]/80">
                  <Check className="w-4 h-4 text-white dark:text-[#1D1D1F] flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <DashboardButton onClick={() => navigate("/pricing")} className="w-full h-9 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]">
            <CreditCard className="w-4 h-4" />
            Upgrade Plan
          </DashboardButton>
        </DashboardCard>
      </div>
    </div>
  );
}
