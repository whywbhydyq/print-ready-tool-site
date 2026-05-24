export function RiskBadge({ level }: { level: 'safe' | 'warning' | 'danger' | 'info' }) {
  return <span className={`risk risk-${level}`}>{level}</span>;
}
