import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLazyAcceptInviteQuery } from "../features/team/teamApi";
import { useToast } from "../components/dashboard/Toast";

export default function InviteAcceptPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [trigger] = useLazyAcceptInviteQuery();

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    trigger(token).then((result) => {
      const status = result.error && "status" in result.error ? result.error.status : undefined;
      if (status === 404 || status === 410) {
        navigate("/invite/expired", { replace: true });
        return;
      }
      if (result.data?.redirect === "/dashboard") {
        toast.success("Welcome!", "You've joined the team.");
        navigate("/dashboard");
      } else if (result.data?.redirect?.startsWith("/register")) {
        navigate(result.data.redirect);
      } else {
        toast.error("Invalid invite", "This invitation is no longer valid.");
        navigate("/");
      }
    }).catch(() => {
      navigate("/invite/expired", { replace: true });
    });
  }, [token, trigger, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0A0A0A]">
      <p className="text-[#8E8E93]">Processing your invitation...</p>
    </div>
  );
}
