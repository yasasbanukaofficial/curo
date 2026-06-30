import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Route } from '../types/index.js';

interface NavigationContextValue {
  currentRoute: Route;
  navigate: (route: Route) => void;
  previousRoute: Route | null;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentRoute, setCurrentRoute] = useState<Route>('splash');
  const [history, setHistory] = useState<Route[]>([]);

  const navigate = useCallback((route: Route) => {
    setHistory((prev) => [...prev, currentRoute]);
    setCurrentRoute(route);
  }, [currentRoute]);

  const goBack = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const prevRoute = prev[prev.length - 1];
      setCurrentRoute(prevRoute);
      return prev.slice(0, -1);
    });
  }, []);

  const previousRoute = history.length > 0 ? history[history.length - 1] : null;

  return (
    <NavigationContext.Provider value={{ currentRoute, navigate, previousRoute, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
