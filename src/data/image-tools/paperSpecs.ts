import type { PaperSpec } from './types';
export const paperSpecs: PaperSpec[] = [
  { id: 'a0', name: 'A0', widthMm: 841, heightMm: 1189, group: 'ISO' },
  { id: 'a1', name: 'A1', widthMm: 594, heightMm: 841, group: 'ISO' },
  { id: 'a2', name: 'A2', widthMm: 420, heightMm: 594, group: 'ISO' },
  { id: 'a3', name: 'A3', widthMm: 297, heightMm: 420, group: 'ISO' },
  { id: 'a4', name: 'A4', widthMm: 210, heightMm: 297, group: 'ISO' },
  { id: 'a5', name: 'A5', widthMm: 148, heightMm: 210, group: 'ISO' },
  { id: 'a6', name: 'A6', widthMm: 105, heightMm: 148, group: 'ISO' },
  { id: 'letter', name: 'US Letter', widthMm: 215.9, heightMm: 279.4, group: 'US' },
  { id: 'legal', name: 'US Legal', widthMm: 215.9, heightMm: 355.6, group: 'US' },
  { id: 'tabloid', name: 'Tabloid', widthMm: 279.4, heightMm: 431.8, group: 'US' },
  { id: 'business-card-us', name: 'US Business Card', widthMm: 88.9, heightMm: 50.8, group: 'Business' }
];
export const paperById = (id: string) => paperSpecs.find((paper) => paper.id === id) || paperSpecs[4];
