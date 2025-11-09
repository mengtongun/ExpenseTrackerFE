import { useTopbar } from "@/context/TopbarContext";
import { useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Button } from "../../components/common/Button";
import { IconButton } from "../../components/common/IconButton";
import { CategoryForm } from "../../components/forms/CategoryForm";
import { AlertModal } from "../../components/modals/AlertModal";
import { FormModal } from "../../components/modals/FormModal";
import { useCategories } from "./hook";

export function CategoriesPage() {
  const { setShowSearch } = useTopbar();
  const {
    categories,
    filtered,
    loading,
    error,
    submitting,
    selected,
    search,
    setSearch,
    modalOpen,
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    categoryToDelete,
    resetForm,
    handleSubmit,
    handleCreate,
    handleEdit,
    handleDeleteClick,
    handleDeleteConfirm,
    resetDeleteConfirm,
  } = useCategories();

  useEffect(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  return (
    <section className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary">Categories</h1>
          <p className="text-sm text-secondary">
            Organize expenses with custom categories.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <input
            type="search"
            placeholder="Search categories…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="border border-(--color-border) rounded-xl px-3 py-2 text-sm text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary) w-full sm:w-auto"
          />
          <Button onClick={handleCreate} variant="primary">
            + New Category
          </Button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-(--color-warning-border) bg-(--color-warning-soft) text-(--color-warning-strong) px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-surface border border-(--color-border) rounded-2xl shadow-card">
        <div className="px-6 py-5 border-b border-(--color-border) flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">Category list</h2>
          <span className="text-xs font-semibold text-secondary uppercase tracking-[0.2em]">
            {categories.length} total
          </span>
        </div>
        <div className="divide-y divide-(--color-surface-alt)">
          {loading ? (
            <div className="p-6 text-sm text-secondary">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-secondary">
              No categories found. Create your first one to get started.
            </div>
          ) : (
            filtered.map((category) => (
              <div
                key={category.id}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-surface-alt"
              >
                <div className="w-full sm:flex-1">
                  <p className="font-medium text-primary">
                    {category.name || "Untitled"}
                  </p>
                  {category.description && (
                    <p className="text-sm text-secondary">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
                  <IconButton
                    label={`Edit category ${category.name ?? ""}`}
                    onClick={() => handleEdit(category)}
                    className="h-10 w-10 sm:h-9 sm:w-9"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={`Delete category ${category.name ?? ""}`}
                    variant="danger"
                    onClick={() => handleDeleteClick(category)}
                    className="h-10 w-10 sm:h-9 sm:w-9"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <FormModal
        open={modalOpen}
        title={selected ? "Edit category" : "Create category"}
        description={
          selected
            ? "Update the category details below."
            : "Set up a new category that matches your spending habits."
        }
        onClose={resetForm}
      >
        <CategoryForm
          mode={selected ? "edit" : "create"}
          initialValues={selected}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </FormModal>

      <AlertModal
        open={deleteConfirmOpen}
        title="Delete category"
        description={`Are you sure you want to delete "${
          categoryToDelete?.name ?? "this category"
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
