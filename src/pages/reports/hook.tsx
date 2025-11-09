import { format, parseISO } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { HttpError } from "../../api/http";
import {
  exportReport,
  getReportHistory,
  getReportSummary,
  type ReportSummaryParams,
} from "../../api/reports";
import { type DateRange } from "../../components/common/DateRangePicker";
import type { ReportDto, ReportExportFormat, ReportSummaryDto } from "../../types";
import { formatCurrency } from "../../utils/format";

interface Filters {
  range: DateRange;
  groupBy: string;
}

export const useReports = () => {
  const [summary, setSummary] = useState<ReportSummaryDto | null>(null);
  const [history, setHistory] = useState<ReportDto[]>([]);
  const [filters, setFilters] = useState<Filters>({
    range: { startDate: null, endDate: null },
    groupBy: "month",
  });

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const loadSummary = useCallback(async (params: Filters) => {
    setLoadingSummary(true);
    setError(null);
    const query: ReportSummaryParams = {
      startDate: params.range.startDate ?? undefined,
      endDate: params.range.endDate ?? undefined,
      groupBy: params.groupBy || undefined,
    };
    try {
      const result = await getReportSummary(query);
      setSummary(result);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to load report summary.";
      setError(detail);
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const result = await getReportHistory();
      setHistory(result);
    } catch (err) {
      console.warn("Unable to load report history", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    void loadSummary(filters);
  }, [filters, loadSummary]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const categoryData = useMemo(() => {
    if (!summary?.byCategory) return [];
    return Object.entries(summary.byCategory).map(([name, value]) => ({
      name,
      value,
    }));
  }, [summary]);

  const monthlyData = useMemo(() => {
    if (!summary?.byMonth) return [];
    return Object.entries(summary.byMonth)
      .map(([monthKey, value]) => {
        try {
          const date = parseISO(`${monthKey}-01`);
          return {
            month: format(date, "MMM yyyy"),
            value,
            sortKey: date.getTime(),
          };
        } catch {
          return { month: monthKey, value, sortKey: Number.MAX_SAFE_INTEGER };
        }
      })
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [summary]);

  const currencyData = useMemo(() => {
    if (!summary?.byCurrency) return [];
    return Object.entries(summary.byCurrency).map(([currency, value]) => ({
      currency,
      value: value ?? 0,
    }));
  }, [summary]);

  const insights = useMemo(() => {
    const list: string[] = [];
    if (summary?.total) {
      list.push(`Total spending: ${formatCurrency(summary.total)}`);
    }
    if (categoryData.length > 0) {
      const topCategory = categoryData.reduce((prev, curr) =>
        curr.value > prev.value ? curr : prev
      );
      list.push(
        `Top category: ${topCategory.name} (${formatCurrency(topCategory.value)})`
      );
    }
    if (monthlyData.length >= 2) {
      const latest = monthlyData[monthlyData.length - 1];
      const previous = monthlyData[monthlyData.length - 2];
      const delta = latest.value - previous.value;
      const percent = previous.value === 0 ? 0 : (delta / previous.value) * 100;
      list.push(
        `${delta >= 0 ? "Increase" : "Decrease"} of ${Math.abs(percent).toFixed(
          1
        )}% compared to previous month.`
      );
    }
    return list;
  }, [summary, categoryData, monthlyData]);

  const handleExport = async (format: ReportExportFormat) => {
    setExporting(true);
    setError(null);
    setInfo(null);
    const query: ReportSummaryParams = {
      startDate: filters.range.startDate ?? undefined,
      endDate: filters.range.endDate ?? undefined,
      groupBy: filters.groupBy || undefined,
    };
    try {
      const blob = await exportReport(format, query);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const extension = format === 1 ? "csv" : "pdf";
      link.href = url;
      link.download = `finora-report-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setInfo(`Report export started as ${extension.toUpperCase()}.`);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to export report.";
      setError(detail);
    } finally {
      setExporting(false);
    }
  };

  return {
    summary,
    history,
    filters,
    setFilters,
    loadingSummary,
    loadingHistory,
    exporting,
    error,
    info,
    categoryData,
    monthlyData,
    currencyData,
    insights,
    handleExport,
  };
};

