import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  User,
  Mail,
  Calendar,
  KeyRound,
  Trash2,
  AlertTriangle,
  Send,
} from "lucide-react";
import { GitHubIcon } from "../../components/ui/Icons";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import SectionHeader from "../../components/dashboard/SectionHeader";
import FormInput from "../../components/dashboard/FormInput";
import AlertModal from "../../components/dashboard/AlertModal";
import { ProviderBadge } from "../../components/dashboard/Badges";
import { useToast } from "../../components/dashboard/Toast";
import {
  settingsProfileSchema,
  validateZod,
} from "../../types/settings";
import type {
  SettingsProfileValues,
} from "../../types/settings";
import {
  useVerifySessionQuery,
  useUpdateProfileMutation,
  useSendPasswordResetLinkMutation,
  useDisconnectOAuthMutation,
  clearCredentials,
  setCredentials,
} from "../../store";
import { useAppDispatch } from "../../app/store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Account() {
  const toast = useToast();
  const { data: userData, isLoading: sessionLoading } = useVerifySessionQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [sendPasswordResetLink, { isLoading: isSendingReset }] = useSendPasswordResetLinkMutation();
  const [disconnectOAuth] = useDisconnectOAuthMutation();

  const user = userData as {
    id: string;
    name: string;
    email: string;
    provider: string[];
    googleId?: string;
    githubId?: string;
    emailVerified: boolean;
    onboardingComplete: boolean;
    createdAt: string;
  } | undefined;

  const [editMode, setEditMode] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const connectedAccounts = useMemo(() => ({
    google: { connected: user?.provider.includes("google") ?? false },
    github: { connected: user?.provider.includes("github") ?? false },
  }), [user?.provider]);

  const formInitialValues = useMemo(
    () => ({ name: user?.name || "" }),
    [],
  );

  const editStartValuesRef = useRef<SettingsProfileValues>(formInitialValues);

  const profileFormik = useFormik<SettingsProfileValues>({
    initialValues: formInitialValues,
    validate: validateZod(settingsProfileSchema),
    enableReinitialize: false,
    onSubmit: async (values, { setSubmitting }) => {
      if (values.name === (editStartValuesRef.current.name || "")) {
        setEditMode(false);
        setSubmitting(false);
        return;
      }
      try {
        const updatedUser = await updateProfile({ name: values.name }).unwrap();
        dispatch(setCredentials({ user: updatedUser }));
        setEditMode(false);
        toast.success("Profile saved", "Your profile has been updated successfully.");
      } catch (err: any) {
        toast.error(err?.data?.msg || "Failed to update profile");
      } finally {
        setSubmitting(false);
      }
    },
  });

  function handleStartEdit() {
    editStartValuesRef.current = { name: profileFormik.values.name };
    setEditMode(true);
  }

  function handleCancelEdit() {
    setEditMode(false);
    profileFormik.resetForm({ values: { ...editStartValuesRef.current } });
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

  function handleDeleteAccount() {
    setShowDeleteModal(false);
  }

  async function handleDisconnectGoogle() {
    try {
      await disconnectOAuth({ provider: "google" }).unwrap();
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.msg || "Failed to disconnect Google account");
    }
  }
  async function handleDisconnectGithub() {
    try {
      await disconnectOAuth({ provider: "github" }).unwrap();
      dispatch(clearCredentials());
      navigate("/login", { replace: true });
    } catch (err: any) {
      toast.error(err?.data?.msg || "Failed to disconnect GitHub account");
    }
  }

  if (sessionLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Account</h1>
        <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <DashboardCard>
            <SectionHeader
              title="Profile Information"
              description="Your name and email address are visible to other members of your organization."
            />

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Name
                </label>
                {editMode ? (
                  <FormInput
                    value={profileFormik.values.name}
                    onChange={(v) => profileFormik.setFieldValue("name", v)}
                    onBlur={profileFormik.handleBlur}
                    placeholder="Your name"
                    error={profileFormik.touched.name && profileFormik.errors.name ? profileFormik.errors.name : undefined}
                    icon={<User className="w-4 h-4 text-[#8E8E93]" />}
                  />
                ) : (
                  <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">
                    <User className="w-4 h-4 text-[#8E8E93]" />
                    <span>{user?.name || ""}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Email
                </label>
                <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#8E8E93] dark:text-[#666]">
                  <Mail className="w-4 h-4 text-[#8E8E93]" />
                  <span>{user?.email || ""}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Member Since
                </label>
                <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#8E8E93] dark:text-[#666]">
                  <Calendar className="w-4 h-4 text-[#8E8E93]" />
                  <span>{user?.createdAt ? formatDate(user.createdAt) : ""}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Providers
                </label>
                <div className="flex items-center gap-2 h-10 px-3">
                  {(user?.provider || []).map((p) => (
                    <ProviderBadge key={p} label={p} />
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={profileFormik.handleSubmit} noValidate>
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
                {editMode ? (
                  <>
                    <DashboardButton
                      type="submit"
                      disabled={profileFormik.isSubmitting || isUpdating}
                      className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileFormik.isSubmitting || isUpdating ? (
                        <LoadingSpinner size={16} />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      Save Changes
                    </DashboardButton>
                    <DashboardButton
                      type="button"
                      onClick={handleCancelEdit}
                      className="h-9 px-4 text-sm font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
                    >
                      Cancel
                    </DashboardButton>
                  </>
                ) : (
                  <DashboardButton
                    type="button"
                    onClick={handleStartEdit}
                    className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                  >
                    Edit Profile
                  </DashboardButton>
                )}
              </div>
            </form>
          </DashboardCard>

          <DashboardCard>
            <SectionHeader
              title="Connected Accounts"
              description="Link your accounts for seamless sign-in and integration access."
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#1A1A1A] dark:bg-white/10 flex items-center justify-center">
                    <GitHubIcon className="w-5 h-5 text-white dark:text-[#E5E5E5]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">GitHub</p>
                    <p className="text-[11px] text-[#8E8E93] dark:text-[#666]">
                      {connectedAccounts.github.connected
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {connectedAccounts.github.connected ? (
                  <DashboardButton
                    onClick={handleDisconnectGithub}
                    className="h-8 px-3 text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-lg hover:bg-[#FF3B30]/20"
                  >
                    Disconnect
                  </DashboardButton>
                ) : (
                  <DashboardButton
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/connect`}
                    className="h-8 px-3 text-[11px] font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-lg hover:bg-[#eee] dark:hover:bg-[#222]"
                  >
                    Connect
                  </DashboardButton>
                )}
              </div>

              <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 transition-all duration-200">
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
                      {connectedAccounts.google.connected
                        ? "Connected"
                        : "Not connected"}
                    </p>
                  </div>
                </div>
                {connectedAccounts.google.connected ? (
                  <DashboardButton
                    onClick={handleDisconnectGoogle}
                    className="h-8 px-3 text-[11px] font-medium text-[#FF3B30] bg-[#FF3B30]/10 rounded-lg hover:bg-[#FF3B30]/20"
                  >
                    Disconnect
                  </DashboardButton>
                ) : (
                  <DashboardButton
                    onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/connect`}
                    className="h-8 px-3 text-[11px] font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-lg hover:bg-[#eee] dark:hover:bg-[#222]"
                  >
                    Connect
                  </DashboardButton>
                )}
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="flex flex-col gap-6">
          <DashboardCard>
            <SectionHeader
              title="Change Password"
              description="Update your account password regularly to keep your account secure."
            />

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
                    className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingReset ? <LoadingSpinner size={16} /> : <Send className="w-4 h-4" />}
                    Send Reset Link
                  </DashboardButton>
                  <DashboardButton
                    onClick={handleCancelPasswordReset}
                    className="h-9 px-4 text-sm font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
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
                      <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">
                        Choose a strong, unique password with at least 8 characters.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <DashboardButton
                    onClick={handleOpenPasswordReset}
                    className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
                  >
                    <KeyRound className="w-4 h-4" />
                    Change Password
                  </DashboardButton>
                </div>
              </>
            )}
          </DashboardCard>

          <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
            <SectionHeader
              title="Danger Zone"
              description="Irreversible actions that will permanently affect your account."
            />

            <div className="p-4 bg-[#FF3B30]/5 dark:bg-[#FF3B30]/5 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Account</p>
                  <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-1">
                    Permanently remove your account and all associated data. This action cannot be undone.
                    All projects, secrets, environments, and integrations will be deleted.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <DashboardButton
                onClick={() => setShowDeleteModal(true)}
                className="h-9 px-4 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90"
              >
                <Trash2 className="w-4 h-4" />
                Delete Account
              </DashboardButton>
            </div>
          </DashboardCard>
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
