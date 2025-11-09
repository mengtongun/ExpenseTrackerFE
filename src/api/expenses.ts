import { http } from "./http";
import type {
  CreateExpenseRequest,
  ExpenseDto,
  ExpensePagedResult,
  UpdateExpenseRequest,
} from "../types";

export interface ExpenseQueryParams {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  pageNumber?: number;
  pageSize?: number;
}

function buildQuery(params: ExpenseQueryParams): string {
  const search = new URLSearchParams();
  if (params.categoryId) search.set("CategoryId", params.categoryId);
  if (params.startDate) search.set("StartDate", params.startDate);
  if (params.endDate) search.set("EndDate", params.endDate);
  if (params.pageNumber) search.set("PageNumber", params.pageNumber.toString());
  if (params.pageSize) search.set("PageSize", params.pageSize.toString());
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getExpenses(
  params: ExpenseQueryParams = {},
): Promise<ExpensePagedResult> {
  return http<ExpensePagedResult>(
    `/api/expenses${buildQuery(params)}`,
    { method: "GET" },
  );
}

export async function getExpense(id: string): Promise<ExpenseDto> {
  return http<ExpenseDto>(`/api/expenses/${id}`, { method: "GET" });
}

export async function createExpense(
  payload: CreateExpenseRequest,
): Promise<ExpenseDto> {
  return http<ExpenseDto>("/api/expenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateExpense(
  id: string,
  payload: UpdateExpenseRequest,
): Promise<ExpenseDto> {
  return http<ExpenseDto>(`/api/expenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteExpense(id: string): Promise<void> {
  await http<void>(`/api/expenses/${id}`, { method: "DELETE" });
}

