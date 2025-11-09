import { SummaryCard } from "@/components/common/SummaryCard";
import { format } from "date-fns";
import { FiFile, FiFileText } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../../components/common/Button";
import { DateRangePicker } from "../../components/common/DateRangePicker";
import { Select } from "../../components/common/Select";
import { formatCurrency } from "../../utils/format";
import { useReports } from "./hook";

const GROUP_BY_OPTIONS = [
  { label: "None", value: "" },
  { label: "Category", value: "category" },
  { label: "Month", value: "month" },
  { label: "Currency", value: "currency" },
];

const PIE_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-warning)",
  "var(--color-danger)",
  "var(--color-primary-strong)",
  "var(--color-accent-strong)",
];

export function ReportsPage() {
  const {
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
  } = useReports();

  return (
    <section className="space-y-6">
      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Reports</h1>
          <p className="text-sm text-secondary">
            Visualize spending trends and export insights for stakeholders.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 w-full items-end sm:justify-between">
          <DateRangePicker
            label="Date range"
            value={filters.range}
            onChange={(range) =>
              setFilters((prev) => ({
                ...prev,
                range,
              }))
            }
          />
          <Select
            label="Group by"
            value={filters.groupBy}
            onChange={(event) =>
              setFilters((prev) => ({
                ...prev,
                groupBy: event.target.value,
              }))
            }
            options={GROUP_BY_OPTIONS}
            className="w-full sm:w-48"
          />
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-primary">Export</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => void handleExport(1)}
                disabled={exporting}
                variant="secondary"
                className="w-full sm:w-auto text-(--color-primary)!"
              >
                <FiFile className="h-5 w-5 text-(--color-primary)" />
                Export CSV
              </Button>
              <Button
                onClick={() => void handleExport(2)}
                disabled={exporting}
                variant="secondary"
                className="w-full sm:w-auto text-(--color-primary)!"
              >
                <FiFileText className="h-5 w-5 text-(--color-primary)" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-(--color-warning-border) bg-(--color-warning-soft) text-(--color-warning-strong) px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-xl border border-(--color-accent-soft) bg-(--color-success-soft) text-success px-4 py-3 text-sm">
          {info}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total spent"
          value={
            loadingSummary ? "—" : summary ? formatCurrency(summary.total) : "0"
          }
          hint="Across selected date range"
        />
        <SummaryCard
          title="Categories tracked"
          value={
            loadingSummary || !summary?.byCategory
              ? "—"
              : Object.keys(summary.byCategory).length.toString()
          }
          hint="Distinct categories"
        />
        <SummaryCard
          title="Currencies"
          value={
            loadingSummary || !summary?.byCurrency
              ? "—"
              : Object.keys(summary.byCurrency).length.toString()
          }
          hint="Multi-currency coverage"
        />
        <SummaryCard
          title="Reports generated"
          value={loadingHistory ? "—" : history.length.toString()}
          hint="All-time exports"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Spending trends
            </h2>
            <span className="text-xs font-semibold text-secondary uppercase tracking-[0.2em]">
              Monthly
            </span>
          </div>
          <div className="h-64">
            {loadingSummary ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                Loading…
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                Not enough data to visualize trends.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis dataKey="month" stroke="var(--color-text-muted)" />
                  <YAxis stroke="var(--color-text-muted)" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    dot={{ r: 4, strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Category breakdown
            </h2>
            <span className="text-xs font-semibold text-secondary uppercase tracking-[0.2em]">
              Current range
            </span>
          </div>
          <div className="h-64">
            {loadingSummary ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                Loading…
              </div>
            ) : categoryData.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">
            Currency distribution
          </h2>
          <span className="text-xs font-semibold text-secondary uppercase tracking-[0.2em]">
            Multi-currency
          </span>
        </div>
        <div className="h-56">
          {loadingSummary ? (
            <div className="h-full grid place-items-center text-sm text-secondary">
              Loading…
            </div>
          ) : currencyData.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-secondary">
              No currency data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currencyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="currency" stroke="var(--color-text-muted)" />
                <YAxis stroke="var(--color-text-muted)" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="var(--color-accent)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Smart insights</h2>
        </div>
        {insights.length === 0 ? (
          <p className="text-sm text-secondary">
            Insights will appear once we accumulate more history.
          </p>
        ) : (
          <ul className="space-y-2">
            {insights.map((insight) => (
              <li
                key={insight}
                className="text-sm text-primary bg-(--color-surface-muted) border border-(--color-border) rounded-xl px-4 py-3"
              >
                {insight}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Report history</h2>
        </div>
        {loadingHistory ? (
          <div className="text-sm text-secondary">Loading history…</div>
        ) : history.length === 0 ? (
          <div className="text-sm text-secondary">
            No exports yet. Generate a report to see it logged here.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((report) => {
              let formattedParams = "—";
              if (report.parameters) {
                try {
                  const parsed = JSON.parse(report.parameters);
                  formattedParams = JSON.stringify(parsed, null, 2);
                } catch {
                  formattedParams = report.parameters;
                }
              }
              return (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-(--color-border) rounded-xl px-4 py-3"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {report.reportType || "Custom report"}
                    </p>
                    <div className="mt-1">
                      <p className="text-xs font-medium text-secondary mb-1">
                        Params:
                      </p>
                      <pre className="text-xs text-secondary bg-surface-alt border border-(--color-border) rounded-lg p-2 overflow-x-auto font-mono">
                        {formattedParams}
                      </pre>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-secondary sm:ml-4">
                    <span>{format(new Date(report.createdAt), "PPpp")}</span>
                    {report.fileName && (
                      <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-semibold text-(--color-text-slate-600)">
                        {report.fileName}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
