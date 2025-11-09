import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface TopbarContextValue {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showDatePreset: boolean;
  setShowDatePreset: (show: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  showAddExpense: boolean;
  setShowAddExpense: (show: boolean) => void;
}

const TopbarContext = createContext<TopbarContextValue | undefined>(undefined);

export interface TopbarProviderProps {
  children: ReactNode;
  defaultVisible?: boolean;
}

export function TopbarProvider({
  children,
  defaultVisible = true,
}: TopbarProviderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showDatePreset, setShowDatePreset] = useState(false);
  const [search, setSearch] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);

  return (
    <TopbarContext.Provider
      value={{
        showSearch,
        setShowSearch,
        showDatePreset,
        setShowDatePreset,
        search,
        setSearch,
        showAddExpense,
        setShowAddExpense,
      }}
    >
      {children}
    </TopbarContext.Provider>
  );
}

export function useTopbar() {
  const context = useContext(TopbarContext);

  if (!context) {
    throw new Error("useTopbar must be used within a TopbarProvider");
  }

  return context;
}
