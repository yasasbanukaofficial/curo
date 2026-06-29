import { useState, useCallback } from "react";

export function useActiveTeam() {
  const [activeTeamId, setActiveTeamId] = useState<string | null>(() =>
    sessionStorage.getItem("activeTeamId"),
  );

  const setTeam = useCallback((id: string) => {
    sessionStorage.setItem("activeTeamId", id);
    setActiveTeamId(id);
  }, []);

  const clearTeam = useCallback(() => {
    sessionStorage.removeItem("activeTeamId");
    setActiveTeamId(null);
  }, []);

  return { activeTeamId, setTeam, clearTeam };
}
