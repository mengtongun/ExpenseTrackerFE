import { useTopbar } from "@/context/TopbarContext";
import { useMemo, useState } from "react";
import {
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPlus,
  FiSun,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme";
import { Button } from "../common/Button";
import { Popover } from "../common/Popover";
import { Select } from "../common/Select";
export type DateFilterPreset =
  | "today"
  | "this-week"
  | "this-month"
  | "this-quarter"
  | "this-year";

interface TopbarProps {
  onAddExpense?: () => void;
  onSearchChange?: (value: string) => void;
  onDatePresetChange?: (preset: DateFilterPreset) => void;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export function Topbar({
  onAddExpense,
  onSearchChange,
  onDatePresetChange,
  onMenuToggle,
  isMenuOpen,
}: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [preset, setPreset] = useState<DateFilterPreset>("this-month");
  const { themeName, toggleTheme } = useTheme();
  const isDark = themeName === "dark";
  const { showSearch, showDatePreset, showAddExpense } = useTopbar();
  const presetOptions = useMemo(
    () => [
      { value: "today", label: "Today" },
      { value: "this-week", label: "This Week" },
      { value: "this-month", label: "This Month" },
      { value: "this-quarter", label: "This Quarter" },
      { value: "this-year", label: "This Year" },
    ],
    []
  );

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-(--color-border)">
      <div className="px-4 sm:px-6 py-4 space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-6">
        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 w-full lg:w-auto">
          {onMenuToggle && (
            <Button
              type="button"
              onClick={onMenuToggle}
              variant="secondary"
              className="h-10! w-10! p-0! lg:hidden border! border-(--color-border)! text-secondary! hover:text-primary! hover:border-(--color-primary)!"
              aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isMenuOpen ?? false}
              aria-controls="mobile-navigation"
            >
              {isMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </Button>
          )}

          {showSearch && (
            <div className="relative flex-1 min-w-0">
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);
                  onSearchChange?.(value);
                }}
                placeholder="Search expenses or categories…"
                className="w-full border border-(--color-border) rounded-xl py-2.5 pl-10 pr-4 text-sm text-primary placeholder-(--color-text-secondary) focus:outline-none focus:ring-2 focus:ring-(--color-primary-ring) focus:border-(--color-primary)"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">
                /
              </span>
            </div>
          )}

          {/* Compact actions on mobile/tablet */}
          <div className="flex items-center gap-3 lg:hidden">
            <Button
              onClick={() => onAddExpense?.()}
              variant="primary"
              className="h-10! w-10! p-0!"
              aria-label="Add expense"
            >
              <FiPlus className="h-5 w-5" />
            </Button>
            <Button
              onClick={toggleTheme}
              variant="secondary"
              className="h-10! w-10! p-0! border! border-(--color-border)! text-secondary! hover:text-primary! hover:border-(--color-primary)!"
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </Button>
            <Popover
              trigger={
                <div className="h-10 w-10 rounded-full bg-primary-soft grid place-items-center">
                  <span className="text-(--color-primary) font-bold text-base">
                    {(user?.fullName || user?.username || "U")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
              }
              align="right"
            >
              <Button onClick={handleLogout} variant="danger">
                <FiLogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-4">
          {showDatePreset && (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Select
                label="Date preset"
                hideLabel
                value={preset}
                onChange={(event) => {
                  const value = event.target.value as DateFilterPreset;
                  setPreset(value);
                  onDatePresetChange?.(value);
                }}
                options={presetOptions}
                className="w-full sm:w-48"
                isSearchable={false}
              />
            </div>
          )}

          <div className="hidden lg:flex flex-wrap items-center gap-3">
            {showAddExpense && (
              <Button
                onClick={() => onAddExpense?.()}
                variant="primary"
                className="sm:hidden h-10! w-10! p-0!"
                aria-label="Add expense"
              >
                <FiPlus className="h-5 w-5" />
              </Button>
            )}
            {showAddExpense && (
              <Button
                onClick={() => onAddExpense?.()}
                variant="primary"
                className="hidden sm:inline-flex gap-2 w-full sm:w-auto"
              >
                <span className="inline-block">
                  <FiPlus className="h-5 w-5" />
                </span>
                <span>Add Expense</span>
              </Button>
            )}
            <div className="flex items-center gap-4 w-full sm:w-auto sm:pl-4 sm:border-l sm:border-(--color-border)">
              <div className="hidden sm:flex flex-col justify-center items-end text-right min-w-[120px]">
                <span className="text-base font-semibold text-primary flex items-center gap-2">
                  <FiUser className="h-5 w-5" />
                  {user?.fullName || user?.username || "User"}
                </span>
                <span
                  className="text-xs text-secondary truncate max-w-[140px]"
                  title={user?.email || "Welcome back"}
                >
                  {user?.email || "Welcome back"}
                </span>
              </div>
              <div className="w-full sm:w-auto flex items-center justify-evenly gap-3">
                <Button
                  onClick={toggleTheme}
                  variant="secondary"
                  className="h-10! w-10! p-0! border! border-(--color-border)! text-secondary! hover:text-primary! hover:border-(--color-primary)!"
                  aria-label={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                  title={isDark ? "Light mode" : "Dark mode"}
                >
                  {isDark ? (
                    <FiSun className="h-5 w-5 text-(--color-primary)" />
                  ) : (
                    <FiMoon className="h-5 w-5 text-(--color-primary)" />
                  )}
                </Button>
                <Popover
                  trigger={
                    <div className="h-10 w-10 rounded-full bg-primary-soft grid place-items-center relative group">
                      <span className="text-(--color-primary) font-bold text-base">
                        {(user?.fullName || user?.username || "U")
                          .slice(0, 2)
                          .toUpperCase()}
                      </span>
                      <div className="absolute bottom-0 right-0 mb-1 mr-1 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white group-hover:scale-125 transition"></div>
                    </div>
                  }
                  align="center"
                >
                  <Button onClick={handleLogout} variant="danger">
                    <FiLogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
