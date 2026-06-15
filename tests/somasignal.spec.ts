import { expect, test } from '@playwright/test'

test('simple symptom flow works across map, chat and result', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Onde doi/ })).toBeVisible()
  await expect(page.getByText('1. Escolhe a zona')).toBeVisible()
  await expect(page.getByText('2. Conta-me o que sentes')).toBeVisible()
  await expect(page.getByText('3. Causas e solucoes')).toBeVisible()

  await page.getByRole('button', { name: /Dor no cotovelo/ }).click()
  await expect(page.getByRole('heading', { name: 'Cotovelos' })).toBeVisible()
  await expect(page.getByText(/esforco repetido/)).toBeVisible()

  await page.getByRole('button', { name: /Joelho doi/ }).click()
  await expect(page.getByRole('heading', { name: 'Joelhos' })).toBeVisible()
  await expect(page.getByText(/suporte, direccao/)).toBeVisible()

  await page.getByLabel('Descrever dor').fill('Tenho falta de ar e dor no peito')
  await page.getByLabel('Enviar').click()
  await expect(page.getByText(/avaliacao medica/).first()).toBeVisible()
})
