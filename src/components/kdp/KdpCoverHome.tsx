'use client';

import Link from 'next/link';
import { useMemo, useState, type ChangeEvent } from 'react';
import { coreTools, guides, templates } from '@/src/lib/content';
import { calculateKdpCoverSize, formatInches, type KdpCoverInput } from '@/src/lib/kdp/cover';
import { interiorLabel, kdpPresetById, kdpPresets, paperLabel, trimPresetById, trimPresets, type InteriorType, type PaperType, type ReadingDirection } from '@/src/lib/kdp/presets';
import { KdpCoverPreview } from '@/src/components/kdp/KdpCoverPreview';
import { KdpMetricStrip } from '@/src/components/kdp/KdpMetricStrip';
import { KdpResultActions } from '@/src/components/kdp/KdpResultActions';

const defaultPreset = kdpPresetById('six-by-nine-paperback');
const kdpHomeUrl = 'https://print.ymirtool.com/';
const kdpCalculatorUrl = 'https://print.ymirtool.com/kdp-cover-calculator/';

const kdpJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'KDP Cover Size & Spine Calculator',
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Any',
      url: kdpCalculatorUrl,
      description: 'Calculate KDP paperback cover file size, spine width, trim spread, bleed, barcode safe zone, and pixel canvas in the browser.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'How do I calculate KDP spine width?', acceptedAnswer: { '@type': 'Answer', text: 'Choose trim size, page count, interior type, and paper type. The calculator estimates spine width from page count and the current KDP paperback spine multipliers for the selected paper option.' } },
        { '@type': 'Question', name: 'Does KDP cover size include bleed?', acceptedAnswer: { '@type': 'Answer', text: 'The cover file size includes bleed on the outside edges. The calculator also shows the trim spread before bleed so you can compare both values.' } },
        { '@type': 'Question', name: 'What pixel size should a KDP cover be?', acceptedAnswer: { '@type': 'Answer', text: 'The pixel canvas is the cover file size multiplied by the selected PPI, commonly 300 PPI for print planning.' } }
      ]
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Print Ready Tools', item: kdpHomeUrl },
        { '@type': 'ListItem', position: 2, name: 'KDP Cover Calculator', item: kdpCalculatorUrl }
      ]
    }
  ]
};

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
  const [copied, setCopied] = useState(false);
  const [draftInput, setDraftInput] = useState<KdpCoverInput>(() => presetToInput(defaultPreset.id));
  const [confirmedInput, setConfirmedInput] = useState<KdpCoverInput>(() => presetToInput(defaultPreset.id));
  const draftResult = useMemo(() => calculateKdpCoverSize(draftInput), [draftInput]);
  const result = useMemo(() => calculateKdpCoverSize(confirmedInput), [confirmedInput]);
  const trim = trimPresetById(confirmedInput.trimId);
  const summary = `Create your cover file at ${formatInches(result.fullCoverWidthIn, 3)} × ${formatInches(result.fullCoverHeightIn, 2)} in including bleed.\nTrim spread: ${formatInches(result.trimSpreadWidthIn, 3)} × ${formatInches(result.trimHeightIn, 2)} in before bleed.\nAt ${result.ppi} PPI, use ${result.pixelWidth} × ${result.pixelHeight} px.\nBack cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in. Front cover: ${formatInches(result.trimWidthIn, 2)} × ${formatInches(result.trimHeightIn, 2)} in.\nSpine: ${formatInches(result.spineWidthIn, 3)} in.\nBleed: ${formatInches(result.bleedIn, 3)} in on all outside edges.\nReading direction: ${confirmedInput.readingDirection === 'right-to-left' ? 'right to left' : 'left to right'}.\nKeep important text inside the safe zone.\nLeave the barcode safe zone empty unless you supply your own barcode.`;

  const update = (patch: Partial<KdpCoverInput>) => {
    setCalculated(false);
    setActivePreset('');
    setDraftInput((current) => ({ ...current, ...patch }));
  };

  const loadPreset = (presetId: string) => {
    const nextInput = presetToInput(presetId);
    setActivePreset(presetId);
    setCalculated(true);
    setDraftInput(nextInput);
    setConfirmedInput(nextInput);
  };

  const calculate = () => {
    setConfirmedInput(draftInput);
    setCalculated(true);
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const openOfficialCalculator = () => {
    window.open('https://kdp.amazon.com/cover-calculator', '_blank', 'noopener,noreferrer');
  };

  const paperOptions: PaperType[] = draftInput.interior === 'black-white' ? ['white', 'cream'] : ['color'];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(kdpJsonLd) }} />
      <main className="kdp-home" aria-labelledby="kdp-home-title">
        <section className="kdp-hero-compact">
          <h1 id="kdp-home-title">KDP paperback cover size &amp; spine calculator</h1>
          <p>Enter trim size, page count, paper type, and bleed. Get cover file size, spine width, barcode safe zone, and pixel canvas before uploading to KDP.</p>
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
                <span className="kdp-readonly-field" role="text">Paperback only</span>
              </label>
              <label className="kdp-field">Interior type
                <select value={draftInput.interior} onChange={(event) => {
                  const interior = event.target.value as InteriorType;
                  update({ interior, paper: interior === 'black-white' ? draftInput.paper === 'color' ? 'white' : draftInput.paper : 'color' });
                }}>
                  <option value="black-white">Black &amp; white</option>
                  <option value="standard-color">Standard color</option>
                  <option value="premium-color">Premium color</option>
                </select>
              </label>
              <label className="kdp-field">Paper type
                <select value={draftInput.paper} onChange={(event) => update({ paper: event.target.value as PaperType })}>
                  {paperOptions.map((paper) => <option key={paper} value={paper}>{paperLabel(paper)}</option>)}
                </select>
              </label>
              <label className="kdp-field">Reading direction
                <select value={draftInput.readingDirection} onChange={(event) => update({ readingDirection: event.target.value as ReadingDirection })}>
                  <option value="left-to-right">Left to right</option>
                  <option value="right-to-left">Right to left</option>
                </select>
              </label>
              <label className="kdp-field kdp-span-2">Trim size
                <select value={draftInput.trimId} onChange={(event) => update({ trimId: event.target.value })}>
                  {trimPresets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label} {preset.id !== 'custom' ? `(${(preset.widthIn * 2.54).toFixed(2)} × ${(preset.heightIn * 2.54).toFixed(2)} cm)` : ''}</option>)}
                </select>
              </label>
              {draftInput.trimId === 'custom' && (
                <>
                  <label className="kdp-field">Custom width
                    <input type="number" {...inputNumber(draftInput.customWidthIn, (value) => update({ customWidthIn: value }), { min: 1, step: 0.01 })} />
                  </label>
                  <label className="kdp-field">Custom height
                    <input type="number" {...inputNumber(draftInput.customHeightIn, (value) => update({ customHeightIn: value }), { min: 1, step: 0.01 })} />
                  </label>
                </>
              )}
              <label className="kdp-field">Page count
                <input type="number" {...inputNumber(draftInput.pageCount, (value) => update({ pageCount: value }), { min: 1, step: 1 })} />
              </label>
              <div className="kdp-range-note">Min {draftResult.pageRange.min} - Max {draftResult.pageRange.max} pages</div>
              <label className="kdp-field">Bleed
                <div className="kdp-inline-field">
                  <input type="number" {...inputNumber(draftInput.bleedIn, (value) => update({ bleedIn: value }), { min: 0, step: 0.001 })} />
                  <span>in</span>
                </div>
              </label>
              <label className="kdp-field">DPI / PPI <small>(for pixel size only)</small>
                <input type="number" {...inputNumber(draftInput.ppi, (value) => update({ ppi: value }), { min: 72, step: 1 })} />
              </label>
            </div>
            <label className="kdp-toggle-row">Barcode safe zone
              <input type="checkbox" checked={draftInput.showBarcode} onChange={(event) => {
                const showBarcode = event.target.checked;
                setDraftInput((current) => ({ ...current, showBarcode }));
                setConfirmedInput((current) => ({ ...current, showBarcode }));
              }} />
              <span>Show barcode safe zone on preview</span>
            </label>
            <button type="button" className="kdp-primary-button" onClick={calculate}>Calculate cover size</button>
            <div className="kdp-secondary-actions">
              <button type="button" onClick={() => loadPreset('six-by-nine-paperback')}>Load 6×9 paperback sample</button>
              <button type="button" disabled={!calculated} onClick={copySummary}>{!calculated ? 'Calculate first' : copied ? 'Copied' : 'Copy result'}</button>
              <button type="button" className="kdp-span-2" onClick={openOfficialCalculator}>Open KDP official calculator <span>Final check</span></button>
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
            <KdpCoverPreview result={result} showBarcode={confirmedInput.showBarcode} readingDirection={confirmedInput.readingDirection} />
            <p className={calculated ? 'kdp-status-line' : 'kdp-warning-line'}>{calculated ? `Calculated ${trim.label.toLowerCase()} paperback with ${confirmedInput.pageCount} pages, ${paperLabel(confirmedInput.paper).toLowerCase()}, ${formatInches(result.bleedIn, 3)} in bleed.` : 'Draft changed. Click Calculate cover size to update the preview, dimensions, copy text, and downloads.'}</p>
            {result.warnings.length > 0 && <p className="kdp-warning-line">{result.warnings[0]}</p>}
            <div className="kdp-result-row">
              <div className="kdp-details-card">
                <h3>Your cover file details</h3>
                <ul>
                  <li>Cover file incl. bleed: {formatInches(result.fullCoverWidthIn, 3)} × {formatInches(result.fullCoverHeightIn, 2)} in.</li>
                  <li>Trim spread: {formatInches(result.trimSpreadWidthIn, 3)} × {formatInches(result.trimHeightIn, 2)} in.</li>
                  <li>At {result.ppi} PPI, use {result.pixelWidth} × {result.pixelHeight} px.</li>
                  <li>Back and front cover: {formatInches(result.trimWidthIn, 2)} × {formatInches(result.trimHeightIn, 2)} in each.</li>
                  <li>Spine {formatInches(result.spineWidthIn, 3)} in · Bleed {formatInches(result.bleedIn, 3)} in · Final check in KDP Previewer.</li>
                  <li>Spine uses KDP paperback multipliers: B&W white/standard color 0.002252, B&W cream 0.0025, premium color 0.002347.</li>
                </ul>
              </div>
              <KdpResultActions result={result} summary={summary} disabled={!calculated} />
            </div>
          </div>
        </section>

        <section className="kdp-presets" aria-label="Common KDP setups">
          <div className="kdp-presets-head">
            <h2>Common KDP setups</h2>
            <p>Load specs instantly.</p>
          </div>
          <div className="kdp-preset-row">
            {kdpPresets.map((preset) => {
              const selected = activePreset === preset.id;
              return (
                <button type="button" className={selected ? 'kdp-preset-card active' : 'kdp-preset-card'} key={preset.id} onClick={() => loadPreset(preset.id)}>
                  <span className="kdp-mini-cover" aria-hidden="true" />
                  <strong>{preset.label}</strong>
                  {preset.badge && <em>{preset.badge}</em>}
                  <small>{preset.pageCount} pages · {interiorLabel(preset.interior).replace('Black & white', 'B&W')}</small>
                  <small>{paperLabel(preset.paper)}</small>
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <section className="container stack kdp-below-fold" aria-label="More KDP and print tools">
        <section className="card kdp-more-tools-card">
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
