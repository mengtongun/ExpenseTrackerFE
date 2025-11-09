import { http } from "./http";
import type { UpdateUserProfileRequest, UserDto } from "../types";

export async function getCurrentUserProfile(): Promise<UserDto> {
  return http<UserDto>("/api/users/me", { method: "GET" });
}

export async function updateUserProfile(
  payload: UpdateUserProfileRequest,
): Promise<UserDto> {
  return http<UserDto>("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

