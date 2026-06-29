import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Check, CreditCard, ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import { useTheme } from "./DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import DashboardButton from "../../components/dashboard/DashboardButton";
import Modal from "../../components/dashboard/Modal";
import { useDeleteAccountMutation, clearCredentials } from "../../store";
import { baseApi } from "../../store/baseApi";
import { useAppDispatch } from "../../app/store";
import { useToast } from "../../components/dashboard/Toast";

export default function Settings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { theme, toggle } = useTheme();
  const { error: showError } = useToast();

  const [deleteAccount] = useDeleteAccountMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount().unwrap();
      dispatch(clearCredentials());
      dispatch(baseApi.util.resetApiState());
      navigate("/login");
    } catch (err: any) {
      showError(err?.data?.msg || "Failed to delete account");
      setDeleting(false);
    }
  };

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

        <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
          <h3 className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5] mb-3">Danger Zone</h3>
          <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4">
            <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5]">Delete Account</p>
              <p className="text-[11px] text-[#8E8E93] dark:text-[#666] mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
          </div>
          <DashboardButton onClick={() => setShowDeleteModal(true)} className="w-full h-9 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90">
            <Trash2 className="w-4 h-4" />Delete Account
          </DashboardButton>
        </DashboardCard>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setConfirmText(""); setDeleting(false); }}
        title="Delete Account"
        footer={
          <div className="flex items-center justify-end gap-3">
            <DashboardButton
              onClick={() => { setShowDeleteModal(false); setConfirmText(""); setDeleting(false); }}
              className="h-9 px-4 text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
            >
              Cancel
            </DashboardButton>
            <DashboardButton
              onClick={handleDeleteAccount}
              disabled={confirmText !== "DELETE" || deleting}
              className="h-9 px-4 text-sm font-medium text-white bg-[#FF3B30] rounded-[10px] hover:bg-[#FF3B30]/90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting ? "Deleting..." : "Delete Account"}
            </DashboardButton>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-[#FF3B30] flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#1D1D1F] dark:text-[#E5E5E5] space-y-1">
              <p>This will permanently delete your account.</p>
              <p>Teams you own — including all their projects, secrets, and environments — will also be deleted. This cannot be undone.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1D1D1F] dark:text-[#E5E5E5] mb-1.5">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-10 px-3 text-sm rounded-xl border border-black/[0.08] dark:border-[#333] bg-white dark:bg-[#1A1A1A] text-[#1D1D1F] dark:text-[#E5E5E5] placeholder:text-[#8E8E93] outline-none focus:border-[#FF3B30] focus:ring-1 focus:ring-[#FF3B30]/30 transition-colors duration-200"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
