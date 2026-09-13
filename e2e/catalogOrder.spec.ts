import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Product } from '@/utils/basket';

const BASKET_KEY = 'basket_items';
const CATALOGO_HAR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/api_whatsapp_catalogo.har',
);
const CATALOGO_ERROR_HAR = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/api_whatsapp_catalogo_error.har',
);

const SAMPLE_PRODUCT: Product = {
  id: '1',
  name: 'Pampers Premium Care Recién Nacido x24',
  brand: 'Pampers',
  image: '/images/products/01-newborn-diapers.webp',
  current_offer: null,
  category: 'bebes',
  subcategory: 'panales',
  filter: 'recien-nacido',
};

const SECOND_SAMPLE_PRODUCT: Product = {
  ...SAMPLE_PRODUCT,
  id: '2',
  name: 'Huggies Natural Care Classic x60',
  brand: 'Huggies',
  image: '/images/products/02-classic-diapers.webp',
  filter: 'panales-descartables',
};

/** Matches the request body recorded in api_whatsapp_catalogo.har */
const HAR_CATALOGO_PRODUCT: Product = {
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

  test('shows a hydrated basket review with local thumbnails and guidance', async ({ page }) => {
    const hydrationErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydration/i.test(message.text())) {
        hydrationErrors.push(message.text());
      }
    });

    await seedBasket(page, [SAMPLE_PRODUCT, SECOND_SAMPLE_PRODUCT]);
    await page.goto('/basket');

    await expect(page.getByRole('heading', { level: 1, name: 'Revisá tu consulta' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Ruta de navegación' })).toContainText(
      'Carrito',
    );

    const productList = page.getByRole('region', { name: 'Productos seleccionados' });
    await expect(productList.getByText(SAMPLE_PRODUCT.name)).toBeVisible();
    await expect(productList.getByText(SECOND_SAMPLE_PRODUCT.name)).toBeVisible();
    await expect(productList.locator('img')).toHaveCount(2);
    await expect(productList.locator('img').first()).toHaveAttribute(
      'src',
      '/images/products/01-newborn-diapers.webp',
    );
    await expect(page.getByText('2 de 5 productos', { exact: true })).toBeVisible();

    const guidance = page.getByRole('complementary', { name: 'Cómo sigue' });
    await expect(guidance).toContainText('disponibilidad, precio y detalles de retiro');
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
    await expect(page.getByText('Tu carrito está vacío.')).not.toBeVisible();
    expect(hydrationErrors).toEqual([]);
  });

  test('removes an item immediately and updates count and storage', async ({ page }) => {
    await seedBasket(page, [SAMPLE_PRODUCT, SECOND_SAMPLE_PRODUCT]);
    await page.goto('/basket');

    await page
      .getByRole('button', { name: `Borrar ${SAMPLE_PRODUCT.name} de la consulta` })
      .click();

    await expect(page.getByText(SAMPLE_PRODUCT.name)).not.toBeVisible();
    await expect(page.getByText(SECOND_SAMPLE_PRODUCT.name)).toBeVisible();
    await expect(page.getByText('1 de 5 productos', { exact: true })).toBeVisible();
    expect(
      await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? '[]'), BASKET_KEY),
    ).toEqual([SECOND_SAMPLE_PRODUCT]);
  });

  test('supports keyboard removal with a visible 44 pixel focus target', async ({ page }) => {
    await seedBasket(page);
    await page.goto('/basket');

    const removeButton = page.getByRole('button', {
      name: `Borrar ${SAMPLE_PRODUCT.name} de la consulta`,
    });
    await removeButton.focus();
    await expect(removeButton).toBeFocused();
    expect(await removeButton.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe(
      'none',
    );

    const bounds = await removeButton.boundingBox();
    if (!bounds) throw new Error('Expected visible removal control bounds.');
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);

    await removeButton.press('Enter');
    await expect(page.getByText(SAMPLE_PRODUCT.name)).not.toBeVisible();
    expect(await page.evaluate((key) => localStorage.getItem(key), BASKET_KEY)).toBe('[]');
  });

  test('keeps products first and avoids overflow at responsive basket widths', async ({ page }) => {
    await seedBasket(page, [SAMPLE_PRODUCT, SECOND_SAMPLE_PRODUCT]);

    for (const viewport of [
      { width: 320, height: 760 },
      { width: 768, height: 900 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/basket');

      const productList = page.getByRole('region', { name: 'Productos seleccionados' });
      const guidance = page.getByRole('complementary', { name: 'Cómo sigue' });
      const [productBounds, guidanceBounds] = await Promise.all([
        productList.boundingBox(),
        guidance.boundingBox(),
      ]);
      if (!productBounds || !guidanceBounds) throw new Error('Expected responsive basket bounds.');

      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);

      if (viewport.width < 1024) {
        expect(productBounds.y).toBeLessThan(guidanceBounds.y);
      } else {
        expect(productBounds.x).toBeLessThan(guidanceBounds.x);
        expect(await guidance.evaluate((element) => getComputedStyle(element).position)).toBe(
          'sticky',
        );
      }
    }
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
    await expect(
      page.getByText('No pudimos enviar el pedido por WhatsApp.', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
  });
});

test.describe('Catalog product page', () => {
  test('confirms and persists a catalog selection', async ({ page }) => {
    const catalogUrl = '/bebes?sc=panales&f=recien-nacido';
    await page.goto(catalogUrl);

    const addButton = page.getByRole('button', { name: /^Agregar / }).first();
    const productName = (await addButton.getAttribute('aria-label'))?.replace(/^Agregar /, '');
    if (!productName) throw new Error('The catalog product action has no accessible product name.');

    await addButton.click();

    const selectedButton = page.getByRole('button', {
      name: `Agregado ✓: ${productName}`,
    });
    await expect(selectedButton).toBeDisabled();
    await expect(
      page.getByRole('status').filter({ hasText: `Agregaste ${productName} a tu consulta.` }),
    ).toHaveText(`Agregaste ${productName} a tu consulta.`);
    expect(
      await page.evaluate(
        ({ key, name }) =>
          JSON.parse(localStorage.getItem(key) ?? '[]').filter(
            (product: { name: string }) => product.name === name,
          ).length,
        { key: BASKET_KEY, name: productName },
      ),
    ).toBe(1);

    await page.reload();
    await expect(selectedButton).toBeDisabled();

    await page.goto('/contact');
    await page.goto(catalogUrl);
    await expect(selectedButton).toBeDisabled();
  });

  test('reveals and updates the mobile inquiry action from the shared basket', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bebes?sc=panales');

    const inquiryAction = page.getByRole('link', { name: /Revisar consulta/ });
    await expect(inquiryAction).not.toBeVisible();

    await page
      .getByRole('button', { name: /^Agregar / })
      .nth(0)
      .click();
    await expect(inquiryAction).toHaveAccessibleName('Revisar consulta. 1 de 5 productos');
    const actionColors = await inquiryAction.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        foreground: styles.color,
        background: styles.backgroundColor,
        page: getComputedStyle(document.body).backgroundColor,
      };
    });
    expect(actionColors.foreground).toBe(actionColors.page);
    expect(actionColors.foreground).not.toBe(actionColors.background);

    await page
      .getByRole('button', { name: /^Agregar / })
      .nth(0)
      .click();
    await expect(inquiryAction).toHaveAccessibleName('Revisar consulta. 2 de 5 productos');
    await expect(page.getByText('2 de 5 productos')).toBeVisible();
  });

  test('completes five selections and restores availability after basket removal', async ({
    page,
  }) => {
    const catalogUrl = '/bebes?sc=panales';
    const selectedNames: string[] = [];
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(catalogUrl);

    for (let index = 0; index < 5; index += 1) {
      const addButton = page.getByRole('button', { name: /^Agregar / }).first();
      const productName = (await addButton.getAttribute('aria-label'))?.replace(/^Agregar /, '');
      if (!productName) throw new Error('The catalog product action has no accessible name.');
      selectedNames.push(productName);
      await addButton.click();
    }

    for (const productName of selectedNames) {
      await expect(page.getByRole('button', { name: `Agregado ✓: ${productName}` })).toBeDisabled();
    }

    const limitButton = page.getByRole('button', { name: /^Máximo alcanzado:/ }).first();
    await expect(limitButton).toBeDisabled();
    await expect(limitButton).toHaveText('Máximo alcanzado');
    await expect(limitButton).toHaveAccessibleDescription(
      'Quitá un producto de tu consulta para seleccionar otro.',
    );
    await expect(
      page.getByRole('status').filter({
        hasText: `Agregaste ${selectedNames[4]} a tu consulta. Consulta completa: 5 de 5 productos.`,
      }),
    ).toHaveText(
      `Agregaste ${selectedNames[4]} a tu consulta. Consulta completa: 5 de 5 productos.`,
    );
    await expect(
      page.getByRole('link', { name: 'Consulta completa. 5 de 5 productos' }),
    ).toBeVisible();

    const storedAtLimit = await page.evaluate((key) => localStorage.getItem(key), BASKET_KEY);
    expect(JSON.parse(storedAtLimit ?? '[]')).toHaveLength(5);
    await limitButton.evaluate((button: HTMLButtonElement) => button.click());
    expect(await page.evaluate((key) => localStorage.getItem(key), BASKET_KEY)).toBe(storedAtLimit);

    await page.reload();
    for (const productName of selectedNames) {
      await expect(page.getByRole('button', { name: `Agregado ✓: ${productName}` })).toBeDisabled();
    }
    await expect(page.getByRole('button', { name: /^Máximo alcanzado:/ }).first()).toBeDisabled();
    await expect(
      page.getByRole('link', { name: 'Consulta completa. 5 de 5 productos' }),
    ).toBeVisible();

    await page.getByRole('link', { name: 'Consulta completa. 5 de 5 productos' }).click();
    await page
      .getByRole('listitem')
      .filter({ hasText: selectedNames[0] })
      .getByRole('button', { name: `Borrar ${selectedNames[0]} de la consulta` })
      .click();
    await page.goBack();

    await expect(page).toHaveURL(catalogUrl);
    await expect(page.getByRole('button', { name: `Agregar ${selectedNames[0]}` })).toBeEnabled();
    await expect(page.getByRole('button', { name: /^Agregar / })).toHaveCount(2);
    await expect(
      page.getByRole('link', { name: 'Revisar consulta. 4 de 5 productos' }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key) ?? '[]').length,
        BASKET_KEY,
      ),
    ).toBe(4);
  });

  test('opens the basket from the mobile inquiry action', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedBasket(page);
    await page.goto('/bebes?sc=panales&f=recien-nacido');

    await page.getByRole('link', { name: 'Revisar consulta. 1 de 5 productos' }).click();

    await expect(page).toHaveURL('/basket');
  });

  test('shows the inquiry action only on mobile catalog routes', async ({ page }) => {
    await seedBasket(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bebes?sc=panales&f=recien-nacido');
    await expect(
      page.getByRole('link', { name: 'Revisar consulta. 1 de 5 productos' }),
    ).toBeVisible();

    for (const path of ['/', '/contact', '/orders', '/basket']) {
      await page.goto(path);
      await expect(page.getByRole('link', { name: /Revisar consulta/ })).not.toBeVisible();
    }

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/bebes?sc=panales&f=recien-nacido');
    await expect(
      page.getByRole('link', { name: 'Revisar consulta: 1 de 5 productos seleccionados' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Revisar consulta. 1 de 5 productos' }),
    ).not.toBeVisible();
  });

  test('keeps catalog content usable at 320 pixels without covering the last action', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto('/bebes?sc=panales');
    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();

    const inquiryAction = page.getByRole('link', { name: /Revisar consulta/ });
    await expect(inquiryAction).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const finalProductAction = page.getByRole('button', { name: /^Agregar / }).last();
    const [finalProductBox, inquiryBox] = await Promise.all([
      finalProductAction.boundingBox(),
      inquiryAction.boundingBox(),
    ]);

    if (!finalProductBox || !inquiryBox) {
      throw new Error('Expected the catalog and inquiry actions to have visible bounds.');
    }
    expect(inquiryBox.height).toBeGreaterThanOrEqual(44);
    expect(finalProductBox.y + finalProductBox.height).toBeLessThanOrEqual(inquiryBox.y);
  });

  test('reaches the mobile inquiry state with reduced motion enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bebes?sc=panales&f=recien-nacido');

    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();
    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta. 1 de 5 productos',
    });
    await expect(inquiryAction).toBeVisible();

    await inquiryAction.click();
    await expect(page).toHaveURL('/basket');
  });

  test('shows the desktop inquiry control only after a catalog product is selected', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/bebes?sc=panales');

    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });
    await expect(inquiryAction).not.toBeVisible();

    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();
    await expect(inquiryAction).toBeVisible();
    await expect(inquiryAction).toContainText('Consulta');
    await expect(inquiryAction).toContainText('1 de 5');
  });

  test('updates the desktop inquiry progress on the current catalog page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/bebes?sc=panales');

    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();
    await expect(
      page.getByRole('link', { name: 'Revisar consulta: 1 de 5 productos seleccionados' }),
    ).toBeVisible();

    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();
    await expect(
      page.getByRole('link', { name: 'Revisar consulta: 2 de 5 productos seleccionados' }),
    ).toBeVisible();
  });

  test('opens the basket from the desktop inquiry control', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedBasket(page);
    await page.goto('/bebes?sc=panales&f=recien-nacido');

    await page
      .getByRole('link', { name: 'Revisar consulta: 1 de 5 productos seleccionados' })
      .click();

    await expect(page).toHaveURL('/basket');
  });

  test('keeps the desktop inquiry control available while the catalog scrolls', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await seedBasket(page);
    await page.goto('/bebes?sc=panales');

    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await expect(inquiryAction).toBeVisible();

    const afterScroll = await inquiryAction.boundingBox();
    if (!afterScroll) throw new Error('Expected desktop inquiry control bounds after scrolling.');
    expect(afterScroll.y).toBeGreaterThanOrEqual(0);
    expect(afterScroll.y + afterScroll.height).toBeLessThanOrEqual(100);
  });

  test('uses the desktop inquiry control at 768 pixels and keeps the mobile action below it', async ({
    page,
  }) => {
    await seedBasket(page);
    const desktopInquiry = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });
    const mobileInquiry = page.getByRole('link', { name: 'Revisar consulta. 1 de 5 productos' });

    await page.setViewportSize({ width: 768, height: 800 });
    await page.goto('/bebes?sc=panales');
    await expect(desktopInquiry).toBeVisible();
    await expect(mobileInquiry).not.toBeVisible();

    await page.setViewportSize({ width: 767, height: 800 });
    await expect(desktopInquiry).not.toBeVisible();
    await expect(mobileInquiry).toBeVisible();
  });

  test('scopes the desktop inquiry control to valid catalog category routes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedBasket(page);

    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });

    await page.goto('/bebes?sc=panales');
    await expect(inquiryAction).toBeVisible();

    for (const path of ['/', '/contact', '/orders', '/basket', '/offers', '/not-a-catalog-route']) {
      await page.goto(path);
      await expect(inquiryAction).not.toBeVisible();
    }
  });

  test('provides a keyboard focus state and a 44 pixel desktop inquiry target', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedBasket(page);
    await page.goto('/bebes?sc=panales');

    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });
    await inquiryAction.focus();
    await expect(inquiryAction).toBeFocused();
    expect(await inquiryAction.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe(
      'solid',
    );

    const bounds = await inquiryAction.boundingBox();
    if (!bounds) throw new Error('Expected visible desktop inquiry control bounds.');
    expect(bounds.width).toBeGreaterThanOrEqual(44);
    expect(bounds.height).toBeGreaterThanOrEqual(44);

    await inquiryAction.press('Enter');
    await expect(page).toHaveURL('/basket');
  });

  test('shows the completed desktop inquiry state at five products', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await seedBasket(
      page,
      Array.from({ length: 5 }, (_, index) => ({
        ...SAMPLE_PRODUCT,
        id: `desktop-product-${index}`,
        name: `Producto desktop ${index + 1}`,
      })),
    );
    await page.goto('/bebes?sc=panales');

    await expect(
      page.getByRole('link', { name: 'Consulta completa: 5 de 5 productos seleccionados' }),
    ).toBeVisible();
  });

  test('reaches the desktop inquiry final state with reduced motion enabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/bebes?sc=panales');

    await page
      .getByRole('button', { name: /^Agregar / })
      .first()
      .click();
    const inquiryAction = page.getByRole('link', {
      name: 'Revisar consulta: 1 de 5 productos seleccionados',
    });
    await expect(inquiryAction).toBeVisible();
    expect(
      await inquiryAction.evaluate((element) => ({
        animationName: getComputedStyle(element).animationName,
        transform: getComputedStyle(element).transform,
      })),
    ).toEqual({ animationName: 'none', transform: 'none' });
  });
});
