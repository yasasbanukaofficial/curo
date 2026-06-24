import { useState } from "react";
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
import { ProviderBadge } from "../../components/dashboard/Badges";

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
  _id: "usr_abc123",
  name: "Yasas",
  email: "yasas@example.com",
  provider: ["local", "github"],
  googleId: undefined,
  githubId: "gh_yasas",
  createdAt: "2025-09-15T08:30:00.000Z",
  updatedAt: "2026-06-20T14:22:00.000Z",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Settings() {
  const [profile] = useState<UserProfile>(MOCK_USER);

  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const [connectedAccounts] = useState({
    google: { connected: !!profile.googleId, email: "yasas@gmail.com" },
    github: { connected: !!profile.githubId, username: "yasas" },
  });

  function handleSaveProfile() {
    setSaving(true);
    setSaveSuccess(false);
    setNameError("");
    setEmailError("");
  }

  function handleCancelEdit() {
    setEditMode(false);
    setEditName(profile.name);
    setEditEmail(profile.email);
    setNameError("");
    setEmailError("");
  }

  function handleOpenPasswordModal() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setPasswordSuccess(false);
    setShowPasswordModal(true);
  }

  function handleChangePassword() {
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess(false);
  }

  function handleClosePasswordModal() {
    setShowPasswordModal(false);
    setChangingPassword(false);
    setPasswordError("");
    setPasswordSuccess(false);
  }

  function handleDeleteAccount() {
    setDeleteConfirm("");
    setShowDeleteModal(false);
  }

  function handleConnectGoogle() {}
  function handleDisconnectGoogle() {}
  function handleConnectGithub() {}
  function handleDisconnectGithub() {}

  return (
    <div className="flex-1 flex flex-col min-w-0 p-4 md:p-6 xl:p-8 pb-8 overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0A] transition-colors duration-200">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">Settings</h1>
        <p className="text-sm text-[#8E8E93] dark:text-[#666] mt-0.5">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
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
                  value={editName}
                  onChange={setEditName}
                  placeholder="Your name"
                  error={nameError}
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
                  value={editEmail}
                  onChange={setEditEmail}
                  placeholder="you@example.com"
                  error={emailError}
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

          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-black/[0.04] dark:border-[#222]">
            {editMode ? (
              <>
                <DashboardButton
                  onClick={handleSaveProfile}
                  className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Save Changes
                </DashboardButton>
                <DashboardButton
                  onClick={handleCancelEdit}
                  className="h-9 px-4 text-sm font-medium text-[#8E8E93] dark:text-[#666] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:text-[#1D1D1F] dark:hover:text-[#E5E5E5]"
                >
                  Cancel
                </DashboardButton>
              </>
            ) : (
              <DashboardButton
                onClick={() => setEditMode(true)}
                className="h-9 px-4 text-sm font-medium text-white bg-[#1D1D1F] dark:bg-white dark:text-[#1D1D1F] rounded-xl hover:bg-[#1D1D1F]/90 dark:hover:bg-[#E5E5E5]"
              >
                Edit Profile
              </DashboardButton>
            )}

            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-[11px] text-[#30D158] font-medium ml-2">
                <CheckCircle className="w-3.5 h-3.5" />
                Saved successfully
              </span>
            )}
          </div>
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
              className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-xl hover:bg-[#eee] dark:hover:bg-[#222]"
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
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">
                  Delete Account
                </p>
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
              className="h-9 px-4 text-sm font-medium text-white bg-[#FF3B30] rounded-xl hover:bg-[#FF3B30]/90"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </DashboardButton>
          </div>
        </DashboardCard>
      </div>

      <Modal
        open={showPasswordModal}
        onClose={handleClosePasswordModal}
        onSubmit={handleChangePassword}
        title="Change Password"
        description="Enter your current password and choose a new one."
        submitLabel="Update Password"
        submitDisabled={!currentPassword || !newPassword || !confirmPassword || changingPassword}
        loading={changingPassword}
      >
        <div className="space-y-4">
          <FormField
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <FormField
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="Enter new password (min. 8 characters)"
            value={newPassword}
            onChange={setNewPassword}
          />
          <FormField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
        </div>

        {passwordError && (
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#FF3B30] font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="flex items-center gap-1.5 mt-4 text-[11px] text-[#30D158] font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Password updated successfully
          </div>
        )}
      </Modal>

      <Modal
        open={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteConfirm("");
        }}
        title="Delete Account"
        description="This action is permanent and cannot be undone."
        submitLabel="Permanently Delete"
        submitDisabled={deleteConfirm !== "delete"}
        onSubmit={handleDeleteAccount}
        className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20"
        bodyClassName="space-y-4"
      >
        <div className="p-3 bg-[#FF3B30]/5 rounded-xl">
          <p className="text-[11px] text-[#8E8E93] dark:text-[#666] leading-relaxed">
            All your data will be permanently deleted, including projects, secrets, environments,
            integrations, and audit logs. Your account cannot be recovered.
          </p>
        </div>

        <FormField
          label={'Type "delete" to confirm'}
          name="deleteConfirm"
          placeholder='Type "delete" to confirm'
          value={deleteConfirm}
          onChange={setDeleteConfirm}
        />
      </Modal>
    </div>
  );
}
