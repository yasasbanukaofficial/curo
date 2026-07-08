import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Settings as SettingsIcon, UserCircle,
  User, Mail, Calendar, KeyRound, Trash2, AlertTriangle, Send,
} from "lucide-react";
import DashboardButton from "./DashboardButton";
import AlertModal from "./AlertModal";
import { useToast } from "./Toast";
import LoadingSpinner from "./LoadingSpinner";
import type { SettingsTab } from "../../types/settings";
import {
  useVerifySessionQuery,
  useUpdateProfileMutation,
  useSendPasswordResetLinkMutation,
  useDisconnectOAuthMutation,
  useDeleteAccountMutation,
  clearCredentials,
  setCredentials,
  baseApi,
} from "../../store";
import { useAppDispatch } from "../../app/store";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  initialTab?: SettingsTab;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SettingsModal({ open, onClose, initialTab = "general" }: SettingsModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { data: userData } = useVerifySessionQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [sendPasswordResetLink, { isLoading: isSendingReset }] = useSendPasswordResetLinkMutation();
  const [disconnectOAuth] = useDisconnectOAuthMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const user = (userData as any) ?? null;
  const [tab, setTab] = useState<SettingsTab>(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [open, initialTab]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const connectedAccounts = useMemo(() => ({
    google: { connected: user?.provider.includes("google") ?? false },
  }), [user?.provider]);

  function handleStartEdit() {
    setProfileName(user?.name || "");
    setIsEditingProfile(true);
  }

  function handleCancelEdit() {
    setIsEditingProfile(false);
    setProfileName("");
  }

  async function handleSaveProfile() {
    if (!profileName.trim()) return;
    setIsSavingProfile(true);
    try {
      const updatedUser = await updateProfile({ name: profileName.trim() }).unwrap();
      dispatch(setCredentials({ user: updatedUser }));
      setIsEditingProfile(false);
      toast.success("Profile saved", "Your profile has been updated successfully.");
    } catch (err: any) {
      toast.error(err?.data?.msg || "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  }

  function handleOpenPasswordReset() {
    setShowPasswordReset(true);
  }

  function handleCancelPasswordReset() {
    setShowPasswordReset(false);
  }

  async function handleSendResetLink() {
    try {
      await sendPasswordResetLink().unwrap();
      setShowPasswordReset(false);
      toast.success("Reset link sent", "Check your email for the password reset link.");
    } catch (err: any) {
      toast.error(err?.data?.msg || "Failed to send reset link");
    }
  }

  async function handleDeleteAccount() {
    try {
      await deleteAccount().unwrap();
      setShowDeleteModal(false);
      onClose();
      dispatch(baseApi.util.resetApiState());
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    } catch {
      setShowDeleteModal(false);
      toast.error("Failed to delete account. Please try again.");
    }
  }

  if (!open) return null;

  const navItems: { label: string; value: SettingsTab; icon: typeof SettingsIcon }[] = [
    { label: "General", value: "general", icon: SettingsIcon },
    { label: "Account", value: "account", icon: UserCircle },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl h-[600px] bg-white dark:bg-[#111] rounded-2xl border border-black/[0.04] dark:border-[#222] shadow-xl flex overflow-hidden transition-all duration-200">
        <DashboardButton onClick={onClose} className="absolute top-3 right-3 z-10 p-1.5 rounded-lg text-[#8E8E93] hover:text-accent hover:bg-[#F5F5F7] dark:hover:bg-[#1A1A1A]">
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
                      ? "bg-white dark:bg-[#333] text-accent font-medium shadow-sm"
                      : "text-[#8E8E93] dark:text-[#666] hover:text-accent hover:bg-white dark:hover:bg-[#333]"
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
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#007AFF] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Google</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">
                          {connectedAccounts.google.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    {connectedAccounts.google.connected ? (
                      <DashboardButton
                        onClick={async () => {
                          try {
                            await disconnectOAuth({ provider: "google" }).unwrap();
                            dispatch(clearCredentials());
                            navigate("/login", { replace: true });
                          } catch (err: any) {
                            toast.error(err?.data?.msg || "Failed to disconnect Google account");
                          }
                        }}
                        className="h-8 px-3 text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-lg hover:bg-[#FF3B30]/20"
                      >Disconnect</DashboardButton>
                    ) : (
                      <DashboardButton
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/connect`}
                        className="h-8 px-3 text-[11px] font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20"
                      >Connect</DashboardButton>
                    )}
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
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-accent gap-1">Documentation</DashboardButton>
                  <span className="text-[#8E8E93] dark:text-[#666] text-[11px]">·</span>
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-accent gap-1">Changelog</DashboardButton>
                  <span className="text-[#8E8E93] dark:text-[#666] text-[11px]">·</span>
                  <DashboardButton className="text-[11px] font-medium text-[#8E8E93] dark:text-[#666] hover:text-accent gap-1">Support</DashboardButton>
                </div>
              </div>
            </div>
          )}

          {tab === "account" && (
            <div className="p-6 space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-1">Profile Information</h3>
                <p className="text-xs text-[#8E8E93] dark:text-[#666] mb-4">Your name and email address are visible to other members of your organization.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Name</label>
                    {isEditingProfile ? (
                      <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl border border-black/[0.06] dark:border-white/10">
                        <User className="w-4 h-4 text-[#8E8E93] shrink-0" />
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="flex-1 bg-transparent text-sm text-[#1D1D1F] dark:text-[#E5E5E5] outline-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">
                        <User className="w-4 h-4 text-[#8E8E93]" />
                        <span>{user?.name || ""}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Email</label>
                    <div className="flex items-center gap-3 text-sm text-[#8E8E93] dark:text-[#666]">
                      <Mail className="w-4 h-4 text-[#8E8E93]" />
                      <span>{user?.email || ""}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Member Since</label>
                    <div className="flex items-center gap-3 text-sm text-[#8E8E93] dark:text-[#666]">
                      <Calendar className="w-4 h-4 text-[#8E8E93]" />
                      <span>{user?.createdAt ? formatDate(user.createdAt) : ""}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">Providers</label>
                    <div className="flex items-center gap-2 h-10 px-3">
                      {(user?.provider || []).map((p: string) => (
                        <span key={p} className="text-[10px] font-medium px-2 py-0.5 rounded-md capitalize bg-[#F5F5F7] dark:bg-[#1A1A1A] text-[#8E8E93]">{p}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                  {isEditingProfile ? (
                    <>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSavingProfile || !profileName.trim()}
                        className="font-button cursor-pointer transition-all text-center inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium text-white bg-accent rounded-[10px] hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSavingProfile ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="font-button cursor-pointer transition-all text-center inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-[10px] hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartEdit}
                      className="font-button cursor-pointer transition-all text-center inline-flex items-center justify-center gap-2 h-9 px-4 text-sm font-medium text-white bg-accent rounded-[10px] hover:bg-accent/90"
                      >
                        Edit Profile
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Connected Accounts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#007AFF] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Google</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">
                          {connectedAccounts.google.connected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>
                    {connectedAccounts.google.connected ? (
                      <DashboardButton
                        onClick={async () => {
                          try {
                            await disconnectOAuth({ provider: "google" }).unwrap();
                            dispatch(clearCredentials());
                            navigate("/login", { replace: true });
                          } catch (err: any) {
                            toast.error(err?.data?.msg || "Failed to disconnect Google account");
                          }
                        }}
                        className="h-8 px-3 text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-lg hover:bg-[#FF3B30]/20"
                      >Disconnect</DashboardButton>
                    ) : (
                      <DashboardButton
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/connect`}
                        className="h-8 px-3 text-[11px] font-medium text-accent bg-accent/10 rounded-lg hover:bg-accent/20"
                      >Connect</DashboardButton>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-4">Change Password</h3>
                {showPasswordReset ? (
                  <div className="p-5 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl space-y-4">
                    <div className="flex items-start gap-3">
                      <KeyRound className="w-5 h-5 text-[#8E8E93] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Reset via email</p>
                        <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">
                          To protect your account, we'll send a secure password reset link to your registered email address (<span className="font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">{user?.email}</span>).
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <DashboardButton
                        onClick={handleSendResetLink}
                        disabled={isSendingReset}
                        className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-[10px] hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSendingReset ? <LoadingSpinner size={16} /> : <Send className="w-4 h-4" />}
                        Send Reset Link
                      </DashboardButton>
                      <DashboardButton
                        onClick={handleCancelPasswordReset}
                        className="h-9 px-4 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-[10px] hover:bg-gray-200 dark:hover:bg-white/[0.08]"
                      >
                        Cancel
                      </DashboardButton>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <KeyRound className="w-5 h-5 text-[#8E8E93] flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Password</p>
                          <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">Choose a strong, unique password with at least 8 characters.</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <DashboardButton onClick={handleOpenPasswordReset} className="h-9 px-4 text-sm font-medium text-accent bg-accent/10 rounded-[10px] hover:bg-accent/20">
                        <KeyRound className="w-4 h-4" />
                        Change Password
                      </DashboardButton>
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-[#FF3B30]/20 dark:border-[#FF3B30]/20 p-5">
                <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Danger Zone</h3>
                <div className="flex items-start gap-3 p-4 bg-[#FF3B30]/5 rounded-xl mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Account</p>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">Permanently remove your account and all associated data. This action cannot be undone.</p>
                  </div>
                </div>
                <DashboardButton onClick={() => setShowDeleteModal(true)} className="h-9 px-4 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </DashboardButton>
              </div>
            </div>
          )}

        </div>
      </div>

      <AlertModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        variant="warning"
        title="Delete Account"
        message="All your data will be permanently deleted, including projects, secrets, environments, and integrations. Your account cannot be recovered."
        buttons={[
          { label: "Cancel", onClick: () => setShowDeleteModal(false), variant: "secondary" },
          { label: "Delete Account", onClick: handleDeleteAccount, variant: "destructive" },
        ]}
      />
    </div>
  );
}
