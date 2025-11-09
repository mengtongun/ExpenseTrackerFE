import { Select } from "./Select";

export interface PageSizeSelectProps {
  value: number;
  options?: number[];
  onChange: (size: number) => void;
  className?: string;
}

const DEFAULT_OPTIONS = [10, 20, 50];

export function PageSizeSelect({
  value,
  options = DEFAULT_OPTIONS,
  onChange,
  className,
}: PageSizeSelectProps) {
  const selectOptions = options.map((size) => ({
    value: String(size),
    label: String(size),
  }));

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm text-secondary ${className ?? ""}`}>
      <span>Rows per page</span>
      <Select
        label="Rows per page"
        hideLabel
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value))}
        options={selectOptions}
        className="min-w-20"
        isSearchable={false}
      />
    </div>
  );
}

