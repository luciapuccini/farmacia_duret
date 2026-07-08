import { test, expect, type Page } from '@playwright/test';

const STORAGE_KEY = 'orders_submissions';
const MAX_PER_DAY = 6;

async function captureOrderRequest(page: Page, response: Record<string, unknown>) {
  let submittedBody: string | undefined;

  await page.route('**/api/whatsapp/orders', async (route) => {
    submittedBody = route.request().postData() ?? undefined;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });

  return () => submittedBody;
}

async function countOrderRequests(page: Page) {
  let requestCount = 0;

  await page.route('**/api/whatsapp/orders', async (route) => {
    requestCount += 1;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  return () => requestCount;
}

test.describe('Orders form', () => {
  test('shows the form on load', async ({ page }) => {
    await page.goto('/orders');

    await expect(
      page.getByRole('banner').getByRole('link', { name: 'Hacer un encargo' }),
    ).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Nombre completo*' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Teléfono*' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pedí por WhatsApp, sin' })).toBeVisible();
  });

  test('phone input shows the fixed Argentina dial code and number field', async ({ page }) => {
    await page.goto('/orders');
    const form = page.getByRole('form', { name: 'Contanos de vos' });
    await expect(form.getByText('+54')).toBeVisible();
    await expect(form.getByRole('textbox', { name: 'Teléfono*' })).toBeVisible();
  });

  test('sends the order through the WhatsApp API after a valid submission', async ({ page }) => {
    const submittedBody = await captureOrderRequest(page, {
      ok: true,
      messageId: 'wamid.test',
      hasImage: false,
    });
    await page.goto('/orders');

    await page.getByLabel('Nombre completo').fill('Test User');
    await page.getByLabel('Teléfono').fill('11 1234-5678');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Comentarios para el farmacéutico').fill('Ibuprofeno 400mg');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();

    expect(submittedBody()).toContain('Test User');
    expect(submittedBody()).toContain('Ibuprofeno 400mg');
    await expect(page.getByText('Encargo enviado por WhatsApp')).toBeVisible();
  });

  test('fills the form and submits', async ({ page }) => {
    const submittedBody = await captureOrderRequest(page, {
      ok: true,
      messageId: 'wamid.test',
      hasImage: false,
    });
    await page.goto('/orders');

    await page.getByRole('textbox', { name: 'Nombre completo*' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Teléfono*' }).fill('99 123 456');
    await page
      .getByRole('textbox', { name: 'Comentarios para el farmacéutico' })
      .fill('Paracetamol');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();

    expect(submittedBody()).toContain('+54');
    await expect(page.getByText('Encargo enviado por WhatsApp')).toBeVisible();
  });

  test('blocks submission and shows an error when the phone is outside Argentina', async ({
    page,
  }) => {
    const requestCount = await countOrderRequests(page);
    await page.goto('/orders');

    await page.getByRole('textbox', { name: 'Nombre completo*' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Teléfono*' }).fill('+34 675 512 388');
    await page
      .getByRole('textbox', { name: 'Comentarios para el farmacéutico' })
      .fill('Paracetamol');
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();

    await expect(page.getByText('No soportamos telefonos fuera de Argentina')).toBeVisible();
    expect(requestCount()).toBe(0);
  });

  test('does not submit while privacy consent is unchecked', async ({ page }) => {
    const requestCount = await countOrderRequests(page);
    await page.goto('/orders');

    await page.getByRole('checkbox').uncheck();
    await expect(page.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeDisabled();
    expect(requestCount()).toBe(0);
  });

  test('shows rate-limit screen when daily limit is reached', async ({ page }) => {
    await page.addInitScript((key) => {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(key, JSON.stringify({ date: today, count: 6 }));
    }, STORAGE_KEY);

    await page.goto('/orders');

    await expect(page.getByText('Límite diario alcanzado')).toBeVisible();
    await expect(page.getByText(`${MAX_PER_DAY} encargos por día`)).toBeVisible();
  });

  test('browser validates required fields before sending to WhatsApp', async ({ page }) => {
    const requestCount = await countOrderRequests(page);
    await page.goto('/orders');

    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click();

    await expect(page.getByText('Encargo enviado por WhatsApp')).not.toBeVisible();
    expect(requestCount()).toBe(0);
  });
});
