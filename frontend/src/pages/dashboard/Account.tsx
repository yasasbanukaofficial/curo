import { useState } from "react";
import { useFormik } from "formik";
import {
  User,
  Mail,
  Calendar,
  KeyRound,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { GitHubIcon } from "../../components/ui/Icons";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import SectionHeader from "../../components/dashboard/SectionHeader";
import FormInput from "../../components/dashboard/FormInput";
import FormField from "../../components/dashboard/FormField";
import Modal from "../../components/dashboard/Modal";
import AlertModal from "../../components/dashboard/AlertModal";
import { ProviderBadge } from "../../components/dashboard/Badges";
import { useToast } from "../../components/dashboard/Toast";
import {
  settingsProfileSchema,
  changePasswordSchema,
  validateZod,
} from "../../types/settings";
import type {
  SettingsProfileValues,
  ChangePasswordValues,
} from "../../types/settings";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  provider: string[];
  googleId?: string;
  githubId?: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_USER: UserProfile = {
  _id: "",
  name: "",
  email: "",
  provider: [],
  googleId: undefined,
  githubId: undefined,
  createdAt: "",
  updatedAt: "",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Account() {
  const toast = useToast();
  const [profile] = useState<UserProfile>(MOCK_USER);
  const [editMode, setEditMode] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [connectedAccounts] = useState({
    google: { connected: !!profile.googleId, email: "" },
    github: { connected: !!profile.githubId, username: "" },
  });

  const profileFormik = useFormik<SettingsProfileValues>({
    initialValues: { name: profile.name, email: profile.email },
    validate: validateZod(settingsProfileSchema),
    onSubmit: (_values, { setSubmitting }) => {
      setTimeout(() => {
        setSubmitting(false);
        setEditMode(false);
        toast.success("Profile saved", "Your profile has been updated successfully.");
      }, 1000);
    },
  });

  const passwordFormik = useFormik<ChangePasswordValues>({
    initialValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    validate: validateZod(changePasswordSchema),
    onSubmit: (_values, { setSubmitting, resetForm }) => {
      setTimeout(() => {
        setSubmitting(false);
        setShowPasswordModal(false);
        resetForm();
        toast.success("Password updated", "Your password has been changed successfully.");
      }, 1000);
    },
  });

  function handleCancelEdit() {
    setEditMode(false);
    profileFormik.resetForm({ values: { name: profile.name, email: profile.email } });
  }

  function handleOpenPasswordModal() {
    passwordFormik.resetForm();
    setShowPasswordModal(true);
  }

  function handleDeleteAccount() {
    setShowDeleteModal(false);
  }

  function handleConnectGoogle() {}
  function handleDisconnectGoogle() {}
  function handleConnectGithub() {}
  function handleDisconnectGithub() {}

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
                    <span>{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Email
                </label>
                {editMode ? (
                  <FormInput
                    type="email"
                    value={profileFormik.values.email}
                    onChange={(v) => profileFormik.setFieldValue("email", v)}
                    onBlur={profileFormik.handleBlur}
                    placeholder="you@example.com"
                    error={profileFormik.touched.email && profileFormik.errors.email ? profileFormik.errors.email : undefined}
                    icon={<Mail className="w-4 h-4 text-[#8E8E93]" />}
                  />
                ) : (
                  <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#1D1D1F] dark:text-[#E5E5E5]">
                    <Mail className="w-4 h-4 text-[#8E8E93]" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Member Since
                </label>
                <div className="flex items-center gap-3 h-10 px-3 bg-[#F5F5F7]/50 dark:bg-[#1A1A1A]/50 rounded-xl text-sm text-[#8E8E93] dark:text-[#666]">
                  <Calendar className="w-4 h-4 text-[#8E8E93]" />
                  <span>{formatDate(profile.createdAt)}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#8E8E93] dark:text-[#666] tracking-wide mb-1.5">
                  Providers
                </label>
                <div className="flex items-center gap-2 h-10 px-3">
                  {profile.provider.map((p) => (
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
                      disabled={profileFormik.isSubmitting}
                      className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-[10px] hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {profileFormik.isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Save Changes
                    </DashboardButton>
                    <DashboardButton
                      onClick={handleCancelEdit}
                      className="h-9 px-4 text-sm font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
                    >
                      Cancel
                    </DashboardButton>
                  </>
                ) : (
                  <DashboardButton
                    onClick={() => setEditMode(true)}
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
                        ? `Connected as ${connectedAccounts.github.username}`
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
                    onClick={handleConnectGithub}
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
                        ? `Connected as ${connectedAccounts.google.email}`
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
                    onClick={handleConnectGoogle}
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
                onClick={handleOpenPasswordModal}
                className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
              >
                <KeyRound className="w-4 h-4" />
                Change Password
              </DashboardButton>
            </div>
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

      <Modal
        open={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); passwordFormik.resetForm(); }}
        title="Change Password"
        description="Enter your current password and choose a new one."
        submitLabel="Update Password"
        submitDisabled={passwordFormik.isSubmitting}
        loading={passwordFormik.isSubmitting}
        onSubmit={() => passwordFormik.handleSubmit()}
      >
        <div className="space-y-4">
          <FormField
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={passwordFormik.values.currentPassword}
            onChange={(v) => passwordFormik.setFieldValue("currentPassword", v)}
            onBlur={passwordFormik.handleBlur}
            error={passwordFormik.touched.currentPassword ? passwordFormik.errors.currentPassword : undefined}
            touched={!!passwordFormik.touched.currentPassword}
          />
          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password (min. 8 characters)"
            value={passwordFormik.values.newPassword}
            onChange={(v) => passwordFormik.setFieldValue("newPassword", v)}
            onBlur={passwordFormik.handleBlur}
            error={passwordFormik.touched.newPassword ? passwordFormik.errors.newPassword : undefined}
            touched={!!passwordFormik.touched.newPassword}
          />
          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={passwordFormik.values.confirmPassword}
            onChange={(v) => passwordFormik.setFieldValue("confirmPassword", v)}
            onBlur={passwordFormik.handleBlur}
            error={passwordFormik.touched.confirmPassword ? passwordFormik.errors.confirmPassword : undefined}
            touched={!!passwordFormik.touched.confirmPassword}
          />
        </div>

        {passwordFormik.errors.confirmPassword && passwordFormik.touched.confirmPassword && (
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#FF3B30] font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {passwordFormik.errors.confirmPassword}
          </div>
        )}


      </Modal>

      <AlertModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        variant="warning"
        title="Delete Account"
        message="All your data will be permanently deleted, including projects, secrets, environments, integrations, and audit logs. Your account cannot be recovered."
        buttons={[
          { label: "Cancel", onClick: () => setShowDeleteModal(false), variant: "secondary" },
          { label: "Delete Account", onClick: handleDeleteAccount, variant: "destructive" },
        ]}
      />
    </div>
  );
}
