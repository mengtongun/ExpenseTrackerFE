import { useEffect } from "react";

export interface FormModalProps {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

const maxWidthClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function FormModal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth = "md",
}: FormModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-(--color-overlay) px-4 py-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`bg-surface w-full ${maxWidthClasses[maxWidth]} max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl border border-(--color-border) p-6 space-y-4`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">{title}</h2>
            {description && (
              <p className="text-sm text-secondary">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
        {footer && <div className="pt-2">{footer}</div>}
      </div>
    </div>
  );
}
