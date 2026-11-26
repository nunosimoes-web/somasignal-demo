import { regionById, regions, type Region, type RegionId } from '../data/regions'
import { themes, type Theme } from '../data/themes'
import { includesTerm, normalize } from './text'

/** Zonas mencionadas no texto, por ordem de relevância (expressões mais específicas primeiro). */
export function findRegions(text: string): Region[] {
  let normalized = normalize(text)
  // «barriga da perna» é perna e «baixo ventre» é pelve: retira-se a expressão composta
  // antes de procurar as palavras soltas que ela contém.
  const found: { region: Region; weight: number; position: number }[] = []
  const compound = regions
    .flatMap((region) => region.keywords.filter((keyword) => keyword.includes(' ')).map((keyword) => ({ region, keyword })))
    .sort((a, b) => b.keyword.length - a.keyword.length)

  for (const { region, keyword } of compound) {
    if (includesTerm(normalized, keyword)) {
      found.push({ region, weight: 2, position: normalized.indexOf(keyword) })
      // Preserva o comprimento para não alterar a posição das palavras seguintes.
      normalized = normalized.replaceAll(keyword, ' '.repeat(keyword.length))
    }
  }

  for (const region of regions) {
    const hits = region.keywords.filter((keyword) => !keyword.includes(' ') && includesTerm(normalized, keyword))
    if (hits.length === 0) {
      continue
    }
    const position = Math.min(...hits.map((hit) => normalized.search(new RegExp(`(?<![\\p{L}\\p{N}])${hit}`, 'u'))))
    const existing = found.find((entry) => entry.region.id === region.id)
    if (existing) {
      existing.weight += hits.length
    } else {
      found.push({ region, weight: hits.length, position })
    }
  }

  return found.sort((a, b) => b.weight - a.weight || a.position - b.position).map((entry) => entry.region)
}

export function findThemes(text: string): Theme[] {
  const normalized = normalize(text)
  return themes.filter((theme) => theme.terms.some((term) => includesTerm(normalized, term)))
}

/** A dor dura há semanas, meses ou anos: muda o conselho final. */
export function isPersistent(text: string): boolean {
  const normalized = normalize(text)
  return (
    /\b(ha|faz|desde ha|durante) (\w+ )?(varias |muitas |algumas |umas |uns |alguns |muitos |varios )?(semanas|meses|mes|anos|ano)\b/.test(normalized) ||
    /\b(cronic[oa]s?|ha muito tempo|nao passa ha)\b/.test(normalized)
  )
}

export type Analysis = {
  region: Region
  otherRegions: Region[]
  themes: Theme[]
  persistent: boolean
  questions: string[]
}

export function analyse(regionId: RegionId, text: string): Analysis {
  const region = regionById.get(regionId) as Region
  const matchedThemes = findThemes(text)

  return {
    region,
    otherRegions: findRegions(text).filter((other) => other.id !== region.id).slice(0, 3),
    themes: matchedThemes,
    persistent: isPersistent(text),
    questions: [...matchedThemes.slice(0, 2).map((theme) => theme.question), region.question],
  }
}
