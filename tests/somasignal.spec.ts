import { expect, test } from '@playwright/test'

test('analysis controls update the interpretation surface', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /Dor lombar/ }).click()
  await expect(page.getByRole('heading', { name: 'Costas' })).toBeVisible()

  await page.getByRole('button', { name: 'Zona corporal' }).click()
  await expect(page.getByText('Correspondencia corpo-texto')).toBeVisible()
  await expect(page.getByText(/Texto detectou: lombar -> Costas/)).toBeVisible()

  await page.getByRole('button', { name: 'Contexto emocional' }).click()
  await expect(page.getByText('Hipoteses emocionais para entrevista')).toBeVisible()
  await expect(page.getByText(/Pistas: sozinho, carrego/)).toBeVisible()

  await page.getByRole('button', { name: /caminhada curta/ }).click()
  await expect(page.getByText('Intervencao somatica curta')).toBeVisible()
  await expect(page.getByText(/Comparar intensidade antes\/depois/)).toBeVisible()
})
