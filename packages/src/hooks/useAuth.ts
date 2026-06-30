import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.js';
import { useUiStore } from '../store/ui.js';
import type { Route } from '../types/index.js';

export function useAuth(goTo: (route: Route) => void) {
  const { isAuthenticated, isLoading, checkAuth, login, logout, user } = useAuthStore();
  const { addNotification } = useUiStore();

  useEffect(() => {
    checkAuth().then((authed) => {
      if (authed) {
        goTo('dashboard');
      } else {
        goTo('login');
      }
    });
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      addNotification('success', 'Logged in successfully');
      goTo('dashboard');
    } catch {
      addNotification('error', 'Login failed. Check your credentials.');
    }
  };

  const handleLogout = () => {
    logout();
    addNotification('info', 'Logged out');
    goTo('login');
  };

  return { isAuthenticated, isLoading, user, handleLogin, handleLogout };
}
