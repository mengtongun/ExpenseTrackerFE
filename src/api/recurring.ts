import { http } from "./http";
import type {
  CreateRecurringExpenseRequest,
  RecurringExpenseDto,
  UpdateRecurringExpenseRequest,
} from "../types";

export async function getRecurringExpenses(): Promise<RecurringExpenseDto[]> {
  return http<RecurringExpenseDto[]>("/api/recurringexpenses", {
    method: "GET",
  });
}

export async function createRecurringExpense(
  payload: CreateRecurringExpenseRequest,
): Promise<RecurringExpenseDto> {
  return http<RecurringExpenseDto>("/api/recurringexpenses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateRecurringExpense(
  id: string,
  payload: UpdateRecurringExpenseRequest,
): Promise<RecurringExpenseDto> {
  return http<RecurringExpenseDto>(`/api/recurringexpenses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteRecurringExpense(id: string): Promise<void> {
  await http<void>(`/api/recurringexpenses/${id}`, { method: "DELETE" });
}

export async function processRecurringExpenses(): Promise<number> {
  return http<number>("/api/recurringexpenses/process", {
    method: "POST",
  });
}

