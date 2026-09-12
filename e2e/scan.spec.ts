import { test, expect, type Page } from '@playwright/test';

import { skinScanResult } from '../src/tests/fixtures/skinScan';
import type { ScanEvent } from '../src/types/types';

type TestWindow = typeof window & {
  scanTestStream: ReadableStreamDefaultController<Uint8Array>;
  scanTestCancelled: boolean;
};

// Control when chunks arrive, so assertions cover the experience during a real wait.
async function installScanStream(page: Page) {
  await page.addInitScript(() => {
    const nativeFetch = window.fetch;
    const testWindow = window as TestWindow;
    window.fetch = async (input, init) => {
      if (input !== '/api/scan') return nativeFetch(input, init);
      testWindow.scanTestCancelled = false;
      return new Response(
        new ReadableStream<Uint8Array>({
          start(controller) {
            testWindow.scanTestStream = controller;
            init?.signal?.addEventListener(
              'abort',
              () => {
                testWindow.scanTestCancelled = true;
                controller.error(new DOMException('Cancelled', 'AbortError'));
              },
              { once: true },
            );
          },
        }),
        { headers: { 'Content-Type': 'application/x-ndjson' } },
      );
    };
  });
}

async function sendEvent(page: Page, event: ScanEvent) {
  await page.evaluate((event) => {
    const controller = (window as TestWindow).scanTestStream;
    controller.enqueue(new TextEncoder().encode(`${JSON.stringify(event)}\n`));
    if (event.type !== 'phase') controller.close();
  }, event);
}

test.beforeEach(async ({ page }) => {
  await installScanStream(page);
  await page.goto('/scan');
});

test('shows the example and advances only when stream events arrive', async ({
  page,
}, testInfo) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Una mirada a tu piel.');
  await expect(page.getByRole('img', { name: 'Retrato de ejemplo' })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('scan-idle.png'), fullPage: true });
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  const steps = page.getByRole('list', { name: 'Pasos del análisis' });
  await expect(steps.locator('[aria-current="step"]')).toContainText('Preparamos la imagen');
  await sendEvent(page, { type: 'phase', phase: 'analyzing' });
  await expect(steps.locator('[aria-current="step"]')).toContainText('Observamos los detalles');
  await expect(page.getByRole('button', { name: 'Analizando imagen' })).toBeDisabled();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: testInfo.outputPath('scan-analyzing.png'), fullPage: true });

  await sendEvent(page, { type: 'phase', phase: 'composing' });
  await expect(steps.locator('[aria-current="step"]')).toContainText('Armamos la orientación');
  await expect(page.getByRole('heading', { name: 'Una primera orientación' })).toHaveCount(0);
  await sendEvent(page, { type: 'complete', result: skinScanResult });
  await expect(page.getByRole('heading', { name: 'Una primera orientación' })).toBeFocused();
  await expect(steps.getByText('Listo', { exact: true })).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Limpieza suave' })).toBeVisible();
  await expect(page.getByText(skinScanResult.cosmeticSolutions[0].precautions)).toBeVisible();
  await expect(page.getByText(skinScanResult.disclaimer, { exact: true })).toBeVisible();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: testInfo.outputPath('scan-complete.png'), fullPage: true });
});

test('cancels the stream and starts a fresh analysis', async ({ page }) => {
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  await sendEvent(page, { type: 'phase', phase: 'analyzing' });
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Análisis cancelado' })).toBeVisible();
  expect(await page.evaluate(() => (window as TestWindow).scanTestCancelled)).toBe(true);
  await page.getByRole('button', { name: 'Reintentar análisis' }).click();
  await expect(
    page.getByRole('list', { name: 'Pasos del análisis' }).locator('[aria-current="step"]'),
  ).toContainText('Preparamos la imagen');
  await sendEvent(page, { type: 'complete', result: skinScanResult });
  await expect(page.getByRole('heading', { name: 'Una primera orientación' })).toBeVisible();
});

test('offers a retry after a stream error and clears it on the next attempt', async ({ page }) => {
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  await sendEvent(page, { type: 'phase', phase: 'composing' });
  await sendEvent(page, { type: 'error', message: 'No pudimos completar el análisis.' });
  await expect(page.getByRole('main').getByRole('alert')).toContainText('No pudimos completar');
  await expect(page.getByRole('heading', { name: 'Una primera orientación' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Reintentar análisis' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  await sendEvent(page, { type: 'complete', result: skinScanResult });
  await expect(page.getByRole('heading', { name: 'Una primera orientación' })).toBeVisible();
});

test('handles long waits without inventing progress and eventually allows retry', async ({
  page,
}) => {
  await page.clock.install();
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  await sendEvent(page, { type: 'phase', phase: 'analyzing' });
  await page.clock.fastForward(26_000);
  await expect(
    page.getByText('Está llevando un poquito más de tiempo.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('list', { name: 'Pasos del análisis' }).locator('[aria-current="step"]'),
  ).toContainText('Observamos los detalles');
  await page.clock.fastForward(75_000);
  await expect(page.getByRole('main').getByRole('alert')).toContainText(
    'tardando más de lo esperado',
  );
  await expect(page.getByRole('button', { name: 'Reintentar análisis' })).toBeEnabled();
});

test('prioritizes professional review when the result calls for it', async ({ page }) => {
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  await sendEvent(page, {
    type: 'complete',
    result: {
      ...skinScanResult,
      medicalCheckFirst: {
        suggested: true,
        reason: 'La imagen no permite orientar el cuidado con seguridad.',
      },
    },
  });
  await expect(page.getByRole('heading', { name: 'Antes de elegir un cuidado' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Limpieza suave' })).toHaveCount(0);
});

test('keeps controls reachable on mobile and respects reduced motion', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Analizar imagen', exact: true }).click();
  await sendEvent(page, { type: 'phase', phase: 'analyzing' });
  await expect(page.getByRole('button', { name: 'Cancelar', exact: true })).toBeVisible();
  const spinner = page.locator('[aria-current="step"] svg');
  await expect(page.locator('[aria-current="step"]')).toContainText('Observamos los detalles');
  await expect(spinner).toHaveCSS('animation-name', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: testInfo.outputPath('scan-mobile.png'), fullPage: true });
});
