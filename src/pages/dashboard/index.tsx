import { Button } from "@/components/common/Button";
import { StatCard } from "@/components/common/StatCard";
import { Table } from "@/components/common/Table";
import { formatCurrency } from "@/utils/format";
import { format } from "date-fns";
import { FiRefreshCcw } from "react-icons/fi";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useDashboard } from "./hook";

export function DashboardPage() {
  const {
    summary,
    monthlyData,
    categoryStats,
    recentExpenses,
    loading,
    topCategory,
    error,
    loadData,
    recentTableColumns,
  } = useDashboard();
  return (
    <section className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Overview</h1>
          <p className="text-sm text-secondary">
            Quick snapshot of your spend, top categories, and recent activity.
          </p>
        </div>
        <Button onClick={() => void loadData()} variant="secondary">
          <FiRefreshCcw className="h-5 w-5 text-(--color-primary)" />
        </Button>
      </header>

      {error && (
        <div className="rounded-xl border border-(--color-warning-border) bg-(--color-warning-soft) text-(--color-warning-strong) px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total spent"
          value={
            loading || !summary
              ? "—"
              : summary.total.toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })
          }
          hint="Current financial period"
        />
        <StatCard
          title="Categories tracked"
          value={
            loading || !summary ? "—" : summary.categoriesTracked.toString()
          }
          hint="Active budget buckets"
        />
        <StatCard
          title="Currencies"
          value={
            loading || !summary ? "—" : summary.currenciesTracked.toString()
          }
          hint="Multi-currency coverage"
        />
        <StatCard
          title="Top category"
          value={loading ? "—" : topCategory ? topCategory[0] : "—"}
          hint={
            topCategory
              ? topCategory[1].toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })
              : undefined
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">
              Monthly trend
            </h2>
            <span className="text-xs font-semibold text-secondary tracking-[0.2em]">
              Last 12 months
            </span>
          </div>
          <div className="h-64">
            {loading ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                Loading…
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-secondary">
                Not enough data to visualize yet.
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

        <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">
              Quick actions
            </h2>
          </div>
          <ul className="space-y-2 text-sm text-primary">
            <li className="rounded-xl border border-(--color-border) px-4 py-3">
              <a href="/expenses">Create a new expense</a>
            </li>
            <li className="rounded-xl border border-(--color-border) px-4 py-3">
              <a href="/reports">View reports</a>
            </li>
            <li className="rounded-xl border border-(--color-border) px-4 py-3">
              <a href="/settings">Configure default currencies and ranges</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            Recent transactions
          </h2>
        </div>
        <div className="hidden sm:block overflow-x-auto scroll-edge-fade">
          <Table
            columns={recentTableColumns}
            data={recentExpenses}
            rowKey={(expense) => expense.id}
            isLoading={loading}
            loadingMessage="Loading recent activity…"
            emptyMessage="No recent expenses recorded yet."
            headClassName="normal-case capitalize tracking-wide"
            rowClassName={() => "hover:bg-(--color-surface-muted)"}
          />
        </div>

        <div className="sm:hidden space-y-3">
          {loading ? (
            <div className="text-sm text-secondary">
              Loading recent activity…
            </div>
          ) : recentExpenses.length === 0 ? (
            <div className="text-sm text-secondary">
              No recent expenses recorded yet.
            </div>
          ) : (
            recentExpenses.map((expense) => (
              <article
                key={expense.id}
                className="rounded-2xl border border-(--color-border) bg-surface shadow-sm p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-[0.25em]">
                      {expense.categoryName || "Uncategorized"}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-1 text-ellipsis whitespace-nowrap">
                      {expense.description || "No description"}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-primary whitespace-nowrap">
                    {formatCurrency(expense.amount, expense.currency)}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-secondary">
                  <span>{format(new Date(expense.expenseDate), "PP")}</span>
                  <span>{expense.isRecurring ? "Recurring" : "One-time"}</span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
