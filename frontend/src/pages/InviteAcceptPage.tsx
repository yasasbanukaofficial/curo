import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InviteJoinModal from "../components/dashboard/InviteJoinModal";

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [details] = useState<{ teamName: string; teamAvatar?: string; memberCount: number; role: string; hasAccount: boolean } | null>(null);
  const [checked] = useState(true);

  async function handleAccept() {
    if (!token) return;
  }

  function handleDecline() {
    navigate("/");
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
        <p className="text-[#8E8E93]">Processing your invitation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <InviteJoinModal
        open={!!details}
        details={details}
        onAccept={handleAccept}
        onDecline={handleDecline}
        loading={false}
      />
    </div>
  );
}
