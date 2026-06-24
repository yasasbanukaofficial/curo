import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";

const ACCENT_STORAGE_KEY = "curo-accent";
const DEFAULT_ACCENT = "#1D1D1F";

function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.substring(0, 2), 16);
  const g = Number.parseInt(clean.substring(2, 4), 16);
  const b = Number.parseInt(clean.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
  accent: string;
  setAccent: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("curo-theme");
    return stored === "dark" ? "dark" : "light";
  });
  const [accent, setAccentState] = useState<string>(() => {
    return localStorage.getItem(ACCENT_STORAGE_KEY) || DEFAULT_ACCENT;
  });

  const setAccent = (color: string) => {
    setAccentState(color);
    localStorage.setItem(ACCENT_STORAGE_KEY, color);
  };

  useEffect(() => {
    localStorage.setItem("curo-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const rgb = hexToRgb(accent);
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--accent-rgb", rgb);
  }, [accent]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
