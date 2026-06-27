import { useState, useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import TopNav from "../../components/dashboard/TopNav";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileNav from "../../components/dashboard/MobileNav";
import SettingsModal from "../../components/dashboard/SettingsModal";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import InviteJoinModal from "../../components/dashboard/InviteJoinModal";
import { useVerifySessionQuery } from "../../features/auth/authApi";
import { useLazyGetInviteDetailsQuery, useAcceptInviteExplicitMutation } from "../../features/team/teamApi";
import { useTour } from "../../hooks/useTour";
import type { SettingsTab } from "../../types/settings";

function DashboardInner() {
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("general");
  const [layoutReady, setLayoutReady] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<{ teamName: string; teamAvatar?: string; memberCount: number; role: string } | null>(null);
  const [mountResolved, setMountResolved] = useState(false);

  const { data: sessionData } = useVerifySessionQuery();
  const [fetchInviteDetails] = useLazyGetInviteDetailsQuery();
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteExplicitMutation();

  const user = sessionData?.data;
  const shouldShowTour = user && !user.onboardingComplete && !user.onboardingSkipped;

  useTour({ shouldShow: shouldShowTour && !showInviteModal && mountResolved });

  const mountStarted = useRef(false);

  useEffect(() => {
    if (mountStarted.current) return;
    mountStarted.current = true;

    const inviteToken = sessionStorage.getItem("inviteToken");
    const pendingInvite = sessionStorage.getItem("pendingInvite");

    if (pendingInvite && inviteToken) {
      fetchInviteDetails(inviteToken).then((result) => {
        if (result.data) {
          setInviteDetails(result.data);
          setShowInviteModal(true);
        } else {
          sessionStorage.removeItem("inviteToken");
          sessionStorage.removeItem("pendingInvite");
          setMountResolved(true);
        }
      }).catch(() => {
        sessionStorage.removeItem("inviteToken");
        sessionStorage.removeItem("pendingInvite");
        setMountResolved(true);
      });
      return;
    }

    setMountResolved(true);
  }, []);

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024;
    if (!isDesktop) {
      setLayoutReady(true);
      return;
    }

    if (location.pathname === "/dashboard/account") {
      setSettingsTab("account");
      setShowSettings(true);
      navigate("/dashboard", { replace: true });
    } else if (location.pathname === "/dashboard/settings") {
      setSettingsTab("general");
      setShowSettings(true);
      navigate("/dashboard", { replace: true });
    }

    setLayoutReady(true);
  }, [location.pathname, navigate]);

  async function handleAcceptInvite() {
    const inviteToken = sessionStorage.getItem("inviteToken");
    if (!inviteToken) return;
    try {
      await acceptInvite({ token: inviteToken }).unwrap();
    } catch {}
    sessionStorage.removeItem("inviteToken");
    sessionStorage.removeItem("pendingInvite");
    setShowInviteModal(false);
    setMountResolved(true);
  }

  function handleDeclineInvite() {
    sessionStorage.removeItem("inviteToken");
    sessionStorage.removeItem("pendingInvite");
    setShowInviteModal(false);
    setMountResolved(true);
  }

  if (!layoutReady) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (!mountResolved && !showInviteModal) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <>
      <InviteJoinModal
        open={showInviteModal}
        details={inviteDetails}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
        loading={isAccepting}
      />
      <div className={`h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col transition-colors duration-200 ${theme}`}>
        <TopNav />

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar onToggleSettings={(tab) => { setSettingsTab((tab ?? "general") as SettingsTab); setShowSettings(true); }} />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto pb-16 lg:pb-0">
            <Outlet />
          </main>
        </div>

        <MobileNav />
        <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} initialTab={settingsTab} />
      </div>
    </>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  );
}
