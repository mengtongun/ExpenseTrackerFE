import { type ReactNode } from "react";
import {
  FiCreditCard,
  FiHome,
  FiPieChart,
  FiRefreshCw,
  FiSliders,
  FiTag,
  FiUser,
  FiX,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { Button } from "../common/Button";

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

const navItems: Array<{ to: string; label: string; icon: ReactNode }> = [
  { to: "/", label: "Dashboard", icon: <FiHome className="h-4 w-4" /> },
  {
    to: "/expenses",
    label: "Expenses",
    icon: <FiCreditCard className="h-4 w-4" />,
  },
  {
    to: "/categories",
    label: "Categories",
    icon: <FiTag className="h-4 w-4" />,
  },
  {
    to: "/reports",
    label: "Reports",
    icon: <FiPieChart className="h-4 w-4" />,
  },
  {
    to: "/recurring",
    label: "Recurring",
    icon: <FiRefreshCw className="h-4 w-4" />,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: <FiSliders className="h-4 w-4" />,
  },
  { to: "/profile", label: "Profile", icon: <FiUser className="h-4 w-4" /> },
];

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const handleNavigate = () => {
    if (isMobileOpen) {
      onClose();
    }
  };

  const sidebarContent = (
    <>
      <div className="h-18 px-6 flex items-center justify-between border-b border-(--color-border)">
        <div className="flex items-center gap-3">
          <p className="font-semibold text-(--color-primary) leading-tight">
            Finora
          </p>
          <p className="text-sm text-(--color-secondary)">
            Track smarter.
            <br /> Spend wiser.
          </p>
        </div>

        <Button
          type="button"
          onClick={onClose}
          variant="light"
          className="lg:hidden h-9! w-9! p-0! text-secondary! hover:text-primary!"
          aria-label="Close navigation"
        >
          <FiX className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto lg:overflow-visible">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            onClick={handleNavigate}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-soft text-(--color-primary)"
                  : "text-secondary hover:bg-surface-alt hover:text-primary",
              ].join(" ")
            }
          >
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-transparent">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* <div className="px-4 py-6 border-t border-(--color-border)">
        <div className="flex items-center gap-3 px-4 py-3 bg-(--color-surface-muted) rounded-xl">
          <div className="h-10 w-10 rounded-full bg-primary-soft grid place-items-center text-(--color-primary) font-semibold">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">
              {user?.fullName || user?.username || "User"}
            </p>
            <p className="text-xs text-secondary truncate">
              {user?.email || "Signed in"}
            </p>
          </div>
          <Button
            onClick={() => {
              void logout();
            }}
            variant="danger"
            className="text-xs! font-semibold! text-(--color-danger)! hover:text-(--color-danger-strong)! bg-transparent! border-0! shadow-none! p-0! h-auto! w-auto!"
          >
            Logout
          </Button>
        </div>
      </div> */}
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:flex-col lg:w-64 bg-surface border-r border-(--color-border) lg:overflow-hidden">
        {sidebarContent}
      </aside>

      <div
        className={`lg:hidden fixed inset-0 z-50 transition ${
          isMobileOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <div
          className={`absolute inset-0 bg-(--color-overlay) transition-opacity duration-200 ${
            isMobileOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={onClose}
        />

        <aside
          id="mobile-navigation"
          className={`absolute left-0 top-0 h-full w-64 max-w-[85vw] bg-surface border-r border-(--color-border) shadow-xl flex flex-col transform transition-transform duration-200 ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
