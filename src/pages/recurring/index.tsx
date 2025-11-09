import { Button } from "@/components/common/Button";
import { IconButton } from "@/components/common/IconButton";
import { Table } from "@/components/common/Table";
import { RecurringExpenseForm } from "@/components/forms/RecurringExpenseForm";
import { AlertModal } from "@/components/modals/AlertModal";
import { FormModal } from "@/components/modals/FormModal";
import { format } from "date-fns";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useRecurring } from "./hook";

export function RecurringPage() {
  const {
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
  } = useRecurring();

  return (
    <section className="space-y-6">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">
            Recurring expenses
          </h1>
          <p className="text-sm text-secondary">
            Automate predictable costs and stay ahead of renewals.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full lg:w-auto">
          <Button
            onClick={handleProcess}
            disabled={processing}
            variant="secondary"
            className="text-(--color-primary)!"
          >
            {processing ? "Processing…" : "Process now"}
          </Button>
          <Button
            onClick={() => {
              setEditing(null);
              setDrawerOpen(true);
            }}
            variant="primary"
          >
            + New recurring expense
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-(--color-warning-border) bg-(--color-warning-soft) text-(--color-warning-strong) px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {info && (
        <div className="rounded-xl border border-(--color-accent-soft) bg-(--color-success-soft) text-(--color-success-strong) px-4 py-3 text-sm">
          {info}
        </div>
      )}

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-(--color-border)">
          <div>
            <h2 className="text-lg font-semibold text-primary">Schedule</h2>
            <p className="text-sm text-secondary">
              {recurringExpenses.length} recurring{" "}
              {recurringExpenses.length === 1 ? "expense" : "expenses"}
            </p>
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto scroll-edge-fade">
          <Table
            columns={tableColumns}
            data={recurringExpenses}
            rowKey={(item) => item.id}
            isLoading={loading}
            loadingMessage="Loading recurring expenses…"
            emptyMessage="No recurring expenses configured yet."
            rowClassName={() => "hover:bg-surface-alt"}
          />
        </div>

        <div className="sm:hidden">
          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-secondary">
              Loading recurring expenses…
            </div>
          ) : recurringExpenses.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-secondary">
              No recurring expenses configured yet.
            </div>
          ) : (
            <div className="px-4 py-4 space-y-3">
              {recurringExpenses.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-(--color-border) bg-surface shadow-sm px-4 py-3 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.25em] text-secondary">
                        {format(new Date(item.nextOccurrence), "PP")}
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {item.description || "No description"}
                      </p>
                      <p className="text-xs text-secondary">
                        {categories.find((cat) => cat.id === item.categoryId)
                          ?.name ?? "Uncategorized"}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">
                      {formatAmount(item.amount)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-secondary">
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent-soft text-(--color-success-strong) font-semibold">
                      {frequencyLabels[item.frequency]}
                    </span>
                    <span>{item.isActive ? "Active" : "Paused"}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <IconButton
                      label={`Edit recurring expense ${item.description ?? ""}`}
                      onClick={() => {
                        setEditing(item);
                        setDrawerOpen(true);
                      }}
                      className="h-10 w-10"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label={`Delete recurring expense ${
                        item.description ?? ""
                      }`}
                      variant="danger"
                      onClick={() => handleDeleteClick(item)}
                      className="h-10 w-10"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <FormModal
        open={drawerOpen}
        title={editing ? "Edit recurring expense" : "Create recurring expense"}
        description={
          editing
            ? "Adjust the schedule and amount as needed."
            : "Schedule automatic expenses to keep your budget accurate."
        }
        onClose={resetForm}
      >
        <RecurringExpenseForm
          mode={editing ? "edit" : "create"}
          categories={categories}
          initialValues={editing}
          submitting={submitting}
          onSubmit={handleSave}
          onCancel={resetForm}
        />
      </FormModal>

      <AlertModal
        open={deleteConfirmOpen}
        title="Delete recurring expense"
        description={`Are you sure you want to delete "${
          recurringToDelete?.description ?? "this recurring expense"
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
