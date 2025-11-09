import { ReportSummaryDto } from "@/types";
import { format, parseISO } from "date-fns";

export interface DashboardSummary {
  total: number;
  categoriesTracked: number;
  currenciesTracked: number;
}
export const extractSummary = (result: ReportSummaryDto): DashboardSummary => {
  return {
    total: result.total,
    categoriesTracked: result.byCategory
      ? Object.keys(result.byCategory).length
      : 0,
    currenciesTracked: result.byCurrency
      ? Object.keys(result.byCurrency).length
      : 0,
  };
};

export const extractMonthlyData = (result: ReportSummaryDto) => {
  if (!result.byMonth) return [];
  return Object.entries(result.byMonth)
    .map(([monthKey, value]) => {
      try {
        const parsed = parseISO(`${monthKey}-01`);
        return {
          month: format(parsed, "MMM yyyy"),
          value,
          sortKey: parsed.getTime(),
        };
      } catch {
        return { month: monthKey, value, sortKey: Number.MAX_SAFE_INTEGER };
      }
    })
    .sort((a, b) => a.sortKey - b.sortKey);
};
