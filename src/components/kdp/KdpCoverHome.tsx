'use client';

import Link from 'next/link';
import { useMemo, useState, type ChangeEvent } from 'react';
import { coreTools, guides, templates } from '@/src/lib/content';
import { calculateKdpCoverSize, formatInches, type KdpCoverInput } from '@/src/lib/kdp/cover';
import { interiorLabel, kdpPresetById, kdpPresets, paperLabel, trimPresetById, trimPresets, type BindingType, type InteriorType, type PaperType, type ReadingDirection } from '@/src/lib/kdp/presets';
import { KdpCoverPreview } from '@/src/components/kdp/KdpCoverPreview';
import { KdpMetricStrip } from '@/src/components/kdp/KdpMetricStrip';
import { KdpResultActions } from '@/src/components/kdp/KdpResultActions';

const defaultPreset = kdpPresetById('six-by-nine-paperback');

function presetToInput(presetId: string): KdpCoverInput {
  const preset = kdpPresetById(presetId);
  const trim = trimPresetById(preset.trimId);
  return {
    binding: preset.binding,
    interior: preset.interior,
    paper: preset.paper,
    readingDirection: preset.readingDirection,
    trimId: preset.trimId,
    customWidthIn: trim.widthIn,
    customHeightIn: trim.heightIn,
    pageCount: preset.pageCount,
    bleedIn: preset.bleedIn,
    ppi: preset.ppi,
    showBarcode: true
  };
}

function inputNumber(value: number, onChange: (value: number) => void, props?: { min?: number; step?: number }) {
  return {
    value: Number.isFinite(value) ? value : 0,
    min: props?.min,
    step: props?.step,
    onChange: (event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))
  };
}

export function KdpCoverHome() {
  const [activePreset, setActivePreset] = useState(defaultPreset.id);
  const [calculated, setCalculated] = useState(true);
  const [input, setInput] = useState<KdpCoverInput>(() => presetToInput(defaultPreset.id));
  const result = useMemo(() => calculateKdpCoverSize(input), [input]);
  const trim = trimPresetById(input.trimId);
  const summary = `Create your cover file at ${formatInches(result.fullCoverWidthIn, 3)} × ${formatInches(result.fullCoverHeightIn, 2)} in.\nAt ${input.ppi} PPI, use ${result.pixelWidth} × ${result.pixelHeight} px.\nBack cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in. Front cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in.\nSpine: ${formatInches(result.spineWidthIn, 3)} in.\nBleed: ${formatInches(result.bleedIn, 3)} in on all outside edges.\nKeep important text inside the safe zone.\nLeave the barcode safe zone empty unless you supply your own barcode.`;

  const update = (patch: Partial<KdpCoverInput>) => {
    setCalculated(false);
    setInput((current) => ({ ...current, ...patch }));
  };

  const loadPreset = (presetId: string) => {
    setActivePreset(presetId);
    setCalculated(true);
    setInput(presetToInput(presetId));
  };

  const openOfficialCalculator = () => {
    window.open('https://kdp.amazon.com/cover-calculator', '_blank', 'noopener,noreferrer');
  };

  const paperOptions: PaperType[] = input.interior === 'black-white' ? ['white', 'cream'] : ['color'];

  return (
    <>
      <main className="kdp-home" aria-labelledby="kdp-home-title">
        <section className="kdp-hero-compact">
          <h1 id="kdp-home-title">KDP paperback cover size &amp; spine calculator</h1>
          <p>Enter your book specs and get the exact cover dimensions, spine width, barcode safe zone, and 300 PPI pixel size for KDP.</p>
          <div className="kdp-trust-row" aria-label="Trust and privacy notes">
            <span>Independent planning tool</span>
            <span>No file upload</span>
            <span>Check final file in KDP Previewer</span>
          </div>
        </section>

        <section className="kdp-workbench" aria-label="KDP cover calculator workspace">
          <div className="kdp-panel kdp-input-panel">
            <h2>1. Enter your book specs</h2>
            <div className="kdp-form-grid">
              <label className="kdp-field">Binding type
                <select value={input.binding} onChange={(event) => update({ binding: event.target.value as BindingType })}>
                  <option value="paperback">Paperback</option>
                  <option value="hardcover">Hardcover</option>
                </select>
              </label>
              <label className="kdp-field">Interior type
                <select value={input.interior} onChange={(event) => {
                  const interior = event.target.value as InteriorType;
                  update({ interior, paper: interior === 'black-white' ? input.paper === 'color' ? 'white' : input.paper : 'color' });
                }}>
                  <option value="black-white">Black &amp; white</option>
                  <option value="standard-color">Standard color</option>
                  <option value="premium-color">Premium color</option>
                </select>
              </label>
              <label className="kdp-field">Paper type
                <select value={input.paper} onChange={(event) => update({ paper: event.target.value as PaperType })}>
                  {paperOptions.map((paper) => <option key={paper} value={paper}>{paperLabel(paper)}</option>)}
                </select>
              </label>
              <label className="kdp-field">Reading direction
                <select value={input.readingDirection} onChange={(event) => update({ readingDirection: event.target.value as ReadingDirection })}>
                  <option value="left-to-right">Left to right</option>
                  <option value="right-to-left">Right to left</option>
                </select>
              </label>
              <label className="kdp-field kdp-span-2">Trim size
                <select value={input.trimId} onChange={(event) => update({ trimId: event.target.value })}>
                  {trimPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label} {preset.id !== 'custom' ? `(${(preset.widthIn * 2.54).toFixed(2)} × ${(preset.heightIn * 2.54).toFixed(2)} cm)` : ''}</option>)}
                </select>
              </label>
              {input.trimId === 'custom' && (
                <>
                  <label className="kdp-field">Custom width
                    <input type="number" {...inputNumber(input.customWidthIn, (value) => update({ customWidthIn: value }), { min: 1, step: 0.01 })} />
                  </label>
                  <label className="kdp-field">Custom height
                    <input type="number" {...inputNumber(input.customHeightIn, (value) => update({ customHeightIn: value }), { min: 1, step: 0.01 })} />
                  </label>
                </>
              )}
              <label className="kdp-field">Page count
                <input type="number" {...inputNumber(input.pageCount, (value) => update({ pageCount: value }), { min: 1, step: 1 })} />
              </label>
              <div className="kdp-range-note">Min {result.pageRange.min} - Max {result.pageRange.max} pages</div>
              <label className="kdp-field">Bleed
                <div className="kdp-inline-field">
                  <input type="number" {...inputNumber(input.bleedIn, (value) => update({ bleedIn: value }), { min: 0, step: 0.001 })} />
                  <span>in</span>
                </div>
              </label>
              <label className="kdp-field">DPI / PPI <small>(for pixel size only)</small>
                <input type="number" {...inputNumber(input.ppi, (value) => update({ ppi: value }), { min: 72, step: 1 })} />
              </label>
            </div>
            <label className="kdp-toggle-row">Barcode safe zone
              <input type="checkbox" checked={input.showBarcode} onChange={(event) => update({ showBarcode: event.target.checked })} />
              <span>Show barcode safe zone on preview</span>
            </label>
            <button type="button" className="kdp-primary-button" onClick={() => setCalculated(true)}>Calculate cover size</button>
            <div className="kdp-secondary-actions">
              <button type="button" onClick={() => loadPreset('six-by-nine-paperback')}>Load 6×9 sample</button>
              <button type="button" onClick={() => navigator.clipboard.writeText(summary)}>Copy result</button>
              <button type="button" className="kdp-span-2" onClick={openOfficialCalculator}>Open official KDP calculator</button>
            </div>
          </div>

          <div className="kdp-panel kdp-preview-panel">
            <h2>2. Build your cover canvas</h2>
            <KdpMetricStrip result={result} />
            <div className="kdp-legend-row">
              <span><i className="kdp-bleed-line" />Bleed ({formatInches(result.bleedIn, 3)} in)</span>
              <span><i className="kdp-trim-line" />Trim line</span>
              <span><i className="kdp-safe-line" />Safe zone</span>
              <span><i className="kdp-barcode-chip" />Barcode safe zone</span>
            </div>
            <KdpCoverPreview result={result} showBarcode={input.showBarcode} />
            <p className={calculated ? 'kdp-status-line' : 'kdp-warning-line'}>{calculated ? `Calculated ${trim.label.toLowerCase()} cover with ${input.pageCount} pages, ${paperLabel(input.paper).toLowerCase()}, ${formatInches(result.bleedIn, 3)} in bleed.` : 'Inputs changed. Click Calculate cover size to confirm the updated setup.'}</p>
            {result.warnings.length > 0 && <p className="kdp-warning-line">{result.warnings[0]}</p>}
            <div className="kdp-result-row">
              <div className="kdp-details-card">
                <h3>Your cover file details</h3>
                <ul>
                  <li>Create your cover file at {formatInches(result.fullCoverWidthIn, 3)} × {formatInches(result.fullCoverHeightIn, 2)} in.</li>
                  <li>At {input.ppi} PPI, use {result.pixelWidth} × {result.pixelHeight} px.</li>
                  <li>Back cover: {formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in · Front cover: {formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in.</li>
                  <li>Spine: {formatInches(result.spineWidthIn, 3)} in · Bleed: {formatInches(result.bleedIn, 3)} in.</li>
                  <li>Keep important text inside the safe zone.</li>
                </ul>
              </div>
              <KdpResultActions result={result} summary={summary} />
            </div>
          </div>
        </section>

        <section className="kdp-presets" aria-label="Common KDP setups">
          <div>
            <h2>Common KDP setups</h2>
            <p>Click a setup to load the specs and results instantly.</p>
          </div>
          <div className="kdp-preset-row">
            {kdpPresets.map((preset) => {
              const presetTrim = trimPresetById(preset.trimId);
              const selected = activePreset === preset.id;
              return (
                <button type="button" className={selected ? 'kdp-preset-card active' : 'kdp-preset-card'} key={preset.id} onClick={() => loadPreset(preset.id)}>
                  <span className="kdp-mini-cover" aria-hidden="true" />
                  <strong>{preset.label}</strong>
                  {preset.badge && <em>{preset.badge}</em>}
                  <small>{preset.pageCount} pages · {interiorLabel(preset.interior).replace('Black & white', 'B&W')}</small>
                  <small>{paperLabel(preset.paper)}</small>
                  {preset.trimId === 'custom' && <small>{presetTrim.description}</small>}
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <section className="container stack kdp-below-fold" aria-label="More KDP and print tools">
        <section className="card">
          <h2>Explore more tools</h2>
          <div className="kdp-related-grid">
            <div><h3>KDP workflow</h3>{coreTools.slice(0, 2).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}<Link href="/templates/kdp-cover-setup-checklist/">KDP Cover Setup Checklist<span>Step-by-step cover file checklist.</span></Link></div>
            <div><h3>Print sizing</h3>{coreTools.slice(3, 7).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}</div>
            <div><h3>Marketplace</h3>{coreTools.slice(7, 8).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}{templates.slice(0, 1).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}</div>
            <div><h3>Image checking</h3>{coreTools.slice(2, 3).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}{coreTools.slice(5, 6).map(([href, title, desc]) => <Link href={href} key={href}>{title}<span>{desc}</span></Link>)}</div>
          </div>
        </section>
        <section className="card kdp-checklist-strip">
          <h2>Print readiness checklist</h2>
          <span>Cover file is one full spread.</span>
          <span>Background extends to bleed.</span>
          <span>Text stays inside safe zone.</span>
          <span>Barcode area is clear.</span>
          <span>Spine text fits spine width.</span>
          <span>Final PDF checked in KDP Previewer.</span>
        </section>
        <section className="grid">
          <div className="card"><h2>FAQ</h2>{guides.filter(([, title]) => title.includes('KDP')).slice(0, 3).map(([href, title]) => <p key={href}><Link href={href}>{title}</Link></p>)}</div>
          <div className="card"><h2>Sources and limits</h2><p>This planning calculator estimates cover setup dimensions. Always verify the final file in KDP Previewer. This tool is independent and not affiliated with Amazon.</p><p><Link href="/disclaimer/">Learn more about formulas and limits</Link></p></div>
        </section>
      </section>
    </>
  );
}
