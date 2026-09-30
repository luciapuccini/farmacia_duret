import path from 'node:path';

import { devices, expect, test } from '@playwright/test';

const { defaultBrowserType: _browserType, ...pixel7 } = devices['Pixel 7'];
test.use(pixel7);

const PHOTO = path.join(import.meta.dirname, 'fixtures', 'skin-photo.jpg');

const SCAN_EVENTS = [
  { type: 'status', stage: 'analyzing' },
  { type: 'summary', text: 'Se observa una piel con brillo leve en la zona T.' },
  {
    type: 'medicalCheck',
    suggested: true,
    reason: 'Hay una zona enrojecida que conviene revisar.',
  },
  { type: 'pattern', text: 'Brillo en frente y nariz.' },
  { type: 'pattern', text: 'Poros visibles en mejillas.' },
  {
    type: 'solution',
    name: 'Limpiador suave',
    rationale: 'Ayuda a retirar el exceso de sebo sin resecar.',
    precautions: 'Evitá frotar la piel.',
  },
  { type: 'done' },
];

test.describe('Skin scan', () => {
  test('analyzes a selected photo and shows the result', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/scan', async (route) => {
      requestCount += 1;
      await route.fulfill({
        contentType: 'application/x-ndjson',
        body: SCAN_EVENTS.map((event) => JSON.stringify(event)).join('\n') + '\n',
      });
    });

    await page.goto('/scan');
    await expect(
      page.getByText('No reemplaza una consulta profesional', { exact: false }),
    ).toBeVisible();

    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);

    await expect(page.getByRole('img', { name: 'Foto seleccionada' })).toBeVisible();
    await expect(page.getByText('tu foto se envía para analizarla y no se guarda')).toBeVisible();
    expect(requestCount).toBe(0);

    await page.getByRole('button', { name: 'Analizar' }).tap();

    await expect(page.getByText('Se observa una piel con brillo leve en la zona T.')).toBeVisible();
    await expect(page.getByText('Hay una zona enrojecida que conviene revisar.')).toBeVisible();
    await expect(page.getByText('Brillo en frente y nariz.')).toBeVisible();
    await expect(page.getByText('Poros visibles en mejillas.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Limpiador suave' })).toBeVisible();
    await expect(
      page.getByText('No reemplaza una consulta profesional', { exact: false }),
    ).toBeVisible();
    expect(requestCount).toBe(1);
  });

  test('rejects an unsupported file without a request', async ({ page }) => {
    let requestCount = 0;
    await page.route('**/api/scan', async (route) => {
      requestCount += 1;
      await route.abort();
    });

    await page.goto('/scan');
    await page.getByLabel('Elegir una foto').setInputFiles({
      name: 'receta.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4'),
    });

    await expect(page.getByText('Elegí una foto JPG, PNG o WEBP.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Analizar' })).toHaveCount(0);
    expect(requestCount).toBe(0);
  });
});
