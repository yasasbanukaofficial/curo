import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sun, Moon, ArrowLeft, AlertTriangle, Trash2 } from "lucide-react";
import { useTheme } from "./DashboardLayout";

import Modal from "../../components/dashboard/Modal";
import { useDeleteAccountMutation, clearCredentials } from "../../store";
import { baseApi } from "../../store/baseApi";
import { useAppDispatch } from "../../app/store";
import { useToast } from "../../components/dashboard/Toast";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } as const },
};

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
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-2xl space-y-6"
      >
        <motion.div variants={cardVariants}>
          <div className="flex items-center gap-3 mb-6">
            <button type="button" onClick={() => navigate("/dashboard")} className="p-2 rounded-xl text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all duration-200">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-[#FAFAFA]">Settings</h1>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-gray-200 dark:border-white/[0.06] p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4">Appearance</h3>
          <p className="text-xs font-medium text-gray-500 dark:text-white/40 tracking-wide mb-2">Theme</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={theme === "dark" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                theme === "light"
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              type="button"
              onClick={theme === "light" ? toggle : undefined}
              className={`flex-1 h-10 gap-2 text-sm rounded-xl font-medium transition-all duration-200 ${
                theme === "dark"
                  ? "bg-accent text-white shadow-sm"
                  : "bg-gray-100 dark:bg-white/[0.04] text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </motion.div>

        <motion.div variants={cardVariants} className="bg-white dark:bg-[#111113] rounded-2xl border border-red-500/20 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-[#FAFAFA] mb-3">Danger Zone</h3>
          <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-[#FAFAFA]">Delete Account</p>
              <p className="text-[11px] text-gray-500 dark:text-white/40 mt-0.5">Permanently delete your account and all associated data.</p>
            </div>
          </div>
          <button type="button" onClick={() => setShowDeleteModal(true)} className="w-full h-9 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-500/90 transition-all duration-200 inline-flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" />Delete Account
          </button>
        </motion.div>
      </motion.div>

      <Modal
        open={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setConfirmText(""); setDeleting(false); }}
        title="Delete Account"
        footer={
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={() => { setShowDeleteModal(false); setConfirmText(""); setDeleting(false); }} className="h-9 px-4 text-sm font-medium text-gray-500 dark:text-white/70 bg-gray-100 dark:bg-white/[0.04] rounded-xl hover:bg-gray-200 dark:hover:bg-white/[0.08] transition-all duration-200">
              Cancel
            </button>
            <button type="button" onClick={handleDeleteAccount} disabled={confirmText !== "DELETE" || deleting} className="h-9 px-4 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-500/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
              {deleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-red-500/5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-900 dark:text-[#FAFAFA] space-y-1">
              <p>This will permanently delete your account.</p>
              <p>Teams you own — including all their projects, secrets, and environments — will also be deleted. This cannot be undone.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-[#FAFAFA] mb-1.5">
              Type <span className="font-bold">DELETE</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-white/[0.08] bg-gray-100 dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-colors duration-200"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
