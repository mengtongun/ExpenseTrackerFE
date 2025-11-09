interface Props {
  title: string;
  value: string;
  hint?: string;
}

export const SummaryCard: React.FC<Props> = ({ title, value, hint }: Props) => {
  return (
    <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-5 space-y-2">
      <p className="text-sm font-medium text-secondary uppercase tracking-[0.25em]">
        {title}
      </p>
      <p className="text-2xl font-semibold text-primary">{value}</p>
      {hint && <p className="text-xs text-secondary">{hint}</p>}
    </div>
  );
};
