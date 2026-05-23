import { expect, test } from '@playwright/test';

const toolPages = [
  { path: '/print-size-calculator/', title: 'Print Size Calculator', inputValue: '3600' },
  { path: '/dpi-calculator/', title: 'DPI Calculator', inputValue: '4200' },
  { path: '/image-print-quality-checker/', title: 'Image Print Quality Checker', inputValue: '4200' },
  { path: '/bleed-safe-zone-calculator/', title: 'Bleed & Safe Zone Calculator', inputValue: '8.5' },
  { path: '/kdp-cover-calculator/', title: 'KDP Cover Size Calculator', inputValue: '6' },
  { path: '/kdp-interior-bleed-calculator/', title: 'KDP Interior Bleed Calculator', inputValue: '6' },
  { path: '/etsy-printable-size-calculator/', title: 'Etsy Printable Size Pack Calculator', inputValue: '300' },
  { path: '/common-print-sizes/', title: 'Common Print Sizes Library', inputValue: '300' },
];

async function expectResultSections(page: import('@playwright/test').Page) {
  await expect(page.getByRole('heading', { name: 'Summary' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Details' }).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Warnings' }).first()).toBeVisible();
}

async function fillFirstNumberInput(page: import('@playwright/test').Page, value: string) {
  const input = page.locator('input[type="number"]').first();
  if (await input.count()) {
    await input.fill(value);
    await input.blur();
  }
}

test.describe('core tool pages', () => {
  for (const tool of toolPages) {
    test(`${tool.title} renders, accepts input, shows results, and exposes downloads`, async ({ page }) => {
      await page.goto(tool.path);

      await expect(page.getByRole('heading', { name: tool.title })).toBeVisible();
      await fillFirstNumberInput(page, tool.inputValue);
      await expectResultSections(page);

      await expect(page.getByRole('button', { name: 'Copy result' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Copy share link' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Download/i }).first()).toBeVisible();
    });
  }
});

test.describe('calculator-specific workflows', () => {
  test('Print Size Calculator supports all three modes and custom DPI', async ({ page }) => {
    await page.goto('/print-size-calculator/');

    await page.getByLabel('Mode').selectOption('print-size-to-pixels');
    await page.getByLabel('DPI/PPI').selectOption('custom');
    await page.locator('input.inlineinput').fill('360');
    await expect(page.getByText(/pixels:/i)).toBeVisible();

    await page.getByLabel('Mode').selectOption('effective-dpi');
    await page.getByLabel('Pixel width').fill('2400');
    await page.getByLabel('Pixel height').fill('3000');
    await page.getByLabel('Print width').fill('8');
    await page.getByLabel('Print height').fill('10');
    await expect(page.getByText(/effective DPI/i).first()).toBeVisible();
  });

  test('Bleed calculator validates safe margin and keeps result sections visible', async ({ page }) => {
    await page.goto('/bleed-safe-zone-calculator/');

    await page.getByLabel('Trim width').fill('8');
    await page.getByLabel('Trim height').fill('10');
    await page.getByLabel('Safe margin').fill('4.5');
    await expect(page.getByText(/Fix input errors to calculate/i)).toBeVisible();

    await page.getByLabel('Safe margin').fill('0.25');
    await expect(page.getByText(/full bleed/i).first()).toBeVisible();
  });

  test('Image checker reads manual dimensions and keeps file upload optional', async ({ page }) => {
    await page.goto('/image-print-quality-checker/');

    await expect(page.locator('input[type="file"]')).toBeVisible();
    await page.getByLabel('Pixel width').fill('5000');
    await page.getByLabel('Pixel height').fill('4000');
    await page.getByLabel('Target width').fill('10');
    await page.getByLabel('Target height').fill('8');
    await expect(page.getByText(/effective DPI/i).first()).toBeVisible();
  });

  test('KDP cover shows spine warning for low page counts', async ({ page }) => {
    await page.goto('/kdp-cover-calculator/');

    await page.getByLabel('Page count').fill('78');
    await expect(page.getByText(/under 79 pages/i)).toBeVisible();
  });

  test('Etsy calculator exposes CSV and buyer instruction downloads', async ({ page }) => {
    await page.goto('/etsy-printable-size-calculator/');

    await expect(page.getByRole('button', { name: 'Download CSV' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download buyer instruction' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '4:5' }).first()).toBeVisible();
  });
});

test.describe('download behavior', () => {
  test('a generated file can be downloaded from a tool page', async ({ page }) => {
    await page.goto('/print-size-calculator/');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Download CSV' }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('print-size-result.csv');
  });
});
