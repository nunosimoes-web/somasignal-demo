import type { Analysis } from './analysis'

export type CheckIn = { action: string; before: number; after: number }

export function describeChange({ before, after }: Pick<CheckIn, 'before' | 'after'>): string {
  if (after < before) {
    return `Desceu de ${before} para ${after}. É uma pista, não uma prova: repete noutro dia e vê se acontece de novo.`
  }
  if (after > before) {
    return `Subiu de ${before} para ${after}. Para este passo por agora. Se continuar a subir, fala com um profissional de saúde.`
  }
  return `Ficou em ${before}. Também é informação: experimenta outro passo ou repete num momento diferente do dia.`
}

/** Resumo em texto simples para levar a uma consulta. Só inclui o que a pessoa escreveu ou escolheu. */
export function buildSummary(
  analysis: Analysis,
  words: string[],
  checkIns: CheckIn[],
  date: Date,
  /** Sinais de alerta que a pessoa disse não ter: um clínico quer saber o que foi excluído. */
  clearedSigns: string[] = [],
): string {
  const lines = [
    'SomaSignal: resumo para levar a uma consulta',
    `Data: ${date.toLocaleDateString('pt-PT')}`,
    `Zona: ${analysis.region.label}`,
  ]

  if (words.length > 0) {
    lines.push('', 'O que escrevi:', ...words.map((word) => `- ${word}`))
  }
  if (clearedSigns.length > 0) {
    lines.push('', 'Sinais de alerta que confirmei não ter:', ...clearedSigns.map((sign) => `- ${sign}`))
  }
  if (analysis.themes.length > 0) {
    lines.push('', `Contexto que mencionei: ${analysis.themes.map((theme) => theme.label).join(', ')}`)
  }
  if (checkIns.length > 0) {
    lines.push(
      '',
      'O que experimentei (intensidade de 0 a 10):',
      ...checkIns.map((entry) => `- ${entry.action}: antes ${entry.before}, depois ${entry.after}`),
    )
  }
  lines.push('', 'Perguntas que quero observar:', ...analysis.questions.map((question) => `- ${question}`))
  lines.push('', 'Este resumo não é um diagnóstico. Foi escrito por mim com a ajuda de uma demonstração exploratória.')

  return lines.join('\n')
}
