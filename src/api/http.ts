import { API_BASE_URL } from "@/config";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/constants/key";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface AuthResponsePayload {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string;
  user: unknown;
}

export interface HttpOptions {
  method?: HttpMethod;
  skipAuth?: boolean;
  retryOnAuthError?: boolean;
  parseJson?: boolean;
}

export interface HttpError extends Error {
  status: number;
  response: Response;
  body?: unknown;
}

const isBrowser = typeof window !== "undefined";

let accessToken: string | null = null;
let refreshToken: string | null = null;

if (isBrowser) {
  accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
}

let refreshPromise: Promise<boolean> | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

export function setAuthTokens(
  tokens: Partial<{ accessToken: string | null; refreshToken: string | null }>
) {
  if (!isBrowser) return;

  if (tokens.accessToken !== undefined) {
    accessToken = tokens.accessToken;
    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  }

  if (tokens.refreshToken !== undefined) {
    refreshToken = tokens.refreshToken;
    if (tokens.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }
}

export function clearAuthTokens() {
  accessToken = null;
  refreshToken = null;

  if (isBrowser) {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

async function requestTokenRefresh(): Promise<boolean> {
  if (!refreshToken) return false;

  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) {
          clearAuthTokens();
          return false;
        }

        const payload = (await res.json()) as AuthResponsePayload;
        setAuthTokens({
          accessToken: payload.accessToken ?? null,
          refreshToken: payload.refreshToken ?? null,
        });
        return true;
      } catch (error) {
        console.error("Failed to refresh auth token", error);
        clearAuthTokens();
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}

async function makeHttpError(response: Response): Promise<HttpError> {
  let body: unknown;
  try {
    const text = await response.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    // ignore parse failure
  }

  const error = new Error(
    `Request failed with status ${response.status}`
  ) as HttpError;
  error.status = response.status;
  error.response = response;
  error.body = body;
  return error;
}

export async function http<T = unknown>(
  path: string,
  init: RequestInit = {},
  options: HttpOptions = {}
): Promise<T> {
  const {
    method,
    skipAuth = false,
    retryOnAuthError = true,
    parseJson = true,
  } = options;

  const headers = new Headers(init.headers ?? {});

  if (!skipAuth && accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const hasBody = init.body !== undefined && init.body !== null;
  if (
    hasBody &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof Blob) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    method: method ?? init.method,
    headers,
  });

  if (response.status === 401 && !skipAuth && retryOnAuthError) {
    const refreshed = await requestTokenRefresh();
    if (refreshed) {
      return http<T>(path, init, { ...options, retryOnAuthError: false });
    }
  }

  if (!response.ok) {
    throw await makeHttpError(response);
  }

  if (!parseJson) {
    return response as unknown as T;
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
