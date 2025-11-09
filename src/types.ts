export interface UserDto {
  id: string;
  username: string | null;
  email: string | null;
  fullName: string | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string | null;
  refreshToken: string | null;
  accessTokenExpiresAt: string;
  user: UserDto;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string | null;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface CategoryDto {
  id: string;
  name: string | null;
  description: string | null;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface ExpenseDto {
  id: string;
  categoryId: string | null;
  categoryName: string | null;
  amount: number;
  currency: string | null;
  description: string | null;
  expenseDate: string;
  isRecurring: boolean;
}

export interface CreateExpenseRequest {
  categoryId?: string | null;
  amount: number;
  currency?: string | null;
  description?: string | null;
  expenseDate: string;
  isRecurring?: boolean;
}

export interface UpdateExpenseRequest extends CreateExpenseRequest {}

export interface ExpensePagedResult {
  items: ExpenseDto[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const enum RecurrenceFrequency {
  Daily = 1,
  Weekly = 2,
  BiWeekly = 3,
  Monthly = 4,
  Quarterly = 5,
  Yearly = 6,
}

export interface RecurringExpenseDto {
  id: string;
  categoryId: string | null;
  amount: number;
  currency: string | null;
  description: string | null;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate: string | null;
  nextOccurrence: string;
  isActive: boolean;
}

export interface CreateRecurringExpenseRequest {
  categoryId?: string | null;
  amount: number;
  currency?: string | null;
  description?: string | null;
  frequency: RecurrenceFrequency;
  startDate: string;
  endDate?: string | null;
}

export interface UpdateRecurringExpenseRequest
  extends CreateRecurringExpenseRequest {
  isActive: boolean;
}

export interface ReportSummaryDto {
  total: number;
  byCategory: Record<string, number> | null;
  byMonth: Record<string, number> | null;
  byCurrency: Record<string, number | null> | null;
}

export interface ReportDto {
  id: string;
  reportType: string | null;
  parameters: string | null;
  createdAt: string;
  fileName: string | null;
  contentType: string | null;
}

export const enum ReportExportFormat {
  Csv = 1,
  Pdf = 2,
}

export interface UpdateUserProfileRequest {
  fullName?: string | null;
  email?: string | null;
  currentPassword?: string | null;
  newPassword?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
}
