'use client';
import { useEffect, useState } from 'react';
export type LocalImage = { url: string; width: number; height: number; type: string; size: number };
export function ImageUploadPreview({ onImage }: { onImage: (image: LocalImage | null) => void }) {
  const [image, setImage] = useState<LocalImage | null>(null);
  const [error, setError] = useState('');
  useEffect(() => () => { if (image?.url) URL.revokeObjectURL(image.url); }, [image?.url]);
  function read(file: File) {
    if (!file.type.startsWith('image/')) { setError('Choose an image file.'); return; }
    const url = URL.createObjectURL(file); const img = new Image();
    img.onload = () => { const next = { url, width: img.naturalWidth, height: img.naturalHeight, type: file.type, size: file.size }; setImage(next); onImage(next); setError(''); };
    img.onerror = () => { URL.revokeObjectURL(url); setError('Could not read that image.'); };
    img.src = url;
  }
  return <div className="card"><h2>Local image preview</h2><p className="small muted">Your image stays in your browser. We do not upload or store your file.</p><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) read(file); }} />{error && <p className="warning">{error}</p>}{image && <p className="small">Loaded locally: {image.width}×{image.height}px, {Math.round(image.size / 1024)} KB.</p>}</div>;
}
