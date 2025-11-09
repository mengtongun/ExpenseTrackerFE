import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "../api/http";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../api/auth";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserDto,
} from "../types";

interface AuthContextValue {
  user: UserDto | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  register: (payload: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<UserDto | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  const applyAuthResponse = useCallback((response: AuthResponse) => {
    setAuthTokens({
      accessToken: response.accessToken ?? null,
      refreshToken: response.refreshToken ?? null,
    });
    setUser(response.user);
    return response;
  }, []);

  const refreshUser = useCallback(async (): Promise<UserDto | null> => {
    if (!getAccessToken()) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      console.warn("Failed to refresh user", error);
      clearAuthTokens();
      setUser(null);
      return null;
    }
  }, []);

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      if (getAccessToken() || getRefreshToken()) {
        await refreshUser();
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await loginRequest(credentials);
      return applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (payload: RegisterRequest) => {
      const response = await registerRequest(payload);
      return applyAuthResponse(response);
    },
    [applyAuthResponse],
  );

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    try {
      if (refresh) {
        await logoutRequest(refresh);
      }
    } catch (error) {
      console.warn("Logout request failed", error);
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, loading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

