import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { generateId } from '../utils/index.js';

export type LogEntryType = 'info' | 'success' | 'error' | 'step';

export interface LogEntry {
  id: string;
  type: LogEntryType;
  message: string;
  detail?: string;
}

interface ScrollbackContextValue {
  entries: LogEntry[];
  push: (type: LogEntryType, message: string, detail?: string) => string;
  update: (id: string, message: string, detail?: string) => void;
  clear: () => void;
}

const ScrollbackContext = createContext<ScrollbackContextValue | null>(null);

export function ScrollbackProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LogEntry[]>([]);

  const push = useCallback((type: LogEntryType, message: string, detail?: string) => {
    const id = generateId();
    setEntries((prev) => [...prev, { id, type, message, detail }]);
    return id;
  }, []);

  const update = useCallback((id: string, message: string, detail?: string) => {
    setEntries((prev) => prev.map((e) => e.id === id ? { ...e, message, detail } : e));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return (
    <ScrollbackContext.Provider value={{ entries, push, update, clear }}>
      {children}
    </ScrollbackContext.Provider>
  );
}

export function useScrollback() {
  const ctx = useContext(ScrollbackContext);
  if (!ctx) throw new Error('useScrollback must be used within ScrollbackProvider');
  return ctx;
}
