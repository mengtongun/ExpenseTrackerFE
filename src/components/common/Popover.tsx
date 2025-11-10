import {
  autoUpdate,
  flip,
  offset,
  Placement,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  trigger: ReactNode;
  align?: "left" | "right" | "center";
};

const alignToPlacement: Record<"left" | "right" | "center", Placement> = {
  left: "bottom-start",
  right: "bottom-end",
  center: "bottom",
};

export const Popover: React.FC<Props> = ({
  children,
  trigger,
  align = "right",
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: alignToPlacement[align],
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="cursor-pointer"
      >
        {trigger}
      </div>
      {isOpen && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50 bg-transparent overflow-hidden"
        >
          {children}
        </div>
      )}
    </>
  );
};
