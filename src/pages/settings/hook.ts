import {
  DEFAULT_SETTINGS,
  THEME_STORAGE_KEY,
  UserSetting,
} from "@/constants/key";
import { ThemeName, useTheme } from "@/theme";
import { FormEvent, useEffect, useMemo, useState } from "react";

export const STORAGE_KEY = "finora.settings";

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSetting>(DEFAULT_SETTINGS);
  const [info, setInfo] = useState<string | null>(null);
  const { setThemeName, themeName } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const themeName = localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeName | null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<UserSetting>;
        const theme =
          parsed.theme === "system" ? parsed.theme : (themeName as ThemeName);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed, theme });
      } catch {
        // ignore malformed data
      }
    }
  }, []);

  const dateRangeOptions = useMemo(
    () => [
      { value: "today", label: "Today" },
      { value: "this-week", label: "This week" },
      { value: "this-month", label: "This month" },
      { value: "this-quarter", label: "This quarter" },
      { value: "this-year", label: "This year" },
    ],
    []
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (settings.theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const apply = (matches: boolean) =>
        setThemeName(matches ? "dark" : "light");

      apply(media.matches);

      const listener = (event: MediaQueryListEvent) => apply(event.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }

    setThemeName(settings.theme as ThemeName);
  }, [settings.theme, setThemeName]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setInfo("Preferences saved. Some changes may require a refresh.");
  };

  return {
    settings,
    info,
    dateRangeOptions,
    handleSubmit,
    setSettings,
    setInfo,
    setThemeName,
  };
};
