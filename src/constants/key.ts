export const THEME_STORAGE_KEY = "finora-theme";
export const SETTINGS_STORAGE_KEY = "finora-settings";
export const ACCESS_TOKEN_KEY = "accessToken";
export const REFRESH_TOKEN_KEY = "refreshToken";

export const DEFAULT_SETTINGS: UserSetting = {
  defaultCurrency: "USD",
  defaultDateRange: "this-month",
  theme: "system",
  notifications: true,
};

export interface UserSetting {
  defaultCurrency: string;
  defaultDateRange:
    | "today"
    | "this-week"
    | "this-month"
    | "this-quarter"
    | "this-year";
  theme: "light" | "dark" | "system";
  notifications: boolean;
}
