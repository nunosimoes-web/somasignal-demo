import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

async function expectNoSeriousA11yIssues(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  const serious = violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
  expect(serious.map((violation) => `${violation.id}: ${violation.nodes.map((node) => node.target).join(' | ')}`)).toEqual([])
}

const result = (page: Page) => page.locator('#resultado')

test.describe('landing', () => {
  test('mostra a proposta, os CTA e o SEO básico', async ({ page }) => {
    await page.goto('./')
    await expect(page).toHaveTitle(/SomaSignal/)
    await expect(page.getByRole('heading', { level: 1, name: /Onde dói\?/ })).toBeVisible()
    await expect(page.getByRole('link', { name: /Começar pelo mapa/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ver um exemplo' }).first()).toBeVisible()
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /sinais de alerta/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-image\.png$/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /somasignal-demo\/$/)

    const faqSchema = JSON.parse((await page.locator('#schema-faq').textContent()) ?? '{}')
    expect(faqSchema['@type']).toBe('FAQPage')
    await expect(page.locator('#perguntas details')).toHaveCount(faqSchema.mainEntity.length)
    await expect(page.getByRole('heading', { name: /A tua privacidade/ })).toBeAttached()
  })

  test('o exemplo do hero abre o fluxo com a zona certa', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: /Experimentar este exemplo/ }).click()
    await expect(result(page).getByRole('heading', { name: /Pescoço: confirma primeiro/ })).toBeFocused()
  })

  test('não tem problemas de acessibilidade graves', async ({ page }) => {
    await page.goto('./')
    await expectNoSeriousA11yIssues(page)
  })

  test('não tem deslocamento horizontal', async ({ page }) => {
    await page.goto('./')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
})

test.describe('fluxo principal', () => {
  test('exemplo → sinais → resultado → passo medido → registo', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: /Tensão no pescoço/ }).click()

    await expect(result(page).getByRole('heading', { name: /Pescoço: confirma primeiro/ })).toBeFocused()
    await page.getByRole('button', { name: 'Nenhum destes' }).click()

    await expect(result(page).getByRole('heading', { name: 'Pescoço', exact: true })).toBeVisible()
    await expect(result(page).getByText('Porque vês isto:')).toBeVisible()
    await expect(result(page).getByText(/ecrã ou posição parada/).first()).toBeVisible()

    const runner = result(page).locator('.step-runner')
    await runner.getByRole('radio', { name: '6', exact: true }).check()
    await runner.getByRole('button', { name: 'Começar' }).click()
    await expect(runner.getByRole('timer')).toBeVisible()
    await runner.getByRole('button', { name: 'Terminar agora' }).click()
    await runner.getByRole('radio', { name: '3', exact: true }).check()
    await runner.getByRole('button', { name: 'Ver o que mudou' }).click()
    await expect(runner.getByText(/Desceu de 6 para 3/)).toBeVisible()

    const summary = result(page).locator('.summary-card pre')
    await expect(summary).toContainText('antes 6, depois 3')
    await expect(summary).toContainText('Sinais de alerta que confirmei não ter:')
    await runner.getByRole('button', { name: 'Guardar neste dispositivo' }).click()

    const journal = page.getByRole('region', { name: 'Os teus registos' })
    await expect(journal).toContainText('6 → 3')
    await expectNoSeriousA11yIssues(page)

    await journal.getByRole('button', { name: 'Apagar tudo' }).click()
    await expect(journal).toHaveCount(0)
  })

  test('zona no mapa e sinais confirmados levam aos contactos', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('group', { name: 'Zonas do corpo' }).getByRole('button', { name: 'Joelhos' }).click()
    await expect(page.getByText('Zona escolhida: Joelhos.')).toBeVisible()
    await result(page).getByRole('button', { name: 'Sim, ou não tenho a certeza' }).click()
    await expect(result(page).getByRole('alert')).toContainText('Fala com um profissional antes de continuares')
    await expect(result(page).getByRole('link', { name: /SNS 24/ })).toHaveAttribute('href', 'tel:808242424')
  })

  test('estado vazio explica o que vem e oferece um exemplo', async ({ page }) => {
    await page.goto('./')
    await expect(result(page).getByRole('heading', { name: 'O teu mapa aparece aqui' })).toBeVisible()
    await result(page).getByRole('button', { name: 'Ver um exemplo' }).click()
    await expect(result(page).getByRole('heading', { name: /confirma primeiro/ })).toBeVisible()
  })

  test('envio vazio mostra ajuda em vez de falhar em silêncio', async ({ page }) => {
    await page.goto('./')
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(page.getByRole('alert')).toContainText('Escreve pelo menos a zona')
  })
})

test.describe('segurança', () => {
  test('sinais físicos urgentes param o mapa e mostram o 112', async ({ page }) => {
    await page.goto('./')
    await page.getByLabel('Descreve a dor por palavras tuas').fill('Tenho falta de ar e dor no peito')
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(result(page).getByRole('alert')).toContainText('dificuldade em respirar')
    await expect(result(page).getByRole('link', { name: 'Ligar 112' })).toHaveAttribute('href', 'tel:112')
    await result(page).getByRole('button', { name: /Não é o meu caso/ }).click()
    await expect(result(page).getByRole('heading', { name: /Peito: confirma primeiro/ })).toBeVisible()
  })

  test('sinais de crise mostram a linha 1411', async ({ page }) => {
    await page.goto('./')
    await page.getByLabel('Descreve a dor por palavras tuas').fill('dói-me o peito e penso em acabar com a minha vida')
    await page.getByRole('button', { name: 'Enviar' }).click()
    await expect(result(page).getByRole('heading', { name: /Vamos parar o mapa aqui/ })).toBeVisible()
    await expect(result(page).getByRole('link', { name: 'Ligar 1411' })).toHaveAttribute('href', 'tel:1411')
  })
})

test.describe('mobile', () => {
  test('a barra leva ao resultado quando ele está fora do ecrã', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'só em ecrã estreito')
    await page.goto('./')
    await page.getByRole('group', { name: 'Zonas do corpo' }).getByRole('button', { name: 'Ombros' }).click()
    const bar = page.getByRole('link', { name: /Ombros: confirma os sinais/ })
    await expect(bar).toBeVisible()
    await bar.click()
    await expect(result(page).getByRole('heading', { name: /Ombros: confirma primeiro/ })).toBeInViewport()
    await expect(bar).toBeHidden()
  })
})
