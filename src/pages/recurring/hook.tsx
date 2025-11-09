import { TableColumn } from "@/components/common/Table";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { getCategories } from "../../api/categories";
import type { HttpError } from "../../api/http";
import {
  createRecurringExpense,
  deleteRecurringExpense,
  getRecurringExpenses,
  processRecurringExpenses,
  updateRecurringExpense,
} from "../../api/recurring";
import { IconButton } from "../../components/common/IconButton";
import type {
  CategoryDto,
  RecurrenceFrequency,
  RecurringExpenseDto,
} from "../../types";
import { formatCurrency } from "../../utils/format";

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  [1]: "Daily",
  [2]: "Weekly",
  [3]: "Bi-weekly",
  [4]: "Monthly",
  [5]: "Quarterly",
  [6]: "Yearly",
};

export const useRecurring = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<
    RecurringExpenseDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringExpenseDto | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [recurringToDelete, setRecurringToDelete] =
    useState<RecurringExpenseDto | null>(null);

  const formatAmount = useCallback(
    (amount: number, currency?: string | null) => {
      return formatCurrency(amount, currency);
    },
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoryResult, recurringResult] = await Promise.all([
        getCategories(),
        getRecurringExpenses(),
      ]);
      setCategories(categoryResult);
      setRecurringExpenses(recurringResult);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to load recurring expenses.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetForm = () => {
    setEditing(null);
    setDrawerOpen(false);
    setSubmitting(false);
  };

  const handleSave = async (
    values: Parameters<typeof createRecurringExpense>[0] &
      Partial<Parameters<typeof updateRecurringExpense>[1]>
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      if (editing) {
        const payload = values as Parameters<typeof updateRecurringExpense>[1];
        if (payload.isActive === undefined) {
          payload.isActive = editing.isActive;
        }
        const updated = await updateRecurringExpense(editing.id, payload);
        setRecurringExpenses((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
      } else {
        const payload = values as Parameters<typeof createRecurringExpense>[0];
        const created = await createRecurringExpense(payload);
        setRecurringExpenses((prev) => [created, ...prev]);
      }
      resetForm();
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to save recurring expense.";
      setError(detail);
      setSubmitting(false);
    }
  };

  const handleDeleteClick = useCallback((recurring: RecurringExpenseDto) => {
    setRecurringToDelete(recurring);
    setDeleteConfirmOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!recurringToDelete) return;
    setError(null);
    try {
      await deleteRecurringExpense(recurringToDelete.id);
      setRecurringExpenses((prev) =>
        prev.filter((item) => item.id !== recurringToDelete.id)
      );
      setDeleteConfirmOpen(false);
      setRecurringToDelete(null);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Failed to delete recurring expense.";
      setError(detail);
    }
  }, [recurringToDelete]);

  const resetDeleteConfirm = useCallback(() => {
    setDeleteConfirmOpen(false);
    setRecurringToDelete(null);
  }, []);

  const handleProcess = async () => {
    setProcessing(true);
    setError(null);
    setInfo(null);
    try {
      const processedCount = await processRecurringExpenses();
      setInfo(
        processedCount === 0
          ? "No pending recurring expenses were processed."
          : `${processedCount} recurring expense${
              processedCount === 1 ? "" : "s"
            } processed successfully.`
      );
      await loadData();
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to process recurring expenses.";
      setError(detail);
    } finally {
      setProcessing(false);
    }
  };

  const tableColumns = useMemo<TableColumn<RecurringExpenseDto>[]>(
    () => [
      {
        header: "Category",
        render: (item) =>
          categories.find((cat) => cat.id === item.categoryId)?.name ??
          "Uncategorized",
      },
      {
        header: "Description",
        render: (item) => item.description || "—",
      },
      {
        header: "Amount",
        align: "right",
        cellClassName: "whitespace-nowrap text-right font-semibold",
        render: (item) => formatAmount(item.amount, item.currency),
      },
      {
        header: "Frequency",
        render: (item) => frequencyLabels[item.frequency],
      },
      {
        header: "Next occurrence",
        render: (item) => format(new Date(item.nextOccurrence), "PP"),
      },
      {
        header: "Status",
        align: "center",
        render: (item) =>
          item.isActive ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent-soft text-(--color-success-strong) text-xs font-semibold">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-(--color-muted-soft) text-(--color-text-slate-600) text-xs font-semibold">
              Paused
            </span>
          ),
      },
      {
        header: "Actions",
        align: "right",
        cellClassName: "whitespace-nowrap",
        render: (item) => (
          <div className="flex items-center justify-end gap-2">
            <IconButton
              label={`Edit recurring expense ${item.description ?? ""}`}
              onClick={() => {
                setEditing(item);
                setDrawerOpen(true);
              }}
            >
              <FiEdit2 className="h-4 w-4" />
            </IconButton>
            <IconButton
              label={`Delete recurring expense ${item.description ?? ""}`}
              variant="danger"
              onClick={() => handleDeleteClick(item)}
            >
              <FiTrash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ),
      },
    ],
    [categories, formatAmount, handleDeleteClick]
  );

  return {
    categories,
    recurringExpenses,
    loading,
    submitting,
    processing,
    error,
    info,
    drawerOpen,
    setDrawerOpen,
    editing,
    setEditing,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    recurringToDelete,
    formatAmount,
    resetForm,
    handleSave,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteConfirm,
    handleProcess,
    tableColumns,
    frequencyLabels,
    loadData,
  };
};

