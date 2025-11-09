import { http } from "./http";
import type { ReportDto, ReportExportFormat, ReportSummaryDto } from "../types";

export interface ReportSummaryParams {
  startDate?: string;
  endDate?: string;
  groupBy?: string;
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const query = search.toString();
  return query ? `?${query}` : "";
}

export async function getReportSummary(
  params: ReportSummaryParams = {},
): Promise<ReportSummaryDto> {
  return http<ReportSummaryDto>(
    `/api/reports/summary${buildQuery({
      StartDate: params.startDate,
      EndDate: params.endDate,
      GroupBy: params.groupBy,
    })}`,
    { method: "GET" },
  );
}

export async function exportReport(
  format: ReportExportFormat,
  params: ReportSummaryParams = {},
): Promise<Blob> {
  const response = await http<Response>(
    `/api/reports/export${buildQuery({
      Format: format,
      StartDate: params.startDate,
      EndDate: params.endDate,
      GroupBy: params.groupBy,
    })}`,
    { method: "GET" },
    { parseJson: false },
  );
  const blob = await response.blob();
  return blob;
}

export async function getReportHistory(): Promise<ReportDto[]> {
  return http<ReportDto[]>("/api/reports/history", { method: "GET" });
}

