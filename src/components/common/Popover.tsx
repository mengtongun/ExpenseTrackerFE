import { ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  align?: "left" | "right" | "center";
};

export const Popover: React.FC<Props> = ({
  children,
  trigger,
  align = "right",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-48 bg-transparent overflow-hidden z-50 ${
            align === "right"
              ? "right-0"
              : align === "left"
              ? "left-0"
              : "left-1/2 -translate-x-1/2"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
