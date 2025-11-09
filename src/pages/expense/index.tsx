import { Button } from "@/components/common/Button";
import { PageSizeSelect } from "@/components/common/PageSizeSelect";
import { Pagination } from "@/components/common/Pagination";
import { Table } from "@/components/common/Table";
import { AlertModal } from "@/components/modals/AlertModal";
import { FormModal } from "@/components/modals/FormModal";
import { format } from "date-fns";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { DateRangePicker } from "../../components/common/DateRangePicker";
import { IconButton } from "../../components/common/IconButton";
import { Select } from "../../components/common/Select";
import { ExpenseForm } from "../../components/forms/ExpenseForm";
import { useExpense } from "./hook";

export function ExpensesPage() {
  const {
    categories,
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
    resetForm,
    handleSave,
    handlePageChange,
    handlePageSizeChange,
  } = useExpense();

  return (
    <section className="space-y-6">
      <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Expenses</h1>
          <p className="text-sm text-secondary">
            Track, filter, and manage your transactions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full xl:w-auto">
          <DateRangePicker
            label="Date range"
            value={filters.dateRange}
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                dateRange: value,
                pageNumber: 1,
              }))
            }
          />
          <div className="flex flex-col sm:flex-row gap-3 w-full items-end sm:justify-between">
            <div className="w-full sm:w-auto">
              <Select
                label="Category"
                value={filters.categoryId}
                onChange={(event) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: event.target.value,
                    pageNumber: 1,
                  }))
                }
                options={[
                  { label: "All categories", value: "" },
                  ...categories.map((category) => ({
                    label: category.name ?? "Untitled",
                    value: category.id,
                  })),
                ]}
                className="w-full sm:w-48 text-primary"
              />
            </div>
            <div className="w-full sm:w-auto flex flex-col gap-2">
              <span className="text-sm font-medium invisible">Actions</span>
              <Button
                onClick={() => {
                  setEditingExpense(null);
                  setDrawerOpen(true);
                }}
                variant="primary"
                className="w-full sm:w-auto"
              >
                <FiPlus className="h-5 w-5 text-(--color-secondary)" />
                <span>Add Expense</span>
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

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-(--color-border)">
          <div>
            <h2 className="text-lg font-semibold text-primary">Transactions</h2>
            <p className="text-sm text-secondary">
              {totalCount} {totalCount === 1 ? "transaction" : "transactions"}
            </p>
          </div>
          <PageSizeSelect
            value={filters.pageSize}
            onChange={handlePageSizeChange}
            className="w-full sm:w-auto justify-between sm:justify-end"
          />
        </div>

        <div className="hidden sm:block overflow-x-auto scroll-edge-fade">
          <Table
            columns={tableColumns}
            data={expenses}
            rowKey={(expense) => expense.id}
            isLoading={loading}
            loadingMessage="Loading expenses…"
            emptyMessage="No expenses found for the selected filters."
            rowClassName={() => "hover:bg-surface-alt"}
          />
        </div>

        <div className="sm:hidden">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-secondary">
              Loading expenses…
            </div>
          ) : expenses.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-secondary">
              No expenses found for the selected filters.
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              {expenses.map((expense) => (
                <article
                  key={expense.id}
                  className="rounded-2xl border border-(--color-border) bg-surface shadow-sm px-4 py-3 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                        {format(new Date(expense.expenseDate), "PP")}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {expense.description || "No description"}
                      </p>
                      <p className="text-xs text-secondary">
                        {expense.categoryName || "Uncategorized"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatAmount(expense.amount, expense.currency)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-soft text-(--color-primary) font-semibold">
                      {expense.isRecurring ? "Recurring" : "One-time"}
                    </span>
                    <div className="flex items-center gap-2">
                      <IconButton
                        label={`Edit expense ${expense.description ?? ""}`}
                        onClick={() => {
                          setEditingExpense(expense);
                          setDrawerOpen(true);
                        }}
                        className="h-10 w-10"
                      >
                        <FiEdit2 className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        label={`Delete expense ${expense.description ?? ""}`}
                        variant="danger"
                        onClick={() => handleDeleteClick(expense)}
                        className="h-10 w-10"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-(--color-border)">
          <Pagination
            page={pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <FormModal
        open={drawerOpen}
        title={editingExpense ? "Edit expense" : "Add expense"}
        description={
          editingExpense
            ? "Modify the details of this transaction."
            : "Log a new expense to keep your records up to date."
        }
        onClose={resetForm}
      >
        <ExpenseForm
          mode={editingExpense ? "edit" : "create"}
          categories={categories}
          initialValues={editingExpense}
          submitting={submitting}
          onSubmit={handleSave}
          onCancel={resetForm}
        />
      </FormModal>

      <AlertModal
        open={deleteConfirmOpen}
        title="Delete expense"
        description={`Are you sure you want to delete "${
          expenseToDelete?.description ?? "this expense"
        }"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={resetDeleteConfirm}
      />
    </section>
  );
}
