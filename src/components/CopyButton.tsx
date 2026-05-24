'use client';
import { useState } from 'react';
export function CopyButton({ text, label = 'Copy summary' }: { text: string; label?: string }) {
  const [status, setStatus] = useState('');
  return <span className="buttonrow"><button type="button" onClick={() => navigator.clipboard.writeText(text).then(() => setStatus('Copied')).catch(() => setStatus('Clipboard denied'))}>{label}</button><span className="small muted">{status}</span></span>;
}
