import { test, expect } from '@playwright/test'

// Mock the API route at the browser-fetch level so no real server or Telegram
// call is required. The server-side Telegram integration is covered by the
// Vitest integration tests in src/tests/integration/reservas-api.test.ts.
async function mockReservasApi(page: Parameters<typeof test.beforeEach>[0]['page'], response = { ok: true }) {
  await page.route('/api/reservas', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    }),
  )
}

const STORAGE_KEY = 'reservas_submissions'
const MAX_PER_DAY = 6

test.describe('Reservas form', () => {
  test('shows the form on load', async ({ page }) => {
    await mockReservasApi(page)
    await page.goto('/reservas')
    await expect(page.getByLabel('Tu nombre')).toBeVisible()
    await expect(page.getByLabel('Tu email')).toBeVisible()
    await expect(page.getByLabel('Tu teléfono')).toBeVisible()
    await expect(page.getByLabel('Detalle del encargo')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enviar encargo' })).toBeVisible()
  })

  test('shows success state after a valid submission', async ({ page }) => {
    await mockReservasApi(page)
    await page.goto('/reservas')

    await page.getByLabel('Tu nombre').fill('Test User')
    await page.getByLabel('Tu email').fill('test@example.com')
    await page.getByLabel('Tu teléfono').fill('+54 11 1234-5678')
    await page.getByLabel('Detalle del encargo').fill('Ibuprofeno 400mg')
    await page.getByRole('button', { name: 'Enviar encargo' }).click()

    await expect(page.getByText('¡Encargo recibido!')).toBeVisible()
  })

  test('shows error message when the API returns an error', async ({ page }) => {
    await page.route('/api/reservas', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    )
    await page.goto('/reservas')

    await page.getByLabel('Tu nombre').fill('Test User')
    await page.getByLabel('Tu email').fill('test@example.com')
    await page.getByLabel('Tu teléfono').fill('+54 11 1234-5678')
    await page.getByLabel('Detalle del encargo').fill('Ibuprofeno 400mg')
    await page.getByRole('button', { name: 'Enviar encargo' }).click()

    await expect(page.getByText('Hubo un error al enviar el encargo')).toBeVisible()
  })

  test('shows rate-limit screen when daily limit is reached', async ({ page }) => {
    // Inject localStorage before the page loads so React reads count=6 on init
    await page.addInitScript((key) => {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(key, JSON.stringify({ date: today, count: 6 }))
    }, STORAGE_KEY)

    await page.goto('/reservas')

    await expect(page.getByText('Límite diario alcanzado')).toBeVisible()
    await expect(page.getByText(`${MAX_PER_DAY} encargos por día`)).toBeVisible()
  })

  test('browser validates required fields before submitting', async ({ page }) => {
    await mockReservasApi(page)
    await page.goto('/reservas')

    // Click submit without filling anything — browser required validation fires
    await page.getByRole('button', { name: 'Enviar encargo' }).click()

    // Success state must NOT appear
    await expect(page.getByText('¡Encargo recibido!')).not.toBeVisible()

    // The route should not have been called
    let called = false
    await page.route('/api/reservas', () => { called = true })
    expect(called).toBe(false)
  })
})
