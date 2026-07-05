import { test, expect, type Page } from '@playwright/test';

const BASKET_KEY = 'basket_items';

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

function seedBasket(page: Page, products = [SAMPLE_PRODUCT]) {
  return page.addInitScript(({ key, items }) => localStorage.setItem(key, JSON.stringify(items)), {
    key: BASKET_KEY,
    items: products,
  });
}

async function interceptCatalogoRequest(page: Page, response: Record<string, unknown>) {
  let submittedBody: string | undefined;

  await page.route('**/api/whatsapp/catalogo', async (route) => {
    submittedBody = route.request().postData() ?? undefined;
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });

  return () => submittedBody;
}

test.describe('Catalog basket page', () => {
  test('shows empty state when basket has no items', async ({ page }) => {
    await page.goto('/basket');

    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).not.toBeVisible();
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

  test('sends the catalog order via WhatsApp API on valid submission', async ({ page }) => {
    const submittedBody = await interceptCatalogoRequest(page, {
      ok: true,
      messageId: 'wamid.test',
    });
    await seedBasket(page);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill('+54 9 11 1234-5678');
    await page.getByRole('button', { name: 'Hacer pedido' }).click();

    expect(submittedBody()).toContain('Pampers Premium Care Recién Nacido x24');
    // expect(submittedBody()).toContain('+54911');
  });

  // test('clears the basket after a successful order', async ({ page }) => {
  //   await interceptCatalogoRequest(page, { ok: true, messageId: 'wamid.test' });
  //   await seedBasket(page);
  //   await page.goto('/basket');

  //   await page.getByLabel('Teléfono').fill('+54 9 11 1234-5678');
  //   await page.getByRole('textbox', { name: 'Teléfono' }).click();
  //   // FIXME: mock API, this is the only authorized phone right now
  //   // 131030) Recipient phone number not in allowed list
  //   await page.getByRole('textbox', { name: 'Teléfono' }).fill('+34675512388');
  //   await page.getByRole('button', { name: 'Hacer pedido' }).click();

  //   await expect(page.getByText('¡Pedido enviado! Te contactaremos por WhatsApp.')).toBeVisible();
  //   await expect(page.getByText('Pampers Premium Care Recién Nacido x24')).not.toBeVisible();
  // });

  test('shows an error message when the API call fails', async ({ page }) => {
    await interceptCatalogoRequest(page, {
      ok: false,
      error: 'No pudimos enviar el pedido por WhatsApp.',
    });
    await seedBasket(page);
    await page.goto('/basket');

    await page.getByLabel('Teléfono').fill('+54 9 11 1234-5678');
    await page.getByRole('button', { name: 'Hacer pedido' }).click();

    await expect(page.getByText('No pudimos enviar el pedido por WhatsApp.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
  });
});

// test.describe('Catalog product page', () => {
//   test('adds a product to the basket when Comprar is clicked', async ({ page }) => {
//     await page.goto('/bebes?sc=panales&f=recien-nacido');

//     await page.getByRole('button', { name: 'Comprar' }).first().click();
//     await seedBasket(page);
//     await page.goto('/basket');
//     await expect(page.getByRole('button', { name: 'Hacer pedido' })).toBeVisible();
//   });
// });
