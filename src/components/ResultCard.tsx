import type { ReactNode } from 'react';
export function ResultCard({ title = 'Result', children }: { title?: string; children: ReactNode }) {
  return <div className="result"><h2>{title}</h2>{children}</div>;
}
