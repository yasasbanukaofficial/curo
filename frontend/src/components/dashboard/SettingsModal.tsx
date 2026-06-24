import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Sun, Moon, Check, CreditCard, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { GitHubIcon } from "../ui/Icons";
import DashboardButton from "./DashboardButton";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

type SettingsTab = "general" | "billing";

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState<SettingsTab>("general");

  if (!open) return null;

  const navItems: { label: string; value: SettingsTab; icon: typeof SettingsIcon }[] = [
    { label: "General", value: "general", icon: SettingsIcon },
    { label: "Billing", value: "billing", icon: CreditCard },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl h-[600px] bg-white dark:bg-[#111] rounded-2xl border border-black/[0.04] dark:border-[#222] shadow-xl flex overflow-hidden transition-all duration-200">
        <DashboardButton onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-[#8E8E93] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
          <X className="w-4 h-4" />
        </DashboardButton>
        <div className="w-48 flex-shrink-0 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 border-r border-black/[0.04] dark:border-[#222] p-3 flex flex-col">
          <div className="px-2 py-3 mb-2">
            <span className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Settings</span>
          </div>
          <div className="space-y-0.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <DashboardButton
                  key={item.value}
                  onClick={() => setTab(item.value)}
                  className={`w-full h-9 px-3 text-sm rounded-lg justify-start ${
                    tab === item.value
                      ? "bg-white dark:bg-[#333] text-[#1D1D1F] dark:text-[#E5E5E5] font-medium shadow-sm"
                      : "text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] hover:bg-white dark:hover:bg-[#333]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </DashboardButton>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === "general" && (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Appearance</h3>
                <div className="space-y-4">
                  <div>
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
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/[0.04] dark:border-[#222] bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-7 w-7 text-[#1D1D1F] dark:text-white flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-full w-full">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <circle cx="12" cy="12" r="2.5" />
                      <path d="M12 14.5v2" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Curo</p>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">Secrets management, simplified.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Version</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">1.0.0</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Status</p>
                    <p className="text-sm text-[#30D158]">All Systems Operational</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Session</p>
                    <p className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">Active</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-0.5">Security</p>
                    <p className="text-sm text-[#30D158]">End-to-End Encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-black/[0.04] dark:border-[#222]">
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] gap-1">Documentation</DashboardButton>
                  <span className="text-[#8E8E93] dark:text-[#666] text-[11px]">·</span>
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] gap-1">Changelog</DashboardButton>
                  <span className="text-[#8E8E93] dark:text-[#666] text-[11px]">·</span>
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5] gap-1">Support</DashboardButton>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] dark:bg-white/10 flex items-center justify-center">
                        <GitHubIcon className="w-5 h-5 text-white dark:text-[#E5E5E5]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">GitHub</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">Connected as yasas</p>
                      </div>
                    </div>
                    <DashboardButton className="h-8 px-3 text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-lg hover:bg-[#FF3B30]/20">Disconnect</DashboardButton>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#007AFF] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Google</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">Not connected</p>
                      </div>
                    </div>
                    <DashboardButton className="h-8 px-3 text-[11px] font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-lg hover:bg-[#eee] dark:hover:bg-[#222]">Connect</DashboardButton>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "billing" && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">Billing & Plan</h3>
                <p className="text-xs text-[#8E8E93] dark:text-[#666]">You are currently on the <span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Team</span> plan.</p>
              </div>

              <div className="rounded-2xl border border-[#1D1D1F] dark:border-white bg-[#1D1D1F] dark:bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-lg font-bold text-white dark:text-[#1D1D1F]">Team</p>
                    <p className="text-sm text-white/70 dark:text-[#1D1D1F]/70 mt-0.5">$29/mo per seat</p>
                  </div>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/20 dark:bg-[#1D1D1F]/20 text-white dark:text-[#1D1D1F]">Current Plan</span>
                </div>
                <ul className="space-y-2.5">
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

              <div className="rounded-2xl border border-black/[0.04] dark:border-[#222] bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Need more?</p>
                    <p className="text-xs text-[#8E8E93] dark:text-[#666] mt-0.5">Upgrade to Enterprise for unlimited team members, SSO, and more.</p>
                  </div>
                  <DashboardButton onClick={() => { onClose(); navigate("/pricing"); }} className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] flex-shrink-0">
                    Upgrade Plan
                  </DashboardButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
