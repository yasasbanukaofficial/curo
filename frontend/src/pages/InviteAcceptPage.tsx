import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyGetInviteDetailsQuery, useAcceptInviteExplicitMutation } from "../features/team/teamApi";
import { useToast } from "../components/dashboard/Toast";
import InviteJoinModal from "../components/dashboard/InviteJoinModal";

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [fetchDetails] = useLazyGetInviteDetailsQuery();
  const [acceptInvite, { isLoading }] = useAcceptInviteExplicitMutation();
  const [details, setDetails] = useState<{ teamName: string; teamAvatar?: string; memberCount: number; role: string; hasAccount: boolean } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchDetails(token).then((result) => {
      if (result.data) {
        setDetails(result.data);
      } else {
        navigate("/invite/expired", { replace: true });
      }
      setChecked(true);
    }).catch(() => {
      navigate("/invite/expired", { replace: true });
    });
  }, [token, fetchDetails, navigate]);

  async function handleAccept() {
    if (!token) return;
    try {
      await acceptInvite({ token }).unwrap();
      toast.success("Welcome!", "You've joined the team.");
      navigate("/dashboard");
    } catch (err: any) {
      const status = err?.status || err?.data?.status;
      if (status === 404 || status === 410) {
        navigate("/invite/expired", { replace: true });
      } else if (status === 401) {
        if (details?.hasAccount) {
          navigate(`/login?redirect=/invite/accept/${token}`);
        } else {
          navigate(`/register?invite=${token}`);
        }
      } else {
        toast.error("Failed to join", err?.data?.msg || "Something went wrong. Please try again.");
      }
    }
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
        loading={isLoading}
      />
    </div>
  );
}
