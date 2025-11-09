import { http } from "./http";
import type {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

export async function getCategories(): Promise<CategoryDto[]> {
  return http<CategoryDto[]>("/api/categories", { method: "GET" });
}

export async function createCategory(
  payload: CreateCategoryRequest,
): Promise<CategoryDto> {
  return http<CategoryDto>("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryRequest,
): Promise<CategoryDto> {
  return http<CategoryDto>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await http<void>(`/api/categories/${id}`, { method: "DELETE" });
}

