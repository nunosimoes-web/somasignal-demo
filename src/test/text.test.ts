import { describe, expect, it } from 'vitest'
import { includesTerm, normalize } from '../lib/text'

describe('normalize', () => {
  it('tira acentos, minúsculas e espaços a mais', () => {
    expect(normalize('  Dor   SÚBITA no Pescoço ')).toBe('dor subita no pescoco')
  })
})

describe('includesTerm', () => {
  it('encontra palavras inteiras, não pedaços de outras palavras', () => {
    expect(includesTerm(normalize('dói-me o pescoço'), 'pe')).toBe(false)
    expect(includesTerm(normalize('dói-me o pé'), 'pe')).toBe(true)
  })

  it('aceita qualquer terminação quando o termo acaba em *', () => {
    expect(includesTerm(normalize('ando ansiosa'), 'ansios*')).toBe(true)
    expect(includesTerm(normalize('ansiedade'), 'ansios*')).toBe(false)
  })

  it('ignora termos vazios', () => {
    expect(includesTerm('qualquer coisa', '*')).toBe(false)
  })
})
