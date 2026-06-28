import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import TopNav from "../../components/dashboard/TopNav";
import Sidebar from "../../components/dashboard/Sidebar";
import MobileNav from "../../components/dashboard/MobileNav";
import SettingsModal from "../../components/dashboard/SettingsModal";
import LoadingSpinner from "../../components/dashboard/LoadingSpinner";
import InviteJoinModal from "../../components/dashboard/InviteJoinModal";
import { useGetTeamsQuery, useLazyGetInviteDetailsQuery, useAcceptInviteExplicitMutation } from "../../store";
import { useActiveTeam } from "../../hooks/useActiveTeam";
import { ActiveTeamContext } from "../../contexts/ActiveTeamContext";
import { useToast } from "../../components/dashboard/Toast";
import type { SettingsTab } from "../../types/settings";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("curo-theme");
    return stored === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("curo-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function DashboardInner() {
  const themeCtx = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<SettingsTab>("general");
  const [layoutReady, setLayoutReady] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState<{ teamName: string; teamAvatar?: string; memberCount: number; role: string } | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteResolved, setInviteResolved] = useState(false);

  const { error: showError, success: showSuccess } = useToast();
  const { data: teams, isLoading: teamsLoading } = useGetTeamsQuery();
  const { activeTeamId, setTeam, clearTeam } = useActiveTeam();
  const [getInviteDetails] = useLazyGetInviteDetailsQuery();
  const [acceptInviteExplicit] = useAcceptInviteExplicitMutation();

  useEffect(() => {
    if (teams && teams.length > 0 && !activeTeamId) {
      setTeam(teams[0]._id);
    }
  }, [teams, activeTeamId, setTeam]);

  useEffect(() => {
    const token = sessionStorage.getItem("inviteToken");
    if (!token) {
      setInviteResolved(true);
      return;
    }

    setInviteLoading(true);

    getInviteDetails(token)
      .unwrap()
      .then((data) => {
        setInviteData({
          teamName: data.teamName || "Team",
          teamAvatar: data.teamAvatar,
          memberCount: data.memberCount || 0,
          role: data.role || "member",
        });
        setShowInviteModal(true);
      })
      .catch(() => {
        sessionStorage.removeItem("inviteToken");
        showError("Invalid invite", "This invitation is invalid or has expired.");
      })
      .finally(() => {
        setInviteLoading(false);
        setInviteResolved(true);
      });
  }, [getInviteDetails]);

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
    const token = sessionStorage.getItem("inviteToken");
    if (!token) return;

    setInviteLoading(true);
    try {
      await acceptInviteExplicit({ token }).unwrap();
      sessionStorage.removeItem("inviteToken");
      setShowInviteModal(false);
      setInviteData(null);
      showSuccess("Joined team", "You have successfully joined the team.");
    } catch {
      sessionStorage.removeItem("inviteToken");
      setShowInviteModal(false);
      setInviteData(null);
      showError("Accept failed", "Failed to accept invitation. It may have expired.");
    } finally {
      setInviteLoading(false);
    }
  }

  function handleDeclineInvite() {
    sessionStorage.removeItem("inviteToken");
    setShowInviteModal(false);
    setInviteData(null);
  }

  if (teamsLoading || !layoutReady) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  if (!inviteResolved && !showInviteModal) {
    return (
      <div className="h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex items-center justify-center">
        <LoadingSpinner size={28} />
      </div>
    );
  }

  return (
    <ActiveTeamContext.Provider value={{ activeTeamId, setTeam, clearTeam }}>
      <InviteJoinModal
        open={showInviteModal && !!inviteData}
        details={inviteData}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
        loading={inviteLoading}
      />
      <div className={"h-screen bg-[#FAFAFA] dark:bg-[#0A0A0A] flex flex-col transition-colors duration-200 " + themeCtx.theme}>
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
    </ActiveTeamContext.Provider>
  );
}

export default function DashboardLayout() {
  return (
    <ThemeProvider>
      <DashboardInner />
    </ThemeProvider>
  );
}
