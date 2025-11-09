import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../../api/categories";
import type { HttpError } from "../../api/http";
import type { CategoryDto } from "../../types";

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<CategoryDto | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryDto | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return categories;
    const term = search.toLowerCase();
    return categories.filter((category) => {
      const name = category.name ?? "";
      const description = category.description ?? "";
      return (
        name.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term)
      );
    });
  }, [categories, search]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to load categories.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const resetForm = useCallback(() => {
    setSelected(null);
    setModalOpen(false);
    setSubmitting(false);
  }, []);

  const handleSubmit = async (values: {
    name: string;
    description?: string | null;
  }) => {
    setSubmitting(true);
    setError(null);
    try {
      if (selected) {
        const updated = await updateCategory(selected.id, values);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === updated.id ? updated : category
          )
        );
        setSelected(null);
      } else {
        const created = await createCategory(values);
        setCategories((prev) => [created, ...prev]);
        setSelected(null);
      }
      setModalOpen(false);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Unable to save category. Please try again.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreate = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleEdit = (category: CategoryDto) => {
    setSelected(category);
    setModalOpen(true);
  };

  const handleDeleteClick = (category: CategoryDto) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;
    setError(null);
    try {
      await deleteCategory(categoryToDelete.id);
      setCategories((prev) =>
        prev.filter((item) => item.id !== categoryToDelete.id)
      );
      if (selected?.id === categoryToDelete.id) {
        setSelected(null);
        setModalOpen(false);
      }
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      const httpError = err as HttpError;
      const detail =
        (httpError.body as { detail?: string })?.detail ??
        "Failed to delete category.";
      setError(detail);
    }
  };

  const resetDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  return {
    categories,
    filtered,
    loading,
    error,
    submitting,
    selected,
    search,
    setSearch,
    modalOpen,
    setModalOpen,
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
    loadCategories,
  };
};

