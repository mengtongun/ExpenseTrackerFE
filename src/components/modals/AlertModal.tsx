import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "../common/Button";

export interface AlertModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const variantStyles = {
  danger: {
    confirm: "bg-(--color-danger) hover:bg-(--color-danger-strong) text-white",
    border: "border-(--color-danger-border)",
    bg: "bg-(--color-danger-soft)",
  },
  warning: {
    confirm:
      "bg-(--color-warning) hover:bg-(--color-warning-strong) text-white",
    border: "border-(--color-warning-border)",
    bg: "bg-(--color-warning-soft)",
  },
  info: {
    confirm:
      "bg-(--color-primary) hover:bg-(--color-primary-strong) text-white",
    border: "border-(--color-primary-border)",
    bg: "bg-(--color-primary-soft)",
  },
};

export function AlertModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: AlertModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onCancel();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [open, onCancel]);

  if (!open) return null;

  const styles = variantStyles[variant];

  const handleConfirm = async () => {
    await onConfirm();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-overlay) px-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className={`bg-surface w-full max-w-md rounded-2xl shadow-2xl border ${styles.border} p-6 space-y-4`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-semibold text-primary">{title}</h2>
          {description && (
            <p className="text-sm text-secondary mt-2">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button onClick={onCancel} variant="secondary">
            {cancelLabel}
          </Button>
          <Button onClick={handleConfirm} className={styles.confirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
