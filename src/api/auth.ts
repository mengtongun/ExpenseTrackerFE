import { http } from "./http";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  UserDto,
} from "../types";

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  return http<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  return http<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function refreshToken(
  payload: RefreshTokenRequest,
): Promise<AuthResponse> {
  return http<AuthResponse>(
    "/api/auth/refresh",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { retryOnAuthError: false },
  );
}

export async function logout(refreshToken: string): Promise<void> {
  await http<void>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export async function getCurrentUser(): Promise<UserDto> {
  return http<UserDto>("/api/users/me", { method: "GET" });
}

