import { describe, expect, it } from 'vitest'
import { faq } from '../data/faq'
import { analyse } from '../lib/analysis'
import { parseJournal } from '../lib/journal'
import { faqJsonLd } from '../lib/schema'
import { buildSummary, describeChange } from '../lib/summary'

const entry = { date: '2026-11-25T10:00:00.000Z', regionId: 'neck', action: 'Movimento suave', before: 6, after: 4 }

describe('parseJournal', () => {
  it('ignora dados vazios ou corrompidos', () => {
    expect(parseJournal(null)).toEqual([])
    expect(parseJournal('{não é json')).toEqual([])
    expect(parseJournal('{"a":1}')).toEqual([])
  })

  it('filtra entradas inválidas e mantém as válidas', () => {
    const raw = JSON.stringify([entry, { ...entry, regionId: 'nariz' }, { ...entry, before: 11 }, { ...entry, date: 'ontem' }])
    expect(parseJournal(raw)).toEqual([entry])
  })

  it('guarda no máximo 20 registos', () => {
    expect(parseJournal(JSON.stringify(Array.from({ length: 30 }, () => entry)))).toHaveLength(20)
  })
})

describe('describeChange', () => {
  it('cobre descida, subida e igual', () => {
    expect(describeChange({ before: 6, after: 3 })).toMatch(/^Desceu de 6 para 3/)
    expect(describeChange({ before: 3, after: 6 })).toMatch(/^Subiu de 3 para 6/)
    expect(describeChange({ before: 4, after: 4 })).toMatch(/^Ficou em 4/)
  })
})

describe('buildSummary', () => {
  it('só inclui o que a pessoa escreveu e experimentou', () => {
    const words = ['Tensão no pescoço ao fim de um dia ao computador']
    const text = buildSummary(analyse('neck', words[0]), words, [{ action: 'Pausa de ecrã', before: 5, after: 3 }], new Date('2026-11-25'))
    expect(text).toContain('Zona: Pescoço')
    expect(text).toContain(`- ${words[0]}`)
    expect(text).toContain('- Pausa de ecrã: antes 5, depois 3')
    expect(text).toContain('não é um diagnóstico')
  })

  it('lista os sinais de alerta excluídos', () => {
    const text = buildSummary(analyse('knees', ''), [], [], new Date('2026-11-25'), ['Joelho muito inchado'])
    expect(text).toContain('Sinais de alerta que confirmei não ter:\n- Joelho muito inchado')
  })

  it('sem texto nem passos, não inventa secções', () => {
    const text = buildSummary(analyse('knees', ''), [], [], new Date('2026-11-25'))
    expect(text).not.toContain('O que escrevi')
    expect(text).not.toContain('O que experimentei')
    expect(text).not.toContain('confirmei não ter')
  })
})

describe('faqJsonLd', () => {
  it('tem uma pergunta por cada pergunta da página', () => {
    const data = JSON.parse(faqJsonLd(faq))
    expect(data['@type']).toBe('FAQPage')
    expect(data.mainEntity).toHaveLength(faq.length)
    expect(data.mainEntity[0].name).toBe(faq[0].question)
  })

  it('não deixa fechar o <script> a partir do texto', () => {
    expect(faqJsonLd([{ question: '</script>', answer: 'x' }])).not.toContain('</script>')
  })
})
