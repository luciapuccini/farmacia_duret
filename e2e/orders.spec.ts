import { test, expect } from '@playwright/test'

const STORAGE_KEY = 'orders_submissions'
const MAX_PER_DAY = 6
const WHATSAPP_PHONE_NUMBER = '5491178942852'

async function captureWindowOpen(page: Parameters<typeof test.beforeEach>[0]['page']) {
  await page.addInitScript(() => {
    const win = window as typeof window & { __openedWhatsAppUrl?: string }
    win.open = ((url?: string | URL) => {
      win.__openedWhatsAppUrl = url?.toString()
      return null
    }) as typeof window.open
  })
}

test.describe('Orders form', () => {
  test('shows the form on load', async ({ page }) => {
    await page.goto('/orders')

    await expect(page.getByLabel('Nombre completo')).toBeVisible()
    await expect(page.getByLabel('Teléfono')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Comentarios para el farmacéutico')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeVisible()
  })

  test('opens WhatsApp with a prefilled order message after a valid submission', async ({ page }) => {
    await captureWindowOpen(page)
    await page.goto('/orders')

    await page.getByLabel('Nombre completo').fill('Test User')
    await page.getByLabel('Teléfono').fill('11 1234-5678')
    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel('Comentarios para el farmacéutico').fill('Ibuprofeno 400mg')
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()

    const openedUrl = await page.evaluate(() => {
      const win = window as typeof window & { __openedWhatsAppUrl?: string }
      return win.__openedWhatsAppUrl
    })

    expect(openedUrl).toBeTruthy()
    const whatsappUrl = new URL(openedUrl!)
    expect(whatsappUrl.origin).toBe('https://wa.me')
    expect(whatsappUrl.pathname).toBe(`/${WHATSAPP_PHONE_NUMBER}`)

    const message = whatsappUrl.searchParams.get('text')
    expect(message).toContain('Nuevo encargo')
    expect(message).toContain('Nombre: Test User')
    expect(message).toContain('Teléfono: +54 11 1234-5678')
    expect(message).toContain('Email: test@example.com')
    expect(message).toContain('Notas: Ibuprofeno 400mg')

    await expect(page.getByText('Mensaje listo en WhatsApp')).toBeVisible()
    await expect(page.getByText('tocá Enviar')).toBeVisible()
  })

  test('uses the selected country dial code in the WhatsApp message', async ({ page }) => {
    await captureWindowOpen(page)
    await page.goto('/orders')

    await page.getByLabel('Código de país').selectOption('+598')
    await page.getByLabel('Nombre completo').fill('Test User')
    await page.getByLabel('Teléfono').fill('99 123 456')
    await page.getByLabel('Comentarios para el farmacéutico').fill('Paracetamol')
    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()

    const openedUrl = await page.evaluate(() => {
      const win = window as typeof window & { __openedWhatsAppUrl?: string }
      return win.__openedWhatsAppUrl
    })

    expect(openedUrl).toBeTruthy()
    if (!openedUrl) return
    const message = new URL(openedUrl).searchParams.get('text')
    expect(message).toContain('Teléfono: +598 99 123 456')
  })

  test('does not submit while privacy consent is unchecked', async ({ page }) => {
    await captureWindowOpen(page)
    await page.goto('/orders')

    await page.getByRole('checkbox').uncheck()
    await expect(page.getByRole('button', { name: 'Enviar por WhatsApp' })).toBeDisabled()

    const openedUrl = await page.evaluate(() => {
      const win = window as typeof window & { __openedWhatsAppUrl?: string }
      return win.__openedWhatsAppUrl
    })
    expect(openedUrl).toBeUndefined()
  })

  test('shows rate-limit screen when daily limit is reached', async ({ page }) => {
    await page.addInitScript((key) => {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(key, JSON.stringify({ date: today, count: 6 }))
    }, STORAGE_KEY)

    await page.goto('/orders')

    await expect(page.getByText('Límite diario alcanzado')).toBeVisible()
    await expect(page.getByText(`${MAX_PER_DAY} encargos por día`)).toBeVisible()
  })

  test('browser validates required fields before opening WhatsApp', async ({ page }) => {
    await captureWindowOpen(page)
    await page.goto('/orders')

    await page.getByRole('button', { name: 'Enviar por WhatsApp' }).click()

    await expect(page.getByText('Mensaje listo en WhatsApp')).not.toBeVisible()

    const openedUrl = await page.evaluate(() => {
      const win = window as typeof window & { __openedWhatsAppUrl?: string }
      return win.__openedWhatsAppUrl
    })
    expect(openedUrl).toBeUndefined()
  })
})
