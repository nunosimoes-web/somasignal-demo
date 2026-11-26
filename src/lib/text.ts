/** Minúsculas, sem acentos e com espaços simples: «Súbita» e «subita» passam a ser a mesma coisa. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Procura uma expressão como palavra inteira. Sem isto, «pe» (pés) encontrava-se
 * dentro de «pescoço», «pensar» ou «pressão» e desviava o resultado para a zona errada.
 * Um `*` no fim aceita qualquer terminação: `ansios*` apanha ansioso, ansiosa e ansiosos.
 */
export function includesTerm(normalizedText: string, term: string): boolean {
  const open = term.endsWith('*')
  const base = normalize(open ? term.slice(0, -1) : term)
  if (!base) {
    return false
  }
  const pattern = `(?<![\\p{L}\\p{N}])${escapeRegExp(base)}${open ? '' : '(?![\\p{L}\\p{N}])'}`
  return new RegExp(pattern, 'u').test(normalizedText)
}
