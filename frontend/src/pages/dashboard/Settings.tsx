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
        <DashboardButton onClick={() => navigate("/dashboard")} className="p-2 rounded-[10px] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]">
          <ArrowLeft className="w-5 h-5" />
        </DashboardButton>
        <h1 className="text-xl font-semibold text-black dark:text-white">Settings</h1>
      </div>

      <div className="space-y-6">
        <DashboardCard>
          <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Appearance</h3>
          <p className="text-xs font-medium text-black/50 dark:text-white/50 tracking-wide mb-2">Theme</p>
          <div className="flex items-center gap-2">
            <DashboardButton
              onClick={theme === "dark" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-[10px] font-medium ${
                theme === "light"
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </DashboardButton>
            <DashboardButton
              onClick={theme === "light" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-[10px] font-medium ${
                theme === "dark"
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "bg-black/[0.04] dark:bg-white/[0.04] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </DashboardButton>
          </div>
        </DashboardCard>

        <DashboardCard>
          <h3 className="text-sm font-semibold text-black dark:text-white mb-1">Billing & Plan</h3>
          <p className="text-xs text-black/50 dark:text-white/50 mb-4">You are currently on the <span className="font-medium text-black dark:text-white">Team</span> plan.</p>

          <div className="rounded-2xl border border-black dark:border-white bg-black dark:bg-white p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-bold text-white dark:text-black">Team</p>
                <p className="text-sm text-white/70 dark:text-black/70 mt-0.5">$29/mo per seat</p>
              </div>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-white/20 dark:bg-black/20 text-white dark:text-black">Current Plan</span>
            </div>
            <ul className="space-y-2">
              {[
                "Unlimited projects",
                "Unlimited secrets",
                "Up to 25 team members",
                "Environment sync",
                "Priority email support",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80 dark:text-black/80">
                  <Check className="w-4 h-4 text-white dark:text-black flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <DashboardButton onClick={() => navigate("/pricing")} className="w-full h-9 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-[10px] hover:bg-black/90 dark:hover:bg-white">
            <CreditCard className="w-4 h-4" />
            Upgrade Plan
          </DashboardButton>
        </DashboardCard>

        <DashboardCard className="border border-[#FF3B30]/20 dark:border-[#FF3B30]/20">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Danger Zone</h3>
          <div className="flex items-start gap-3 p-3 bg-[#FF3B30]/5 rounded-xl mb-4">
            <AlertTriangle className="w-4 h-4 text-[#FF3B30] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-black dark:text-white">Delete Account</p>
              <p className="text-[11px] text-black/50 dark:text-white/50 mt-0.5">Permanently delete your account and all associated data.</p>
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
              className="h-9 px-4 text-sm font-medium text-black dark:text-white bg-black/[0.04] dark:bg-white/[0.04] rounded-[10px] hover:bg-black/[0.08] dark:hover:bg-white/[0.08]"
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
            <div className="text-sm text-black dark:text-white space-y-1">
              <p>This will permanently delete your account.</p>
              <p>Teams you own — including all their projects, secrets, and environments — will also be deleted. This cannot be undone.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1.5">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-10 px-3 text-sm rounded-xl border border-black/[0.08] dark:border-[#333] bg-white dark:bg-white/[0.04] text-black dark:text-white placeholder-black/50 dark:placeholder-white/50 outline-none focus:border-[#FF3B30] focus:ring-1 focus:ring-[#FF3B30]/30 transition-colors duration-200"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
