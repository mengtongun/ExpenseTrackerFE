import { useEffect, useState } from "react";
import { TextInput } from "../common/TextInput";
import { Button } from "../common/Button";
import type {
  CategoryDto,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../../types";

type CategoryFormValues = CreateCategoryRequest | UpdateCategoryRequest;

interface CategoryFormProps {
  mode: "create" | "edit";
  initialValues?: CategoryDto | null;
  submitting?: boolean;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function CategoryForm({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name ?? "");
      setDescription(initialValues.description ?? "");
    } else {
      setName("");
      setDescription("");
    }
    setError(null);
  }, [initialValues]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError(null);

    await onSubmit({
      name: name.trim(),
      description: description.trim() === "" ? null : description.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TextInput
        label="Category name"
        placeholder="e.g. Travel, Utilities"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />
      <TextInput
        label="Description"
        placeholder="Optional short summary"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      {error && (
        <div className="rounded-xl border border-(--color-danger-border) bg-(--color-danger-soft) text-(--color-danger-strong) text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
        <Button
          type="submit"
          disabled={submitting}
          variant="primary"
        >
          {submitting
            ? mode === "edit"
              ? "Updating…"
              : "Creating…"
            : mode === "edit"
            ? "Update category"
            : "Create category"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
