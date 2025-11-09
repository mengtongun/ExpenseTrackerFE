import { CURRENCY_OPTIONS } from "@/constants/currency";
import { formatDate } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { DatePicker } from "react-datepicker";
import type {
  CategoryDto,
  CreateExpenseRequest,
  ExpenseDto,
  UpdateExpenseRequest,
} from "../../types";
import { Button } from "../common/Button";
import { Select } from "../common/Select";
import { TextInput } from "../common/TextInput";

type ExpenseFormValues = CreateExpenseRequest | UpdateExpenseRequest;

interface ExpenseFormProps {
  mode: "create" | "edit";
  categories: CategoryDto[];
  initialValues?: ExpenseDto | null;
  submitting?: boolean;
  onSubmit: (values: ExpenseFormValues) => Promise<void> | void;
  onCancel?: () => void;
}

export function ExpenseForm({
  mode,
  categories,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: ExpenseFormProps) {
  const today = useMemo(() => new Date(), []);

  const [categoryId, setCategoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [currency, setCurrency] = useState<string>("USD");
  const [description, setDescription] = useState<string>("");
  const [expenseDate, setExpenseDate] = useState<Date>(today);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setCategoryId(initialValues.categoryId ?? "");
      setAmount(initialValues.amount.toString());
      setCurrency(initialValues.currency ?? "USD");
      setDescription(initialValues.description ?? "");
      setExpenseDate(new Date(initialValues.expenseDate));
      setIsRecurring(initialValues.isRecurring ?? false);
    } else {
      setCategoryId("");
      setAmount("");
      setCurrency("USD");
      setDescription("");
      setExpenseDate(new Date());
      setIsRecurring(false);
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

    const payload: ExpenseFormValues = {
      categoryId: categoryId ? categoryId : null,
      amount: parsedAmount,
      currency: currency || null,
      description: description.trim() === "" ? null : description.trim(),
      expenseDate: formatDate(expenseDate, "yyyy-MM-dd"),
      isRecurring,
    };

    await onSubmit(payload);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select
        label="Category"
        value={categoryId}
        onChange={(event) => setCategoryId(event.target.value)}
        options={[
          { label: "Uncategorized", value: "" },
          ...categories.map((category) => ({
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
          onChange={(event) => setAmount(event.target.value)}
          required
        />
        <Select
          label="Currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
          options={CURRENCY_OPTIONS}
        />
      </div>
      <TextInput
        label="Description"
        placeholder="Add optional notes"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <label className="flex flex-col gap-2 text-sm flex-1 w-full">
          <span className="font-medium text-primary">Expense date</span>
          <DatePicker
            name="expenseDate"
            className="border border-(--color-border) rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary)"
            selected={expenseDate}
            maxDate={today}
            onChange={(date) => setExpenseDate(date ?? today)}
            required
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(event) => setIsRecurring(event.target.checked)}
            className="h-4 w-4 rounded border-(--color-border-strong) text-(--color-primary) focus:ring-(--color-primary-ring)"
          />
          Recurring
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-(--color-danger-border) bg-(--color-danger-soft) text-(--color-danger-strong) text-sm px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
        <Button type="submit" disabled={submitting} variant="primary">
          {submitting
            ? mode === "edit"
              ? "Updating…"
              : "Saving…"
            : mode === "edit"
            ? "Update expense"
            : "Save expense"}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
