import type { InputHTMLAttributes, ReactNode } from "react";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
}

export function TextInput({
  label,
  description,
  error,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <label className={`flex flex-col gap-2 text-sm ${className}`}>
      <span className="font-medium text-primary">{label}</span>
      <input
        {...props}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm text-primary placeholder-(--color-text-muted) focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary) transition ${
          error ? "border-(--color-danger)" : "border-(--color-border)"
        } ${className}`}
      />
      {description && !error && (
        <span className="text-xs text-secondary">{description}</span>
      )}
      {error && <span className="text-xs text-(--color-danger)">{error}</span>}
    </label>
  );
}
