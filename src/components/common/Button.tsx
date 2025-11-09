import classNames from "classnames";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "light"
    | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Button({ children, ...props }: ButtonProps) {
  const variantClass: Record<string, string> = {
    primary: "bg-(--color-accent) text-white hover:bg-(--color-accent-strong)",
    secondary:
      "bg-(--color-secondary) text-primary hover:bg-(--color-secondary-strong) border border-(--color-primary)",
    danger: "bg-(--color-danger) text-white hover:bg-(--color-danger-strong)",
    warning:
      "bg-(--color-warning) text-white hover:bg-(--color-warning-strong)",
    success:
      "bg-(--color-success) text-white hover:bg-(--color-success-strong)",
    info: "bg-(--color-info) text-white hover:bg-(--color-info-strong)",
  };
  const sizeClass: Record<string, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-sm px-5 py-2.5",
  };
  const className = classNames(
    "inline-flex items-center justify-center rounded-xl text-white text-sm font-semibold px-4 py-2 transition w-full sm:w-auto pointer-events-auto cursor-pointer",
    variantClass[props.variant ?? "primary"],
    sizeClass[props.size ?? "md"],
    props.className
  );
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
