import { useEffect, useMemo, useState } from "react";
import { TextInput } from "../common/TextInput";
import { Select } from "../common/Select";
import { Button } from "../common/Button";
import type {
  CategoryDto,
  CreateRecurringExpenseRequest,
  RecurrenceFrequency,
  RecurringExpenseDto,
  UpdateRecurringExpenseRequest,
} from "../../types";

type RecurringFormValues =
  | CreateRecurringExpenseRequest
  | UpdateRecurringExpenseRequest;

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  [1]: "Daily",
  [2]: "Weekly",
  [3]: "Bi-weekly",
  [4]: "Monthly",
  [5]: "Quarterly",
  [6]: "Yearly",
};

interface RecurringExpenseFormProps {
  mode: "create" | "edit";
  categories: CategoryDto[];
  initialValues?: RecurringExpenseDto | null;
  submitting?: boolean;
  onSubmit: (values: RecurringFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function RecurringExpenseForm({
  mode,
  categories,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: RecurringExpenseFormProps) {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [categoryId, setCategoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(4);
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setCategoryId(initialValues.categoryId ?? "");
      setAmount(initialValues.amount.toString());
      setCurrency(initialValues.currency ?? "USD");
      setDescription(initialValues.description ?? "");
      setFrequency(initialValues.frequency);
      setStartDate(initialValues.startDate);
      setEndDate(initialValues.endDate);
      setIsActive(initialValues.isActive);
    } else {
      setCategoryId("");
      setAmount("");
      setCurrency("USD");
      setDescription("");
      setFrequency(4);
      setStartDate(today);
      setEndDate(null);
      setIsActive(true);
    }
    setError(null);
  }, [initialValues, today]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }
    if (!startDate) {
      setError("Start date is required.");
      return;
    }
    if (endDate && endDate < startDate) {
      setError("End date must be after start date.");
      return;
    }

    const payload: RecurringFormValues = {
      categoryId: categoryId ? categoryId : null,
      amount: parsedAmount,
      currency: currency || null,
      description: description.trim() === "" ? null : description.trim(),
      frequency,
      startDate,
      endDate: endDate && endDate.length ? endDate : null,
      ...(mode === "edit" ? { isActive } : {}),
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select
        label="Category"
        value={categoryId}
        onChange={event => setCategoryId(event.target.value)}
        options={[
          { label: "Uncategorized", value: "" },
          ...categories.map(category => ({
            label: category.name ?? "Untitled",
            value: category.id,
          })),
        ]}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={event => setAmount(event.target.value)}
          required
        />
        <TextInput
          label="Currency"
          value={currency}
          onChange={event => setCurrency(event.target.value.toUpperCase())}
          maxLength={3}
          className="uppercase"
        />
      </div>
      <Select
        label="Frequency"
        value={frequency}
        onChange={event =>
          setFrequency(Number(event.target.value) as RecurrenceFrequency)
        }
        options={Object.entries(frequencyLabels).map(([value, label]) => ({
          value,
          label,
        }))}
      />
      <TextInput
        label="Description"
        placeholder="Add optional notes"
        value={description}
        onChange={event => setDescription(event.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-primary">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={event => setStartDate(event.target.value)}
            className="border border-(--color-border) rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary)"
            required
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-primary">End date (optional)</span>
          <input
            type="date"
            value={endDate ?? ""}
            onChange={event => setEndDate(event.target.value || null)}
            className="border border-(--color-border) rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary)"
          />
        </label>
      </div>

      {mode === "edit" && (
        <label className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <input
            type="checkbox"
            checked={isActive}
            onChange={event => setIsActive(event.target.checked)}
            className="h-4 w-4 rounded border-(--color-border-strong) text-(--color-primary) focus:ring-(--color-primary-ring)"
          />
          Active
        </label>
      )}

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
              ? "Update recurring expense"
              : "Create recurring expense"}
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

