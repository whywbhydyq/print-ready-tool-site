export type BindingType = 'paperback' | 'hardcover';
export type InteriorType = 'black-white' | 'standard-color' | 'premium-color';
export type PaperType = 'white' | 'cream' | 'color';
export type ReadingDirection = 'left-to-right' | 'right-to-left';

export type TrimPreset = {
  id: string;
  label: string;
  widthIn: number;
  heightIn: number;
  description: string;
};

export type KdpPreset = {
  id: string;
  label: string;
  badge?: string;
  binding: BindingType;
  interior: InteriorType;
  paper: PaperType;
  readingDirection: ReadingDirection;
  trimId: string;
  pageCount: number;
  bleedIn: number;
  ppi: number;
};

export const trimPresets: TrimPreset[] = [
  { id: '5x8', label: '5 × 8 in', widthIn: 5, heightIn: 8, description: 'compact nonfiction' },
  { id: '5.25x8', label: '5.25 × 8 in', widthIn: 5.25, heightIn: 8, description: 'novel / memoir' },
  { id: '5.5x8.5', label: '5.5 × 8.5 in', widthIn: 5.5, heightIn: 8.5, description: 'novel / workbook' },
  { id: '6x9', label: '6 × 9 in', widthIn: 6, heightIn: 9, description: 'common paperback' },
  { id: '7x10', label: '7 × 10 in', widthIn: 7, heightIn: 10, description: 'manual / workbook' },
  { id: '8.5x11', label: '8.5 × 11 in', widthIn: 8.5, heightIn: 11, description: 'large workbook' },
  { id: 'custom', label: 'Custom size', widthIn: 6, heightIn: 9, description: 'set your own trim size' }
];

export const kdpPresets: KdpPreset[] = [
  {
    id: 'six-by-nine-paperback',
    label: '6 × 9 in',
    badge: 'Popular',
    binding: 'paperback',
    interior: 'black-white',
    paper: 'white',
    readingDirection: 'left-to-right',
    trimId: '6x9',
    pageCount: 120,
    bleedIn: 0.125,
    ppi: 300
  },
  {
    id: 'novel-cream',
    label: '5.5 × 8.5 in',
    binding: 'paperback',
    interior: 'black-white',
    paper: 'cream',
    readingDirection: 'left-to-right',
    trimId: '5.5x8.5',
    pageCount: 200,
    bleedIn: 0.125,
    ppi: 300
  },
  {
    id: 'workbook-color',
    label: '8.5 × 11 in',
    binding: 'paperback',
    interior: 'standard-color',
    paper: 'color',
    readingDirection: 'left-to-right',
    trimId: '8.5x11',
    pageCount: 120,
    bleedIn: 0.125,
    ppi: 300
  },
  {
    id: 'seven-by-ten-color',
    label: '7 × 10 in',
    binding: 'paperback',
    interior: 'standard-color',
    paper: 'color',
    readingDirection: 'left-to-right',
    trimId: '7x10',
    pageCount: 200,
    bleedIn: 0.125,
    ppi: 300
  },
  {
    id: 'custom-trim',
    label: 'Custom size',
    binding: 'paperback',
    interior: 'black-white',
    paper: 'white',
    readingDirection: 'left-to-right',
    trimId: 'custom',
    pageCount: 120,
    bleedIn: 0.125,
    ppi: 300
  }
];

export function trimPresetById(id: string): TrimPreset {
  return trimPresets.find((preset) => preset.id === id) || trimPresets[3];
}

export function kdpPresetById(id: string): KdpPreset {
  return kdpPresets.find((preset) => preset.id === id) || kdpPresets[0];
}

export function paperLabel(paper: PaperType): string {
  if (paper === 'cream') return 'Cream paper';
  if (paper === 'color') return 'Color paper';
  return 'White paper';
}

export function interiorLabel(interior: InteriorType): string {
  if (interior === 'standard-color') return 'Standard color';
  if (interior === 'premium-color') return 'Premium color';
  return 'Black & white';
}
