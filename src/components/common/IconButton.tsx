import type { ButtonHTMLAttributes, ReactNode } from "react";

type IconButtonVariant = "primary" | "danger" | "neutral";

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: IconButtonVariant;
  children: ReactNode;
}

const baseClasses =
  "inline-flex items-center justify-center h-9 w-9 rounded-full border transition focus:outline-none focus:ring-2 focus:ring-offset-2";

const variantClasses: Record<IconButtonVariant, string> = {
  primary:
    "border-(--color-border) text-(--color-primary) hover:border-(--color-primary) hover:bg-primary-soft focus:ring-(--color-primary-ring)",
  danger:
    "border-(--color-danger-border) text-(--color-danger) hover:border-(--color-danger-strong) hover:bg-(--color-danger-soft) focus:ring-(--color-danger-ring)",
  neutral:
    "border-(--color-border) text-secondary hover:border-(--color-text-secondary) hover:bg-surface-alt focus:ring-[rgba(107,114,128,0.2)]",
};

export function IconButton({
  label,
  variant = "primary",
  className = "",
  children,
  type,
  ...props
}: IconButtonProps) {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  return (
    <button
      type={type ?? "button"}
      {...props}
      className={classes}
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
      {children}
    </button>
  );
}

