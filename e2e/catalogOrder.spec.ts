import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BASKET_KEY = 'basket_items';
const CATALOGO_HAR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/api_whatsapp_catalogo.har',
);
const CATALOGO_ERROR_HAR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/api_whatsapp_catalogo_error.har',
);

const SAMPLE_PRODUCT = {
  id: '1',
  name: 'Pampers Premium Care Recién Nacido x24',
  brand: 'Pampers',
  image: null,
  current_offer: null,
  category: 'bebes',
  subcategory: 'panales',
  filter: 'recien-nacido',
};

/** Matches the request body recorded in api_whatsapp_catalogo.har */
const HAR_CATALOGO_PRODUCT = {
  id: '12',
  name: 'Máscara Sky High Black Waterproof',
  brand: 'Maybelline',
  image: null,
  current_offer: null,
  category: 'belleza',
  subcategory: 'maquillaje',
  filter: 'ojos',
};

const HAR_CATALOGO_PHONE = '+54 9 11 6755-1238';
/** Matches the request body recorded in api_whatsapp_catalogo_error.har */
const HAR_ERROR_PHONE = '+54 9 11 1234-5678';

function seedBasket(page: Page, products = [SAMPLE_PRODUCT]) {
  return page.addInitScript(({ key, items }) => localStorage.setItem(key, JSON.stringify(items)), {
    key: BASKET_KEY,
    items: products,
  });
}

async function replayCatalogoFromHar(page: Page, harPath = CATALOGO_HAR) {
  await page.routeFromHAR(harPath, {
    url: '**/api/whatsapp/catalogo',
  });
}

test.describe('Catalog basket page', () => {
  test('shows empty state when basket has no items', async ({ page }) => {
    await page.goto('/basket');

    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).not.toBeVisible();
  });

  test('shows the phone input when basket has items', async ({ page }) => {
    await seedBasket(page);
    await page.goto('/basket');
    await expect(page.getByLabel('Teléfono')).toBeVisible();
  });

  test('shows basket items seeded in localStorage', async ({ page }) => {
    await seedBasket(page);
    await page.goto('/basket');

    await expect(page.getByText('Pampers Premium Care Recién Nacido x24')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
  });

  test('removes an item when Borrar is clicked', async ({ page }) => {
    await seedBasket(page);
    await page.goto('/basket');

    await page.getByRole('button', { name: 'Borrar' }).click();

    await expect(page.getByText('Pampers Premium Care Recién Nacido x24')).not.toBeVisible();
    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  });

  test('shows a phone validation error when submitting without a phone number', async ({
    page,
  }) => {
    await seedBasket(page);
    await page.goto('/basket');

    await page.getByRole('button', { name: 'Hacer pedido' }).click();

    await expect(page.getByText('Ingresá un teléfono válido.')).toBeVisible();
  });

  test('blocks submission and shows an error when the phone is outside Argentina', async ({
    page,
  }) => {
    let requestCount = 0;
    await page.route('**/api/whatsapp/catalogo', async (route) => {
      requestCount += 1;
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ ok: true }) });
    });

    await seedBasket(page);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill('+34 675 512 388');
    await page.getByRole('button', { name: 'Hacer pedido' }).click();

    await expect(page.getByText('No soportamos telefonos fuera de Argentina')).toBeVisible();
    expect(requestCount).toBe(0);
  });

  test('sends the catalog order via WhatsApp API on valid submission', async ({ page }) => {
    let submittedBody: string | undefined;

    await replayCatalogoFromHar(page);
    page.on('request', (request) => {
      if (request.url().includes('/api/whatsapp/catalogo') && request.method() === 'POST') {
        submittedBody = request.postData() ?? undefined;
      }
    });

    await seedBasket(page, [HAR_CATALOGO_PRODUCT]);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill(HAR_CATALOGO_PHONE);
    const responsePromise = page.waitForResponse('**/api/whatsapp/catalogo');
    await page.getByRole('button', { name: 'Hacer pedido' }).click();
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ ok: true });
    expect(submittedBody).toContain('Máscara Sky High Black Waterproof');
    expect(submittedBody).toContain(HAR_CATALOGO_PHONE);
    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).not.toBeVisible();
  });

  test('clears the basket after a successful order', async ({ page }) => {
    await replayCatalogoFromHar(page);
    await seedBasket(page, [HAR_CATALOGO_PRODUCT]);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill(HAR_CATALOGO_PHONE);
    await page.getByRole('button', { name: 'Hacer pedido' }).click();

    await expect(page.getByText('Máscara Sky High Black Waterproof')).not.toBeVisible();
    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  });

  test('shows an error message when the API call fails', async ({ page }) => {
    await replayCatalogoFromHar(page, CATALOGO_ERROR_HAR);
    await seedBasket(page);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill(HAR_ERROR_PHONE);
    const responsePromise = page.waitForResponse('**/api/whatsapp/catalogo');
    await page.getByRole('button', { name: 'Hacer pedido' }).click();
    const response = await responsePromise;

    expect(response.status()).toBe(502);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: 'No pudimos enviar el pedido por WhatsApp.',
    });
    await expect(page.getByText('No pudimos enviar el pedido por WhatsApp.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
  });
});

test.describe('Catalog product page', () => {
  test('adds a product to the basket when Comprar is clicked', async ({ page }) => {
    await page.goto('/bebes?sc=panales&f=recien-nacido');

    await page.getByRole('button', { name: 'Comprar' }).first().click();
    await seedBasket(page);
    await page.goto('/basket');
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
  });
});
