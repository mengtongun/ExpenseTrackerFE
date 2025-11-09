import { type TableColumn } from "@/components/common/Table";
import { formatCurrency } from "@/utils/format";
import { extractMonthlyData, extractSummary } from "@/utils/summary";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getExpenses } from "../../api/expenses";
import type { HttpError } from "../../api/http";
import { getReportSummary } from "../../api/reports";
import type { ExpenseDto } from "../../types";

export interface DashboardSummary {
  total: number;
  categoriesTracked: number;
  currenciesTracked: number;
}
export const useDashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthlyData, setMonthlyData] = useState<
    Array<{ month: string; value: number }>
  >([]);
  const [categoryStats, setCategoryStats] = useState<Array<[string, number]>>(
    []
  );
  const [recentExpenses, setRecentExpenses] = useState<ExpenseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryResult, expenseResult] = await Promise.all([
        getReportSummary({ groupBy: "month" }),
        getExpenses({ pageSize: 5, pageNumber: 1 }),
      ]);

      setSummary(extractSummary(summaryResult));
      setCategoryStats(
        summaryResult.byCategory ? Object.entries(summaryResult.byCategory) : []
      );
      setMonthlyData(extractMonthlyData(summaryResult));
      setRecentExpenses(expenseResult.items ?? []);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to load dashboard data.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const topCategory = useMemo(() => {
    if (categoryStats.length === 0) return null;
    return categoryStats.reduce((prev, curr) =>
      curr[1] > prev[1] ? curr : prev
    );
  }, [categoryStats]);

  const recentTableColumns = useMemo<TableColumn<ExpenseDto>[]>(
    () => [
      {
        header: "Date",
        headerClassName: "px-4 py-3 text-left",
        cellClassName: "px-4 py-3 whitespace-nowrap",
        render: (expense) => format(new Date(expense.expenseDate), "PP"),
      },
      {
        header: "Category",
        headerClassName: "px-4 py-3 text-left",
        cellClassName: "px-4 py-3",
        render: (expense) => expense.categoryName || "Uncategorized",
      },
      {
        header: "Description",
        headerClassName: "px-4 py-3 text-left",
        cellClassName: "px-4 py-3",
        render: (expense) => expense.description || "—",
      },
      {
        header: "Amount",
        align: "right",
        headerClassName: "px-4 py-3 text-right",
        cellClassName: "px-4 py-3 text-right font-semibold whitespace-nowrap",
        render: (expense) => formatCurrency(expense.amount, expense.currency),
      },
    ],
    []
  );

  return {
    summary,
    monthlyData,
    categoryStats,
    recentExpenses,
    topCategory,
    loading,
    error,
    loadData,
    recentTableColumns,
  };
};
