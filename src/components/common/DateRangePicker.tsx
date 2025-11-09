import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
  startOfYear,
  subMonths,
} from "date-fns";
import { forwardRef, type ReactNode, useState } from "react";
import DatePicker from "react-datepicker";
import { FiCalendar } from "react-icons/fi";

import "../../styles/datepicker.css";

export interface DateRange {
  startDate: string | null;
  endDate: string | null;
}

interface DateRangePickerProps {
  label?: ReactNode;
  value: DateRange;
  onChange: (value: DateRange) => void;
  showPresets?: boolean;
  showClearButton?: boolean;
  disabled?: boolean;
  error?: ReactNode;
  description?: ReactNode;
}

interface DatePreset {
  label: string;
  getRange: () => DateRange;
}

const DATE_PRESETS: DatePreset[] = [
  {
    label: "Today",
    getRange: () => {
      const today = startOfToday();
      const dateStr = format(today, "yyyy-MM-dd");
      return { startDate: dateStr, endDate: dateStr };
    },
  },
  {
    label: "This Week",
    getRange: () => {
      const start = startOfWeek(startOfToday(), { weekStartsOn: 1 });
      const end = endOfWeek(startOfToday(), { weekStartsOn: 1 });
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const start = startOfMonth(startOfToday());
      const end = endOfMonth(startOfToday());
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "Last Month",
    getRange: () => {
      const lastMonth = subMonths(startOfToday(), 1);
      const start = startOfMonth(lastMonth);
      const end = endOfMonth(lastMonth);
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
    },
  },
  {
    label: "This Year",
    getRange: () => {
      const start = startOfYear(startOfToday());
      const end = endOfYear(startOfToday());
      return {
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      };
    },
  },
];

export function DateRangePicker({
  label,
  value,
  onChange,
  showPresets = false,
  showClearButton = true,
  disabled = false,
  error,
  description,
}: DateRangePickerProps) {
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isEndOpen, setIsEndOpen] = useState(false);

  const startDate = value.startDate ? parseISO(value.startDate) : null;
  const endDate = value.endDate ? parseISO(value.endDate) : null;

  const hasValue = value.startDate || value.endDate;

  const handleClear = () => {
    onChange({ startDate: null, endDate: null });
  };

  const handlePresetClick = (preset: DatePreset) => {
    onChange(preset.getRange());
  };

  return (
    <div className="flex flex-col gap-2 text-sm w-full">
      {label && (
        <div className="font-medium text-primary flex items-center justify-between gap-2">
          <span>{label}</span>
          {showClearButton && hasValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) rounded px-1.5 py-0.5"
              aria-label="Clear date range"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-0.5 w-full">
          <div className="order-1 sm:order-0 flex-1 relative min-w-0 w-full">
            <DatePicker
              className="w-full"
              selected={startDate}
              onChange={(date) => {
                onChange({
                  startDate: date ? format(date, "yyyy-MM-dd") : null,
                  endDate: value.endDate,
                });
                setIsStartOpen(false);
              }}
              onCalendarOpen={() => setIsStartOpen(true)}
              onCalendarClose={() => setIsStartOpen(false)}
              open={isStartOpen}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="MMM d, yyyy"
              placeholderText="Start date"
              disabled={disabled}
              customInput={
                <DateInputDisplay
                  placeholder="Start date"
                  value={startDate ? format(startDate, "MMM d, yyyy") : ""}
                  isActive={isStartOpen}
                  hasValue={!!startDate}
                  disabled={disabled}
                />
              }
              popperPlacement="bottom-start"
            />
          </div>
          <span className="order-2 text-secondary text-xs text-center sm:order-0 sm:text-sm sm:px-0.5 sm:w-auto font-medium shrink-0">
            -
          </span>
          <div className="order-3 sm:order-0 flex-1 relative min-w-0 w-full">
            <DatePicker
              className="w-full"
              selected={endDate}
              onChange={(date) => {
                onChange({
                  startDate: value.startDate,
                  endDate: date ? format(date, "yyyy-MM-dd") : null,
                });
                setIsEndOpen(false);
              }}
              onCalendarOpen={() => setIsEndOpen(true)}
              onCalendarClose={() => setIsEndOpen(false)}
              open={isEndOpen}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined}
              dateFormat="MMM d, yyyy"
              placeholderText="End date"
              disabled={disabled}
              customInput={
                <DateInputDisplay
                  placeholder="End date"
                  value={endDate ? format(endDate, "MMM d, yyyy") : ""}
                  isActive={isEndOpen}
                  hasValue={!!endDate}
                  disabled={disabled}
                />
              }
              popperPlacement="bottom-start"
            />
          </div>
        </div>

        {showPresets && (
          <div className="flex flex-wrap gap-2 pt-1">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePresetClick(preset)}
                disabled={disabled}
                className="px-3 py-1.5 text-xs font-medium text-secondary bg-surface-alt hover:bg-primary-soft hover:text-primary border border-(--color-border) rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring)"
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        {description && !error && (
          <span className="text-xs text-secondary">{description}</span>
        )}
        {error && (
          <span className="text-xs text-(--color-danger) flex items-center gap-1">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

interface DateInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  isActive?: boolean;
  hasValue?: boolean;
  disabled?: boolean;
}

const DateInputDisplay = forwardRef<HTMLButtonElement, DateInputProps>(
  ({ value, onClick, placeholder, isActive, hasValue, disabled }, ref) => {
    return (
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        disabled={disabled}
        aria-label={placeholder}
        className={`flex items-center w-full justify-between sm:justify-start gap-2.5 border rounded-xl px-3.5 py-2.5 text-sm bg-surface shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) ${
          disabled
            ? "opacity-50 cursor-not-allowed border-(--color-border)"
            : isActive
            ? "border-(--color-primary) shadow-md ring-2 ring-(--color-primary-ring)"
            : hasValue
            ? "border-(--color-border-strong) hover:border-(--color-primary) hover:shadow-md"
            : "border-(--color-border) hover:border-(--color-border-strong) hover:shadow-md"
        }`}
      >
        <FiCalendar
          className={`h-4 w-4 shrink-0 transition-colors ${
            isActive || hasValue
              ? "text-(--color-primary)"
              : "text-(--color-text-muted)"
          }`}
        />
        <span
          className={`flex-1 text-left ${
            value
              ? "text-(--color-text-primary) font-medium"
              : "text-(--color-text-muted)"
          }`}
        >
          {value || placeholder || ""}
        </span>
      </button>
    );
  }
);
