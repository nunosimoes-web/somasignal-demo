import { normalize } from '../lib/text'

/** `now` = liga 112; `today` = liga SNS 24 (808 24 24 24). */
export type SignLevel = 'now' | 'today'
export type Sign = { level: SignLevel; text: string }

/**
 * Listas de confirmação por zona, adaptadas das caixas de alerta das páginas do NHS
 * (consultadas em 2026-11-25; URL em cada grupo). Não são exaustivas nem validadas
 * clinicamente: ver docs/ROADMAP-conversao.md, item 1.
 */
export const zoneSigns = {
  // https://www.nhs.uk/conditions/headaches/
  head: [
    { level: 'now', text: 'Dor súbita e extremamente forte' },
    { level: 'now', text: 'Fraqueza ou dormência na cara ou no corpo, dificuldade em falar, em andar ou em lembrar' },
    { level: 'now', text: 'Perda de visão, confusão, sonolência ou convulsão' },
    { level: 'now', text: 'Febre muito alta com rigidez do pescoço, luz que incomoda ou manchas que não desaparecem ao pressionar' },
    { level: 'now', text: 'Pancada na cabeça nos últimos 3 meses' },
    { level: 'today', text: 'Dor com vómitos, alterações da visão ou dor no maxilar ao comer' },
  ],
  // https://www.nhs.uk/conditions/temporomandibular-disorder-tmd/ e /symptoms/chest-pain/
  jaw: [
    { level: 'now', text: 'Dor no maxilar com dor ou aperto no peito, suor, enjoo ou falta de ar' },
    { level: 'today', text: 'Não consegues comer, beber ou abrir bem a boca' },
    { level: 'today', text: 'Dor de cabeça forte e frequente, dor no couro cabeludo ou alteração da visão' },
  ],
  // https://www.nhs.uk/conditions/headaches/ e /symptoms/shoulder-pain/
  neck: [
    { level: 'now', text: 'Rigidez do pescoço com febre muito alta, luz que incomoda ou manchas na pele' },
    { level: 'now', text: 'Dor no pescoço com dor ou aperto no peito, suor, enjoo ou falta de ar' },
    { level: 'now', text: 'Fraqueza ou dormência na cara ou no corpo, ou dificuldade em falar' },
    { level: 'today', text: 'Formigueiro que não passa ou falta de sensibilidade no braço' },
    { level: 'today', text: 'Começou depois de uma queda ou de um acidente' },
  ],
  // https://www.nhs.uk/symptoms/chest-pain/
  chest: [
    { level: 'now', text: 'Dor ou desconforto súbito no peito que não passa' },
    { level: 'now', text: 'Aperto, pressão, ardor ou peso no peito neste momento' },
    { level: 'now', text: 'Dor que se espalha para braço, pescoço, maxilar, barriga ou costas' },
    { level: 'now', text: 'Dor com suor, enjoo, tonturas ou falta de ar' },
    { level: 'today', text: 'Dor no peito que vai e vem e ainda não foi avaliada' },
  ],
  // https://www.nhs.uk/symptoms/shoulder-pain/ e /symptoms/chest-pain/
  shoulders: [
    { level: 'now', text: 'Dor no ombro ou no braço com dor ou aperto no peito, suor, enjoo ou falta de ar' },
    { level: 'today', text: 'Dor súbita ou muito forte, ou não consegues mexer o braço' },
    { level: 'today', text: 'Inchaço, mudança de forma, formigueiro que não passa ou falta de sensibilidade' },
    { level: 'today', text: 'Começou depois de uma queda, ou sentes febre ou mal-estar' },
  ],
  // https://www.nhs.uk/conditions/back-pain/
  back: [
    { level: 'now', text: 'Dor, formigueiro, fraqueza ou dormência nas duas pernas' },
    { level: 'now', text: 'Perda de sensibilidade à volta dos genitais ou do ânus' },
    { level: 'now', text: 'Dificuldade em urinar, ou perda de controlo da bexiga ou do intestino' },
    { level: 'now', text: 'Mudança recente na sensibilidade ou na função sexual' },
    { level: 'now', text: 'Dor no peito, ou dor depois de um acidente grave' },
  ],
  // https://www.nhs.uk/symptoms/stomach-ache/
  stomach: [
    { level: 'now', text: 'Dor que começou de repente e é muito forte' },
    { level: 'now', text: 'Vómito com sangue, verde ou como borras de café' },
    { level: 'now', text: 'Muito sangue nas fezes, ou fezes pretas e pegajosas' },
    { level: 'now', text: 'Não consegues urinar, evacuar ou libertar gases' },
    { level: 'now', text: 'Dificuldade em respirar, ou manchas que não desaparecem ao pressionar' },
    { level: 'today', text: 'Gravidez, sangue nas fezes, ou dor que piora de repente' },
    { level: 'today', text: 'Vómitos ou diarreia que não passam ao fim de uns dias' },
  ],
  // https://www.nhs.uk/symptoms/elbow-and-arm-pain/
  arm: [
    { level: 'now', text: 'Dor súbita no braço com peso, pressão ou aperto no peito' },
    { level: 'today', text: 'Dor forte com dificuldade em mexer, dormência ou formigueiro' },
    { level: 'today', text: 'Estalo numa lesão, mudança de forma, ou inchaço com febre' },
    { level: 'today', text: 'Dor que aparece no esforço e passa com o repouso' },
  ],
  // https://www.nhs.uk/symptoms/pelvic-pain/
  pelvis: [
    { level: 'now', text: 'Dor muito forte, a piorar, ou que dói ao mexer ou ao tocar' },
    { level: 'now', text: 'Desmaio, tonturas, confusão, dificuldade em respirar ou dor na ponta do ombro' },
    { level: 'now', text: 'Hemorragia vaginal intensa' },
    { level: 'today', text: 'Gravidez ou possibilidade de gravidez' },
    { level: 'today', text: 'Febre, sangue na urina ou nas fezes, corrimento ou sangramento fora do habitual' },
    { level: 'today', text: 'Dificuldade ou dor ao urinar, ou vómitos e diarreia' },
  ],
  // https://www.nhs.uk/symptoms/hip-pain/
  hips: [
    { level: 'now', text: 'Dor muito forte depois de uma queda ou lesão' },
    { level: 'now', text: 'Não consegues andar nem apoiar a perna' },
    { level: 'now', text: 'Formigueiro ou perda de sensibilidade depois de uma lesão' },
    { level: 'today', text: 'Dor súbita e forte sem queda' },
    { level: 'today', text: 'Anca inchada e quente, pele com outra cor, ou febre e mal-estar' },
  ],
  // https://www.nhs.uk/symptoms/knee-pain/
  knees: [
    { level: 'today', text: 'Dor muito forte, ou não consegues mexer o joelho ou apoiar o peso' },
    { level: 'today', text: 'Joelho muito inchado ou com outra forma' },
    { level: 'today', text: 'Joelho que bloqueia, cede ou estala com dor' },
    { level: 'today', text: 'Febre, com vermelhidão ou calor à volta do joelho' },
  ],
  // https://www.nhs.uk/conditions/deep-vein-thrombosis-dvt/ e /conditions/back-pain/
  legs: [
    { level: 'now', text: 'Dor e inchaço na perna com falta de ar ou dor no peito' },
    { level: 'now', text: 'Fraqueza ou dormência nas duas pernas' },
    { level: 'today', text: 'Dor e inchaço numa perna, sobretudo com calor ou mudança de cor' },
  ],
  // https://www.nhs.uk/symptoms/foot-pain/ankle-pain/
  foot: [
    { level: 'today', text: 'Dor muito forte, ou não consegues andar' },
    { level: 'today', text: 'Mudança de forma ou ângulo estranho no tornozelo ou no pé' },
    { level: 'today', text: 'Estalo na altura da lesão, ou sentires-te a desmaiar, com tonturas ou enjoo' },
  ],
} satisfies Record<string, Sign[]>

export type ZoneSignsId = keyof typeof zoneSigns

export type Alert = {
  kind: 'crisis' | 'physical'
  level: SignLevel
  labels: string[]
}

type Rule = { label: string; level: SignLevel; pattern: RegExp }

/** Todas as expressões são testadas contra texto normalizado (sem acentos, minúsculas). */
const crisisRules: RegExp[] = [
  /\b(quero|queria|vou|penso em|pensei em|pensar em|apetece-me|so me apetece|vontade de) (morrer|matar-me|me matar|acabar com a vida|acabar com a minha vida|acabar com tudo|desaparecer para sempre)\b/,
  /\bnao (quero|queria|me apetece|vale a pena|aguento|consigo) (mais )?(viver|estar viv[oa]|continuar a viver)\b/,
  /\b(suicid\w*|matar-me|mato-me|matava-me|automutil\w*|auto-mutil\w*)/,
  /\b(cort(o|ei|ar)-me de proposito|fazer-me mal|magoar-me de proposito|magoo-me de proposito)\b/,
  /\b(acabar com|por fim|por termo) (a )?(a )?(minha )?vida\b/,
  /\b(estaria|estava|estavam|ficavam|ficariam) melhor (morto|morta|sem mim)\b/,
  /\bpreferia (estar morto|estar morta|morrer|nao acordar)\b/,
  /\btomei (muitos|demasiados|todos os|uma data de) (comprimidos|medicamentos)\b/,
]

const physicalRules: Rule[] = [
  { label: 'dificuldade em respirar', level: 'now', pattern: /\b(falta de ar|falta-me o ar|falta o ar|sem ar|nao (consigo|posso) respirar|(dificuldade|dificuldades|custa-me|custa) (em |a )?respirar|sufoc\w*)/ },
  { label: 'desmaio ou perda de consciência', level: 'now', pattern: /\b(desmai\w*|perdi (a consciencia|os sentidos)|perda de consciencia)/ },
  { label: 'fraqueza ou perda de força', level: 'now', pattern: /\b(perda de forca|perd(i|o|eu) (a )?forca|sem forca|falta de forca|fraqueza|paralis\w*|nao (sinto|consigo mexer|mexo) (a|o|as|os|uma|um) (perna|pernas|braco|bracos|lado|mao|maos|cara))/ },
  { label: 'dificuldade em falar, boca ao lado ou confusão', level: 'now', pattern: /\b(dificuldade (em|a) falar|nao consigo falar|fala (arrastada|enrolada)|boca ao lado|cara (caida|descaida)|confus(ao mental|o e desorientad\w*)|desorientad\w*|convuls\w*)/ },
  { label: 'alteração da visão', level: 'now', pattern: /\b(perdi a visao|perda de visao|deixei de ver|nao vejo de um olho|visao dupla|vejo a dobrar)/ },
  { label: 'dor súbita', level: 'now', pattern: /\b(subit[oa]s?|subitamente|de repente|repentin[oa]s?)\b/ },
  { label: 'dor muito forte', level: 'now', pattern: /\b(insuportave(l|is)|pior dor|dor (horrivel|extrema|extremamente forte|muito forte|fortissima)|nao aguento (a|esta|com a) dor)/ },
  { label: 'peito com sinais associados', level: 'now', pattern: /^(?=.*\b(peito|toracic[oa]|coracao)\b)(?=.*\b(braco|maxilar|mandibula|suor|suores|suar|enjoo|enjoad\w*|nausea|nauseas|vomit\w*|tontur\w*|espalha\w*|irradia\w*|dormente|dormencia)\b)/ },
  { label: 'aperto ou pressão no peito', level: 'now', pattern: /^(?=.*\b(peito|toracic[oa]|coracao)\b)(?=.*\b(agora|neste momento|nao passa|nao para)\b)/ },
  { label: 'dormência na zona genital ou alteração da bexiga/intestino', level: 'now', pattern: /(dormen\w*|sensibilidade|nao sinto).{0,40}(genita\w*|anus|virilha|vagina|penis)|\b(incontinenc\w*|nao consigo urinar|nao consigo fazer xixi|perdi o controlo d[ao] (bexiga|intestino)|urinei sem querer)/ },
  { label: 'dormência ou fraqueza nas duas pernas', level: 'now', pattern: /^(?=.*\b(duas pernas|ambas as pernas|as pernas)\b)(?=.*\b(dormen\w*|fraqueza|formigueiro|nao sinto)\b)/ },
  { label: 'sangue', level: 'now', pattern: /\b(vomit\w* (com )?sangue|sangue (nas fezes|no vomito|na urina)|fezes pretas|hemorragia|sangramento (forte|intenso))/ },
  { label: 'pancada na cabeça ou acidente', level: 'now', pattern: /\b(bati (com )?a cabeca|bati com a cabeca|pancada na cabeca|traumatismo|acidente (de carro|de mota|grave)|fui atropelad[oa])/ },
  { label: 'febre', level: 'today', pattern: /\b(febre|febril|arrepios de frio)\b/ },
  { label: 'inchaço numa perna', level: 'today', pattern: /^(?=.*\b(perna|gemeo|barriga da perna|coxa)\b)(?=.*\b(inchad[oa]|inchaco|inchou|quente|vermelh[oa])\b)/ },
  { label: 'gravidez', level: 'today', pattern: /\b(gravida|gravidez)\b/ },
  { label: 'perda de peso sem explicação', level: 'today', pattern: /\b(perdi (muito )?peso sem|perda de peso (sem|inexplicad\w*))/ },
]

/**
 * Opção deliberada: não tentamos interpretar negações («não tenho febre»).
 * Um falso alarme custa um toque em «Não é o meu caso»; um sinal perdido custa muito mais.
 */
export function detectAlert(text: string): Alert | null {
  const normalized = normalize(text)

  if (crisisRules.some((rule) => rule.test(normalized))) {
    return { kind: 'crisis', level: 'now', labels: [] }
  }

  const hits = physicalRules.filter((rule) => rule.pattern.test(normalized))
  if (hits.length === 0) {
    return null
  }

  return {
    kind: 'physical',
    level: hits.some((hit) => hit.level === 'now') ? 'now' : 'today',
    labels: hits.map((hit) => hit.label),
  }
}

/** Confirmados nas fontes oficiais em 2026-11-25 (ver docs/AUDITORIA-conversao.md). */
export const contacts = {
  emergency: { label: 'Ligar 112', number: '112', href: 'tel:112' },
  sns24: { label: 'Ligar SNS 24 · 808 24 24 24', number: '808 24 24 24', href: 'tel:808242424' },
  prevention: { label: 'Ligar 1411', number: '1411', href: 'tel:1411' },
}
