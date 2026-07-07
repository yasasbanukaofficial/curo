import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  KeyRound,
  Trash2,
  AlertTriangle,
  Send,
  Shield,
  GitBranch,
  Globe,
} from "lucide-react";
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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-4xl"
      >
        <motion.div variants={cardVariants} className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Account</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <SectionHeader
                title="Profile Information"
                description="Your name and email address are visible to other members of your organization."
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Name</label>
                  {editMode ? (
                    <FormInput
                      value={profileFormik.values.name}
                      onChange={(v) => profileFormik.setFieldValue("name", v)}
                      onBlur={profileFormik.handleBlur}
                      placeholder="Your name"
                      error={profileFormik.touched.name && profileFormik.errors.name ? profileFormik.errors.name : undefined}
                      icon={<User className="w-4 h-4 text-gray-500 dark:text-white/40" />}
                    />
                  ) : (
                    <div className="flex items-center gap-3 h-10 px-3 bg-gray-100 dark:bg-white/[0.04] rounded-xl text-sm text-gray-900 dark:text-[#FAFAFA]">
                      <User className="w-4 h-4 text-gray-500 dark:text-white/40" />
                      <span>{user?.name || ""}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Email</label>
                  <div className="flex items-center gap-3 h-10 px-3 bg-gray-100 dark:bg-white/[0.04] rounded-xl text-sm text-gray-500 dark:text-white/40">
                    <Mail className="w-4 h-4 text-gray-500 dark:text-white/40" />
                    <span>{user?.email || ""}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Member Since</label>
                  <div className="flex items-center gap-3 h-10 px-3 bg-gray-100 dark:bg-white/[0.04] rounded-xl text-sm text-gray-500 dark:text-white/40">
                    <Calendar className="w-4 h-4 text-gray-500 dark:text-white/40" />
                    <span>{user?.createdAt ? formatDate(user.createdAt) : ""}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 dark:text-white/40 tracking-wide mb-1.5">Providers</label>
                  <div className="flex items-center gap-2 h-10 px-3">
                    {(user?.provider || []).map((p) => (
                      <ProviderBadge key={p} label={p} />
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={profileFormik.handleSubmit} noValidate>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-200 dark:border-white/[0.06]">
                  {editMode ? (
                    <>
                      <button type="submit" disabled={profileFormik.isSubmitting || isUpdating} className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                        {profileFormik.isSubmitting || isUpdating ? (
                          <LoadingSpinner size={16} />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                      <button type="button" onClick={handleCancelEdit} className="cursor-pointer h-9 px-4 text-sm font-medium text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:text-accent hover:bg-white/[0.08] transition-all duration-200">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={handleStartEdit} className="cursor-pointer h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 inline-flex items-center gap-2">
                      Edit Profile
                    </button>
                  )}
                </div>
              </form>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <SectionHeader
                title="Connected Accounts"
                description="Link your accounts for seamless sign-in and integration access."
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/[0.04] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                      <GitBranch className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">GitHub</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">
                        {connectedAccounts.github.connected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {connectedAccounts.github.connected ? (
                    <button type="button" onClick={handleDisconnectGithub} className="cursor-pointer h-8 px-3 text-[11px] font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-200">
                      Disconnect
                    </button>
                  ) : (
                    <button type="button" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github/connect`} className="cursor-pointer h-8 px-3 text-[11px] font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition-all duration-200">
                      Connect
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-100 dark:bg-white/[0.04] transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Google</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40">
                        {connectedAccounts.google.connected ? "Connected" : "Not connected"}
                      </p>
                    </div>
                  </div>
                  {connectedAccounts.google.connected ? (
                    <button type="button" onClick={handleDisconnectGoogle} className="cursor-pointer h-8 px-3 text-[11px] font-medium text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-200">
                      Disconnect
                    </button>
                  ) : (
                    <button type="button" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/connect`} className="cursor-pointer h-8 px-3 text-[11px] font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-lg hover:bg-white/[0.08] transition-all duration-200">
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-6">
            <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
              <SectionHeader
                title="Change Password"
                description="Update your account password regularly to keep your account secure."
              />

              {showPasswordReset ? (
                <div className="p-4 bg-gray-100 dark:bg-white/[0.04] rounded-xl space-y-4">
                  <div className="flex items-start gap-3">
                    <KeyRound className="w-5 h-5 text-gray-500 dark:text-white/40 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Reset via email</p>
                      <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">
                        To protect your account, we'll send a secure password reset link to your registered email address (<span className="font-medium text-gray-900 dark:text-[#FAFAFA]">{user?.email}</span>).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={handleSendResetLink} disabled={isSendingReset} className="h-9 px-4 text-sm font-medium text-white bg-accent rounded-xl hover:bg-accent/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2">
                      {isSendingReset ? <LoadingSpinner size={16} /> : <Send className="w-4 h-4" />}
                      Send Reset Link
                    </button>
                    <button type="button" onClick={handleCancelPasswordReset} className="cursor-pointer h-9 px-4 text-sm font-medium text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:text-accent hover:bg-white/[0.08] transition-all duration-200">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 bg-gray-100 dark:bg-white/[0.04] rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-500 dark:text-white/40 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Password</p>
                        <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">
                          Choose a strong, unique password with at least 8 characters.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button type="button" onClick={handleOpenPasswordReset} className="cursor-pointer h-9 px-4 text-sm font-medium text-gray-700 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-white/[0.08] transition-all duration-200 inline-flex items-center gap-2">
                      <KeyRound className="w-4 h-4" />
                      Change Password
                    </button>
                  </div>
                </>
              )}
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-red-500/20 p-5">
              <SectionHeader
                title="Danger Zone"
                description="Irreversible actions that will permanently affect your account."
              />

              <div className="p-4 bg-red-500/5 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Delete Account</p>
                    <p className="text-[11px] text-gray-500 dark:text-white/40 mt-1">
                      Permanently remove your account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <button type="button" onClick={() => setShowDeleteModal(true)} className="cursor-pointer h-9 px-4 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-500/90 transition-all duration-200 inline-flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
