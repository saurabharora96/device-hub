interface StatusIndicatorProps {
  status: 'up' | 'down';
}

export function StatusIndicator({ status }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`status-dot ${status === 'up' ? 'status-dot-up' : 'status-dot-down'}`}
      />
      <span className="text-sm font-medium capitalize">{status}</span>
    </div>
  );
}
