interface LabelBadgeProps {
  labelKey: string;
  value: string;
}

export function LabelBadge({ labelKey, value }: LabelBadgeProps) {
  return (
    <span className="label-badge">
      <span className="opacity-70">{labelKey}:</span>
      <span className="ml-1 font-semibold">{value}</span>
    </span>
  );
}
