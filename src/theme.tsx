import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEME_STORAGE_KEY } from "./constants/key";

type ThemeVariables = Record<string, string>;
export type ThemeName = "light" | "dark";

const defaultLightTheme: ThemeVariables = {
  "--color-primary": "rgb(63, 114, 175)",
  "--color-primary-strong": "rgb(17, 45, 78)",
  "--color-primary-soft": "rgba(63, 114, 175, 0.12)",
  "--color-primary-ring": "rgba(63, 114, 175, 0.3)",

  "--color-accent": "rgb(63, 114, 175)",
  "--color-accent-strong": "rgb(17, 45, 78)",
  "--color-accent-soft": "rgba(63, 114, 175, 0.12)",
  "--color-accent-ring": "rgba(63, 114, 175, 0.25)",

  "--color-danger": "#EF4444",
  "--color-danger-strong": "#DC2626",
  "--color-danger-soft": "rgba(239, 68, 68, 0.15)",
  "--color-danger-border": "rgba(254, 202, 202, 1)",
  "--color-danger-ring": "rgba(239, 68, 68, 0.3)",

  "--color-warning": "#F97316",
  "--color-warning-soft": "#FFF7ED",
  "--color-warning-strong": "#C2410C",
  "--color-warning-border": "rgba(249, 115, 22, 0.35)",

  "--color-success-soft": "#DCFCE7",
  "--color-success-strong": "#15803D",

  "--color-overlay": "rgba(17, 45, 78, 0.4)",

  "--color-text-primary": "rgb(17, 45, 78)",
  "--color-text-secondary": "rgba(17, 45, 78, 0.75)",
  "--color-text-muted": "rgba(17, 45, 78, 0.5)",
  "--color-text-inverse": "rgb(249, 247, 247)",
  "--color-text-slate-600": "rgba(17, 45, 78, 0.65)",
  "--color-muted-soft": "rgba(17, 45, 78, 0.1)",
  "--color-code-bg": "rgb(17, 45, 78)",
  "--color-code-text": "rgb(249, 247, 247)",

  "--color-surface": "rgb(249, 247, 247)",
  "--color-surface-muted": "rgb(219, 226, 239)",
  "--color-surface-alt": "rgb(219, 226, 239)",
  "--color-surface-highlight": "rgba(63, 114, 175, 0.08)",

  "--color-border": "rgba(63, 114, 175, 0.2)",
  "--color-border-strong": "rgba(63, 114, 175, 0.4)",

  "--shadow-card": "0 18px 40px -20px rgba(63, 114, 175, 0.25)",
};

const defaultDarkTheme: ThemeVariables = {
  "--color-primary": "rgb(0, 173, 181)",
  "--color-primary-strong": "rgb(0, 173, 181)",
  "--color-primary-soft": "rgba(0, 173, 181, 0.18)",
  "--color-primary-ring": "rgba(0, 173, 181, 0.35)",

  "--color-accent": "rgb(0, 173, 181)",
  "--color-accent-strong": "rgb(0, 173, 181)",
  "--color-accent-soft": "rgba(0, 173, 181, 0.18)",
  "--color-accent-ring": "rgba(0, 173, 181, 0.35)",

  "--color-danger": "#F87171",
  "--color-danger-strong": "#EF4444",
  "--color-danger-soft": "rgba(248, 113, 113, 0.25)",
  "--color-danger-border": "rgba(248, 113, 113, 0.45)",
  "--color-danger-ring": "rgba(248, 113, 113, 0.35)",

  "--color-warning": "#FB923C",
  "--color-warning-soft": "rgba(251, 146, 60, 0.15)",
  "--color-warning-strong": "#F97316",
  "--color-warning-border": "rgba(251, 146, 60, 0.35)",

  "--color-success-soft": "rgba(0, 173, 181, 0.15)",
  "--color-success-strong": "rgb(0, 173, 181)",

  "--color-overlay": "rgba(34, 40, 49, 0.6)",

  "--color-text-primary": "rgb(238, 238, 238)",
  "--color-text-secondary": "rgba(238, 238, 238, 0.8)",
  "--color-text-muted": "rgba(238, 238, 238, 0.6)",
  "--color-text-inverse": "rgb(34, 40, 49)",
  "--color-text-slate-600": "rgba(238, 238, 238, 0.7)",
  "--color-muted-soft": "rgba(238, 238, 238, 0.25)",
  "--color-code-bg": "rgb(34, 40, 49)",
  "--color-code-text": "rgb(238, 238, 238)",

  "--color-surface": "rgb(34, 40, 49)",
  "--color-surface-muted": "rgb(57, 62, 70)",
  "--color-surface-alt": "rgb(57, 62, 70)",
  "--color-surface-highlight": "rgba(0, 173, 181, 0.2)",

  "--color-border": "rgba(0, 173, 181, 0.25)",
  "--color-border-strong": "rgba(0, 173, 181, 0.45)",

  "--shadow-card": "0 20px 45px -25px rgba(0, 173, 181, 0.45)",
};

const themes: Record<ThemeName, ThemeVariables> = {
  light: defaultLightTheme,
  dark: defaultDarkTheme,
};

interface ThemeContextValue {
  theme: ThemeVariables;
  themeName: ThemeName;
  setTheme: (variables: Partial<ThemeVariables>) => void;
  setThemeName: (name: ThemeName) => void;
  toggleTheme: () => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeVariables(theme: ThemeVariables, name: ThemeName) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  root.dataset.theme = name;
}

function getPreferredTheme(): ThemeName {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(
    THEME_STORAGE_KEY
  ) as ThemeName | null;
  if (stored && stored in themes) {
    return stored;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeNameState] = useState<ThemeName>(() =>
    getPreferredTheme()
  );
  const [overrides, setOverrides] = useState<Partial<ThemeVariables>>({});
  const [theme, setThemeState] = useState<ThemeVariables>(() => ({
    ...themes[getPreferredTheme()],
  }));

  useEffect(() => {
    const merged: ThemeVariables = { ...themes[themeName] };
    Object.entries(overrides).forEach(([key, value]) => {
      if (value !== undefined) {
        merged[key] = value;
      }
    });
    setThemeState(merged);
  }, [themeName, overrides]);

  useEffect(() => {
    applyThemeVariables(theme, themeName);
  }, [theme, themeName]);

  const setTheme = useCallback((variables: Partial<ThemeVariables>) => {
    setOverrides((prev) => {
      const next = { ...prev };
      for (const [key, value] of Object.entries(variables)) {
        if (value !== undefined) {
          next[key] = value;
        }
      }
      return next;
    });
  }, []);

  const updateThemeName = useCallback(
    (next: ThemeName | ((prev: ThemeName) => ThemeName)) => {
      setThemeNameState((prev) => {
        const resolved =
          typeof next === "function"
            ? (next as (prev: ThemeName) => ThemeName)(prev)
            : next;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(THEME_STORAGE_KEY, resolved);
        }
        return resolved;
      });
    },
    []
  );

  const setThemeName = useCallback(
    (name: ThemeName) => {
      updateThemeName(name);
    },
    [updateThemeName]
  );

  const toggleTheme = useCallback(() => {
    updateThemeName((prev) => (prev === "light" ? "dark" : "light"));
  }, [updateThemeName]);

  const resetTheme = useCallback(() => {
    setOverrides({});
    updateThemeName("light");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  }, [updateThemeName]);

  const value = useMemo(
    () => ({
      theme,
      themeName,
      setTheme,
      setThemeName,
      toggleTheme,
      resetTheme,
    }),
    [theme, themeName, setTheme, setThemeName, toggleTheme, resetTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

export { defaultLightTheme as defaultTheme };
