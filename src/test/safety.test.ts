import { describe, expect, it } from 'vitest'
import { contacts, detectAlert } from '../data/safety'
import { starters } from '../data/regions'

describe('detectAlert', () => {
  it('trata risco de suicídio como crise', () => {
    expect(detectAlert('às vezes penso em acabar com a minha vida')?.kind).toBe('crisis')
    expect(detectAlert('Não aguento mais viver assim')?.kind).toBe('crisis')
  })

  it('a crise tem prioridade sobre sinais físicos', () => {
    expect(detectAlert('tenho falta de ar e quero morrer')?.kind).toBe('crisis')
  })

  it('sinais físicos urgentes pedem 112', () => {
    const alert = detectAlert('Tenho falta de ar e dor no peito')
    expect(alert?.kind).toBe('physical')
    expect(alert?.level).toBe('now')
    expect(alert?.labels).toContain('dificuldade em respirar')
  })

  it('reconhece dor no peito que irradia para o braço', () => {
    expect(detectAlert('dor no peito que vai para o braço')?.labels).toContain('peito com sinais associados')
  })

  it('febre sozinha pede SNS 24', () => {
    expect(detectAlert('dói-me a cabeça e tenho febre')).toEqual({ kind: 'physical', level: 'today', labels: ['febre'] })
  })

  it('não dispara com acentos diferentes', () => {
    expect(detectAlert('dor SUBITA na cabeça')?.labels).toContain('dor súbita')
  })

  it('os exemplos da página não disparam alertas', () => {
    for (const starter of starters) {
      expect(detectAlert(starter), starter).toBeNull()
    }
  })
})

describe('contacts', () => {
  it('usa os números portugueses certos', () => {
    expect(contacts.emergency.href).toBe('tel:112')
    expect(contacts.sns24.href).toBe('tel:808242424')
    expect(contacts.prevention.href).toBe('tel:1411')
  })
})
