import {
  useCallback,
  useId,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
} from "react";
import ReactSelect, {
  type GroupBase,
  type SingleValue,
  type StylesConfig,
} from "react-select";

export interface SelectOption {
  label: ReactNode;
  value: string | number;
}

export interface SelectProps {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  options: SelectOption[];
  value?: string | number | null;
  defaultValue?: string | number | null;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: FocusEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  name?: string;
  className?: string;
  isDisabled?: boolean;
  isClearable?: boolean;
  isSearchable?: boolean;
  hideLabel?: boolean;
  labelClassName?: string;
}

type SelectStyles = StylesConfig<SelectOption, false>;

function createSelectStyles(hasError: boolean): SelectStyles {
  return {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "var(--color-surface)",
      borderColor: hasError
        ? "var(--color-danger)"
        : state.isFocused
        ? "var(--color-primary)"
        : "var(--color-border)",
      boxShadow: state.isFocused
        ? "0 0 0 2px var(--color-primary-ring)"
        : "none",
      borderRadius: "0.75rem",
      minHeight: "42px",
      paddingLeft: "0.25rem",
      paddingRight: "0.25rem",
      transition: "border-color 150ms ease, box-shadow 150ms ease",
      cursor: "pointer",
      ":hover": {
        borderColor: hasError ? "var(--color-danger)" : "var(--color-primary)",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "2px 6px",
      gap: "4px",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--color-text-primary)",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "var(--color-text-secondary)",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "var(--color-text-primary)",
      fontSize: "0.875rem",
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused
        ? "var(--color-primary)"
        : "var(--color-text-secondary)",
      paddingRight: "0.5rem",
      ":hover": {
        color: "var(--color-primary)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "var(--color-surface)",
      border: "1px solid var(--color-border)",
      boxShadow: "var(--shadow-card)",
      borderRadius: "0.75rem",
      overflow: "hidden",
      marginTop: "0.25rem",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "0.5rem 0",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "var(--color-primary-soft)"
        : state.isFocused
        ? "var(--color-surface-highlight)"
        : "transparent",
      color: state.isSelected
        ? "var(--color-primary)"
        : "var(--color-text-primary)",
      cursor: "pointer",
      fontSize: "0.875rem",
      padding: "0.5rem 1rem",
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      fontSize: "0.875rem",
      color: "var(--color-text-secondary)",
      padding: "0.5rem 1rem",
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };
}

function toSyntheticChangeEvent(
  value: string,
  name?: string
): ChangeEvent<HTMLSelectElement> {
  return {
    target: { value, name } as unknown as EventTarget & HTMLSelectElement,
    currentTarget: {
      value,
      name,
    } as unknown as EventTarget & HTMLSelectElement,
  } as ChangeEvent<HTMLSelectElement>;
}

function toSyntheticBlurEvent(
  value: string,
  name?: string
): FocusEvent<HTMLSelectElement> {
  return {
    target: { value, name } as unknown as EventTarget & HTMLSelectElement,
    currentTarget: {
      value,
      name,
    } as unknown as EventTarget & HTMLSelectElement,
    relatedTarget: null,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    preventDefault() {
      return;
    },
    stopPropagation() {
      return;
    },
    persist() {
      return;
    },
    isDefaultPrevented: () => false,
    isPropagationStopped: () => false,
    timeStamp: Date.now(),
    type: "blur",
  } as FocusEvent<HTMLSelectElement>;
}

export function Select({
  label,
  description,
  error,
  options,
  value,
  defaultValue,
  onChange,
  onBlur,
  placeholder,
  name,
  className = "",
  isDisabled,
  isClearable = false,
  isSearchable = false,
  hideLabel = false,
  labelClassName = "",
}: SelectProps) {
  const inputId = useId();
  const hasError = Boolean(error);

  const resolvedDefault = useMemo(
    () =>
      defaultValue === null || defaultValue === undefined
        ? null
        : options.find(
            (option) => String(option.value) === String(defaultValue)
          ) ?? null,
    [defaultValue, options]
  );

  const selectedOption = useMemo(
    () =>
      value === null || value === undefined
        ? null
        : options.find((option) => String(option.value) === String(value)) ??
          null,
    [options, value]
  );

  const styles = useMemo(() => createSelectStyles(hasError), [hasError]);

  const menuPortalTarget =
    typeof document === "undefined" ? undefined : document.body;

  const handleChange = useCallback(
    (selected: SingleValue<SelectOption>) => {
      if (!onChange) return;
      const nextValue =
        selected?.value === undefined || selected?.value === null
          ? ""
          : String(selected.value);
      onChange(toSyntheticChangeEvent(nextValue, name));
    },
    [name, onChange]
  );

  const handleBlur = useCallback(() => {
    if (!onBlur) return;
    const currentValue =
      selectedOption?.value === undefined || selectedOption?.value === null
        ? ""
        : String(selectedOption.value);
    onBlur(toSyntheticBlurEvent(currentValue, name));
  }, [name, onBlur, selectedOption]);

  return (
    <label
      className={`flex flex-col gap-2 text-sm ${className}`}
      htmlFor={inputId}
    >
      <span
        className={`font-medium text-primary ${
          hideLabel ? "sr-only" : ""
        } ${labelClassName}`}
      >
        {label}
      </span>
      <ReactSelect<SelectOption, false, GroupBase<SelectOption>>
        inputId={inputId}
        instanceId={inputId}
        options={options}
        value={selectedOption}
        defaultValue={resolvedDefault}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name={name}
        styles={styles}
        menuPortalTarget={menuPortalTarget}
        formatOptionLabel={(option) => option.label}
        getOptionLabel={(option) =>
          typeof option.label === "string"
            ? option.label
            : typeof option.label === "number"
            ? option.label.toString()
            : ""
        }
        getOptionValue={(option) => String(option.value)}
        classNamePrefix="finora-select"
      />
      {description && !error && (
        <span className="text-xs text-secondary">{description}</span>
      )}
      {error && <span className="text-xs text-(--color-danger)">{error}</span>}
    </label>
  );
}
