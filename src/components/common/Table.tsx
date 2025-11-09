import type { ReactNode } from "react";

type Alignment = "left" | "center" | "right";

export interface TableColumn<TItem> {
  header: ReactNode;
  accessor?: keyof TItem;
  render?: (item: TItem, index: number) => ReactNode;
  align?: Alignment;
  headerClassName?: string;
  cellClassName?: string;
}

export interface TableProps<TItem> {
  columns: Array<TableColumn<TItem>>;
  data: TItem[];
  rowKey: (item: TItem, index: number) => React.Key;
  isLoading?: boolean;
  loadingMessage?: ReactNode;
  emptyMessage?: ReactNode;
  className?: string;
  headClassName?: string;
  bodyClassName?: string;
  rowClassName?: (item: TItem, index: number) => string | undefined;
}

const alignmentClassMap: Record<Alignment, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function Table<TItem>({
  columns,
  data,
  rowKey,
  isLoading = false,
  loadingMessage = "Loading…",
  emptyMessage = "No records found.",
  className,
  headClassName,
  bodyClassName,
  rowClassName,
}: TableProps<TItem>) {
  const totalColumns = Math.max(columns.length, 1);

  return (
    <table
      className={classNames(
        "min-w-full divide-y divide-(--color-surface-alt) text-sm",
        className
      )}
    >
      <thead
        className={classNames(
          "bg-(--color-surface-muted) text-secondary capitalize tracking-wide text-xs font-semibold",
          headClassName
        )}
      >
        <tr>
          {columns.map((column, index) => {
            const alignClass = alignmentClassMap[column.align ?? "left"];
            return (
              <th
                key={index}
                scope="col"
                className={classNames(
                  "px-6 py-3",
                  alignClass,
                  column.headerClassName
                )}
              >
                {column.header}
              </th>
            );
          })}
          {columns.length === 0 && <th className="px-6 py-3 text-left" />}
        </tr>
      </thead>
      <tbody
        className={classNames(
          "divide-y divide-(--color-surface-alt) text-primary",
          bodyClassName
        )}
      >
        {isLoading ? (
          <tr>
            <td
              colSpan={totalColumns}
              className="px-6 py-12 text-center text-sm text-secondary"
            >
              {loadingMessage}
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan={totalColumns}
              className="px-6 py-12 text-center text-sm text-secondary"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr
              key={rowKey(item, index)}
              className={rowClassName?.(item, index)}
            >
              {columns.map((column, columnIndex) => {
                const alignClass = alignmentClassMap[column.align ?? "left"];
                const content =
                  column.render?.(item, index) ??
                  (column.accessor
                    ? (item[column.accessor] as ReactNode)
                    : null);
                return (
                  <td
                    key={columnIndex}
                    className={classNames(
                      "px-6 py-4",
                      alignClass,
                      column.cellClassName
                    )}
                  >
                    {content}
                  </td>
                );
              })}
              {columns.length === 0 && <td className="px-6 py-4" />}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
