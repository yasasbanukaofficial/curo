import { Users } from "lucide-react";
import Modal from "./Modal";
import DashboardButton from "./DashboardButton";

interface InviteDetails {
  teamName: string;
  teamAvatar?: string;
  memberCount: number;
  role: string;
}

interface InviteJoinModalProps {
  open: boolean;
  details: InviteDetails | null;
  onAccept: () => void;
  onDecline: () => void;
  loading?: boolean;
}

export default function InviteJoinModal({
  open,
  details,
  onAccept,
  onDecline,
  loading,
}: InviteJoinModalProps) {
  if (!details) return null;

  return (
    <Modal
      open={open}
      onClose={onDecline}
      title="You're invited!"
      description="Join your team to start collaborating."
      size="sm"
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 p-4 rounded-xl bg-[#F5F5F7] dark:bg-[#1A1A1A]">
          <div className="w-12 h-12 rounded-xl bg-[#191919] dark:bg-white flex items-center justify-center">
            <Users className="w-6 h-6 text-white dark:text-[#191919]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1D1D1F] dark:text-[#E5E5E5]">
              {details.teamName}
            </p>
            <p className="text-[11px] text-[#8E8E93]">
              {details.memberCount} {details.memberCount === 1 ? "member" : "members"} · {details.role} role
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <DashboardButton
            onClick={onDecline}
            disabled={loading}
            className="flex-1 h-10 text-sm font-medium text-[#8E8E93] bg-[#F5F5F7] dark:bg-[#1A1A1A] rounded-[10px] hover:bg-[#eee] dark:hover:bg-[#222]"
          >
            Not now
          </DashboardButton>
          <DashboardButton
            onClick={onAccept}
            disabled={loading}
            className="flex-1 h-10 text-sm font-medium text-white bg-[#191919] dark:bg-white dark:text-[#191919] rounded-[10px] hover:opacity-90"
          >
            {loading ? "Joining..." : "Join team"}
          </DashboardButton>
        </div>
      </div>
    </Modal>
  );
}
