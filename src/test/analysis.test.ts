import { describe, expect, it } from 'vitest'
import { plans } from '../data/plans'
import { regions, starters } from '../data/regions'
import { zoneSigns } from '../data/safety'
import { analyse, findRegions, findThemes, isPersistent } from '../lib/analysis'

const ids = (text: string) => findRegions(text).map((region) => region.id)

describe('findRegions', () => {
  it('reconhece a zona descrita por palavras', () => {
    expect(ids('Dói-me a lombar ao fim do dia')[0]).toBe('back')
    expect(ids('Tensão no pescoço ao fim de um dia ao computador')[0]).toBe('neck')
  })

  it('dá prioridade a expressões compostas', () => {
    expect(ids('dor na barriga da perna')).toEqual(['legs'])
    expect(ids('dor no baixo ventre')).toEqual(['pelvis'])
  })

  it('não confunde «pe» com «pescoço» nem «pensar»', () => {
    expect(ids('estou sempre a pensar no pescoço')).toEqual(['neck'])
  })

  it('devolve vazio quando não há zona', () => {
    expect(ids('ando muito cansado')).toEqual([])
  })
})

describe('findThemes e isPersistent', () => {
  it('liga o texto a contextos', () => {
    const labels = findThemes('durmo mal e tenho prazos no trabalho').map((theme) => theme.id)
    expect(labels).toEqual(expect.arrayContaining(['work', 'sleep']))
  })

  it('deteta dor que dura há semanas ou meses', () => {
    expect(isPersistent('dor lombar há semanas')).toBe(true)
    expect(isPersistent('dói desde há uns meses')).toBe(true)
    expect(isPersistent('dói hoje à tarde')).toBe(false)
  })
})

describe('analyse', () => {
  it('junta perguntas dos contextos e a pergunta da zona', () => {
    const result = analyse('back', 'dor lombar há semanas e sinto que carrego tudo sozinho')
    expect(result.persistent).toBe(true)
    expect(result.themes.map((theme) => theme.id)).toContain('alone')
    expect(result.questions.at(-1)).toBe(result.region.question)
  })

  it('sem texto, mostra só a pergunta da zona', () => {
    const result = analyse('knees', '')
    expect(result.questions).toEqual([result.region.question])
    expect(result.otherRegions).toEqual([])
  })
})

describe('integridade dos dados', () => {
  it('cada zona tem passos e sinais de alerta válidos', () => {
    for (const region of regions) {
      expect(region.actions.length, region.id).toBeGreaterThan(0)
      for (const action of region.actions) {
        expect(plans[action.plan], `${region.id}/${action.plan}`).toBeDefined()
      }
      expect(zoneSigns[region.signs].length, region.id).toBeGreaterThan(0)
    }
  })

  it('cada exemplo da página leva a uma zona', () => {
    for (const starter of starters) {
      expect(findRegions(starter).length, starter).toBeGreaterThan(0)
    }
  })

  it('o mapa tem o mesmo número de zonas de cada lado', () => {
    const left = regions.filter((region) => region.side === 'left').length
    expect(left * 2).toBe(regions.length)
  })
})
