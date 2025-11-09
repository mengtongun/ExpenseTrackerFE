type Props = {
  title: string;
  value: string;
  hint?: string;
};

export const StatCard: React.FC<Props> = ({ title, value, hint }: Props) => {
  return (
    <div className="bg-surface border border-(--color-border) rounded-2xl shadow-sm p-5 space-y-2 px-4">
      <p className="text-xs font-semibold text-secondary capitalize tracking-wide">
        {title}
      </p>
      <p className="text-2xl font-semibold text-primary text-ellipsis whitespace-nowrap">
        {value}
      </p>
      {hint && (
        <p className="text-xs text-secondary capitalize tracking-wide">
          {hint}
        </p>
      )}
    </div>
  );
};
