import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TopbarProvider } from "../../context/TopbarContext";
import { Sidebar } from "./Sidebar";
import { Topbar, type DateFilterPreset } from "./Topbar";

interface LayoutProps {
  children: ReactNode;
  onAddExpense?: () => void;
  onSearchChange?: (value: string) => void;
  onDatePresetChange?: (preset: DateFilterPreset) => void;
}

export function Layout(props: LayoutProps) {
  return (
    <TopbarProvider>
      <LayoutFrame {...props} />
    </TopbarProvider>
  );
}

function LayoutFrame({
  children,
  onAddExpense,
  onSearchChange,
  onDatePresetChange,
}: LayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const openMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
  }, []);

  const backgroundStyle = useMemo(
    () =>
      ({
        backgroundImage:
          "radial-gradient(circle at top, color-mix(in srgb, var(--color-primary) 18%, transparent), transparent 60%), radial-gradient(circle at bottom, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 55%)",
      } as const),
    []
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const previousOverflow = body.style.overflow;

    if (mobileSidebarOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = previousOverflow;
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [mobileSidebarOpen]);

  return (
    <div
      className="min-h-screen flex bg-(--color-surface-muted) text-primary"
      style={backgroundStyle}
    >
      <Sidebar isMobileOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Topbar
          onMenuToggle={openMobileSidebar}
          isMenuOpen={mobileSidebarOpen}
          onAddExpense={onAddExpense}
          onSearchChange={onSearchChange}
          onDatePresetChange={onDatePresetChange}
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
