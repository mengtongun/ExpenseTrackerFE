import { IconButton } from "@/components/common/IconButton";
import { TableColumn } from "@/components/common/Table";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../api/categories";
import {
  createExpense,
  deleteExpense,
  getExpenses,
  updateExpense,
  type ExpenseQueryParams,
} from "../../api/expenses";
import type { HttpError } from "../../api/http";
import { type DateRange } from "../../components/common/DateRangePicker";
import type { CategoryDto, ExpenseDto, ExpensePagedResult } from "../../types";
import { formatCurrency } from "../../utils/format";

interface Filters {
  categoryId: string;
  dateRange: DateRange;
  pageNumber: number;
  pageSize: number;
}

const PAGE_SIZES = [10, 20, 50];

export const useExpense = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [result, setResult] = useState<ExpensePagedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    categoryId: "",
    dateRange: { startDate: null, endDate: null },
    pageNumber: 1,
    pageSize: 10,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseDto | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<ExpenseDto | null>(
    null
  );

  const expenses = result?.items ?? [];
  const totalCount = result?.totalCount ?? 0;
  const totalPages = result?.totalPages ?? 1;
  const pageNumber = result?.pageNumber ?? filters.pageNumber;

  const formatAmount = useCallback(
    (amount: number, currency?: string | null) => {
      return formatCurrency(amount, currency);
    },
    []
  );

  const handleDeleteClick = useCallback((expense: ExpenseDto) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!expenseToDelete) return;
    setError(null);
    try {
      await deleteExpense(expenseToDelete.id);
      setResult((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter(
                (item) => item.id !== expenseToDelete.id
              ),
              totalCount: Math.max(prev.totalCount - 1, 0),
            }
          : prev
      );
      setDeleteConfirmOpen(false);
      setExpenseToDelete(null);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Failed to delete expense.";
      setError(detail);
    }
  }, [expenseToDelete]);

  const resetDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setExpenseToDelete(null);
  }, []);

  const tableColumns = useMemo<TableColumn<ExpenseDto>[]>(
    () => [
      {
        header: "Date",
        cellClassName: "whitespace-nowrap",
        render: (expense) => format(new Date(expense.expenseDate), "PP"),
      },
      {
        header: "Category",
        render: (expense) => expense.categoryName || "Uncategorized",
      },
      {
        header: "Description",
        render: (expense) => expense.description || "—",
      },
      {
        header: "Amount",
        align: "right",
        cellClassName: "whitespace-nowrap text-right font-semibold",
        render: (expense) => formatAmount(expense.amount, expense.currency),
      },
      {
        header: "Recurring",
        align: "center",
        render: (expense) =>
          expense.isRecurring ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-soft text-(--color-primary) text-xs font-semibold">
              Recurring
            </span>
          ) : (
            <span className="text-xs text-secondary">One-time</span>
          ),
      },
      {
        header: "Actions",
        align: "right",
        cellClassName: "whitespace-nowrap",
        render: (expense) => (
          <div className="flex items-center justify-end gap-2">
            <IconButton
              label={`Edit expense ${expense.description ?? ""}`}
              onClick={() => {
                setEditingExpense(expense);
                setDrawerOpen(true);
              }}
            >
              <FiEdit2 className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={`Delete expense ${expense.description ?? ""}`}
              variant="danger"
              onClick={() => handleDeleteClick(expense)}
            >
              <FiTrash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ),
      },
    ],
    [formatAmount, handleDeleteClick]
  );

  const pageSizeOptions = useMemo(
    () =>
      PAGE_SIZES.map((size) => ({
        value: String(size),
        label: String(size),
      })),
    []
  );

  const fetchCategories = useCallback(async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.warn("Unable to load categories", err);
    }
  }, []);

  const fetchExpenses = useCallback(async (params: Filters) => {
    setLoading(true);
    setError(null);
    const query: ExpenseQueryParams = {
      categoryId: params.categoryId || undefined,
      startDate: params.dateRange.startDate ?? undefined,
      endDate: params.dateRange.endDate ?? undefined,
      pageNumber: params.pageNumber,
      pageSize: params.pageSize,
    };

    try {
      const response = await getExpenses(query);
      setResult(response);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to load expenses.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isNew = searchParams.get("new");
    if (isNew == "true") {
      setDrawerOpen(true);
      navigate(`/expenses`, { replace: true });
    }
  }, [navigate, location.search]);

  useEffect(() => {
    void fetchExpenses(filters);
  }, [fetchExpenses, filters]);

  const resetForm = () => {
    setEditingExpense(null);
    setDrawerOpen(false);
    setSubmitting(false);
  };

  const handleSave = async (values: Parameters<typeof createExpense>[0]) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editingExpense) {
        const updated = await updateExpense(editingExpense.id, values);
        setResult((prev) =>
          prev
            ? {
                ...prev,
                items: prev.items.map((item) =>
                  item.id === updated.id ? updated : item
                ),
              }
            : prev
        );
      } else {
        await createExpense(values);
        const nextFilters = { ...filters, pageNumber: 1 };
        setFilters(nextFilters);
        await fetchExpenses(nextFilters);
      }
      resetForm();
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to save expense. Please try again.";
      setError(detail);
      setSubmitting(false);
    }
  };

  const handlePageChange = (nextPage: number) => {
    setFilters((prev) => ({
      ...prev,
      pageNumber: Math.min(Math.max(nextPage, 1), totalPages),
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: size,
      pageNumber: 1,
    }));
  };

  return {
    categories,
    result,
    loading,
    error,
    submitting,
    filters,
    setFilters,
    drawerOpen,
    setDrawerOpen,
    editingExpense,
    setEditingExpense,
    expenses,
    totalCount,
    totalPages,
    pageNumber,
    formatAmount,
    handleDeleteClick,
    handleDeleteConfirm,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    expenseToDelete,
    resetDeleteConfirm,
    tableColumns,
    pageSizeOptions,
    fetchCategories,
    fetchExpenses,
    resetForm,
    handleSave,
    handlePageChange,
    handlePageSizeChange,
  };
};
