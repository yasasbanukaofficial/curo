import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Notification, NotificationType } from '../types/index.js';
import { generateId } from '../utils/index.js';

interface UIContextValue {
  notifications: Notification[];
  addNotification: (type: NotificationType, message: string) => void;
  removeNotification: (id: string) => void;
  globalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = generateId();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <UIContext.Provider value={{ notifications, addNotification, removeNotification, globalLoading, setGlobalLoading }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUiStore() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUiStore must be used within UIProvider');
  return ctx;
}
