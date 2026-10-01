import path from 'node:path';

import { devices, expect, test, type Locator } from '@playwright/test';

const { defaultBrowserType: _browserType, ...pixel7 } = devices['Pixel 7'];
test.use(pixel7);

const PHOTO = path.join(import.meta.dirname, 'fixtures', 'skin-photo.jpg');

async function boxOf(locator: Locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error('The element has no bounding box.');
  return box;
}

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
    await expect(page.getByText('Luz natural · de frente · sin maquillaje')).toBeVisible();

    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);

    await expect(page.getByRole('img', { name: 'Foto seleccionada' })).toBeVisible();
    await expect(page.getByText('tu foto se envía para analizarla y no se guarda')).toBeVisible();
    expect(requestCount).toBe(0);

    // Thumb reach: the main action is in the lower half of the first screen, with no scroll.
    const viewportHeight = page.viewportSize()?.height ?? 0;
    const analyzeBox = await boxOf(page.getByRole('button', { name: 'Analizar' }));
    expect(analyzeBox.y).toBeGreaterThan(viewportHeight / 2);
    expect(analyzeBox.y + analyzeBox.height).toBeLessThanOrEqual(viewportHeight);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      ),
    ).toBe(true);

    await page.getByRole('button', { name: 'Analizar' }).tap();

    const results = page.getByRole('article', { name: 'Resultado del análisis' });
    await expect(results).toHaveAttribute('aria-busy', 'false');
    await expect(page.getByRole('status')).toHaveText('Análisis listo');
    const thumbnailBox = await boxOf(page.getByRole('img', { name: 'Foto seleccionada' }));
    expect(thumbnailBox.width).toBeLessThanOrEqual(96);
    expect(thumbnailBox.y).toBeLessThan((await boxOf(results)).y);

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

  test('shows errors, removes partial results and retries with the same photo', async ({
    page,
  }) => {
    const toNdjson = (events: object[]) =>
      events.map((event) => JSON.stringify(event)).join('\n') + '\n';
    const responses = [
      { status: 500, contentType: 'application/json', body: '{"error":"server_config"}' },
      {
        status: 200,
        contentType: 'application/x-ndjson',
        body: toNdjson([
          SCAN_EVENTS[0],
          { type: 'summary', text: 'Resumen parcial que no debe quedar.' },
          { type: 'error', code: 'analysis_failed' },
        ]),
      },
      { status: 200, contentType: 'application/x-ndjson', body: toNdjson(SCAN_EVENTS) },
    ];
    const sentImages: number[] = [];
    await page.route('**/api/scan', async (route) => {
      sentImages.push(route.request().postDataBuffer()?.length ?? 0);
      await route.fulfill(responses[sentImages.length - 1]);
    });

    await page.goto('/scan');
    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);
    await page.getByRole('button', { name: 'Analizar' }).tap();

    // Next.js also renders a route announcer with role="alert", so filter on the notice text.
    const alert = page.getByRole('alert').filter({ hasText: 'No pudimos completar el análisis' });
    await expect(alert).toContainText('El análisis no está disponible en este momento.');

    await alert.getByRole('button', { name: 'Reintentar' }).tap();
    await expect(alert).toContainText('No pudimos analizar la foto.');
    await expect(page.getByText('Resumen parcial que no debe quedar.')).toHaveCount(0);

    await alert.getByRole('button', { name: 'Reintentar' }).tap();
    await expect(page.getByText('Se observa una piel con brillo leve en la zona T.')).toBeVisible();
    await expect(alert).toHaveCount(0);

    expect(sentImages).toHaveLength(3);
    expect(new Set(sentImages).size).toBe(1);
  });

  test('cancels the running scan when a new photo is picked', async ({ page }) => {
    let requestCount = 0;
    // Never answer, so that the scan stays in progress.
    await page.route('**/api/scan', () => {
      requestCount += 1;
    });

    await page.goto('/scan');
    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);
    await page.getByRole('button', { name: 'Analizar' }).tap();
    await expect(page.getByText('Estamos mirando tu foto')).toBeVisible();
    await expect(page.getByRole('article', { name: 'Resultado del análisis' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(page.getByRole('status')).toHaveText('');

    const requestFailed = page.waitForEvent('requestfailed', (request) =>
      request.url().includes('/api/scan'),
    );
    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);

    await requestFailed;
    await expect(page.getByText('Estamos mirando tu foto')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Analizar' })).toBeEnabled();
    await expect(page.getByText('No pudimos completar el análisis')).toHaveCount(0);
    expect(requestCount).toBe(1);
  });
});

test.describe('Skin scan on desktop', () => {
  test.use({ viewport: { width: 1280, height: 900 }, isMobile: false, hasTouch: false });

  test('shows the photo and the results in two columns', async ({ page }) => {
    await page.route('**/api/scan', async (route) => {
      await route.fulfill({
        contentType: 'application/x-ndjson',
        body: SCAN_EVENTS.map((event) => JSON.stringify(event)).join('\n') + '\n',
      });
    });

    await page.goto('/scan');
    await page.getByLabel('Elegir una foto').setInputFiles(PHOTO);
    await page.getByRole('button', { name: 'Analizar' }).click();

    const results = page.getByRole('article', { name: 'Resultado del análisis' });
    await expect(results).toHaveAttribute('aria-busy', 'false');
    const photoBox = await boxOf(page.getByRole('img', { name: 'Foto seleccionada' }));
    const resultsBox = await boxOf(results);
    expect(photoBox.width).toBeGreaterThan(300);
    expect(photoBox.x + photoBox.width).toBeLessThanOrEqual(resultsBox.x);
  });
});
