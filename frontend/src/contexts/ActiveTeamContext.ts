import { createContext, useContext } from "react";

interface ActiveTeamContextType {
  activeTeamId: string | null;
  setTeam: (id: string) => void;
  clearTeam: () => void;
}

export const ActiveTeamContext = createContext<ActiveTeamContextType | null>(null);

export function useActiveTeamContext() {
  const ctx = useContext(ActiveTeamContext);
  if (!ctx) throw new Error("useActiveTeamContext must be used within ActiveTeamContext.Provider");
  return ctx;
}
