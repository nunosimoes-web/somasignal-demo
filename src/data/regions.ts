import type { PlanId } from './plans'
import type { ZoneSignsId } from './safety'

export type RegionId =
  | 'head'
  | 'jaw'
  | 'neck'
  | 'chest'
  | 'shoulders'
  | 'back'
  | 'stomach'
  | 'elbows'
  | 'wrists'
  | 'hands'
  | 'pelvis'
  | 'hips'
  | 'knees'
  | 'legs'
  | 'ankles'
  | 'feet'

export type Region = {
  id: RegionId
  label: string
  /** Com artigo contraído, para frases como «a dor na barriga». */
  inPhrase: string
  /** Posição do ponto no desenho (viewBox 160×416) e coluna da etiqueta. */
  dot: [number, number]
  side: 'left' | 'right'
  summary: string
  /** Fatores do corpo e da rotina. */
  body: string[]
  /** Fatores do contexto, sempre como hipótese a observar. */
  context: string[]
  question: string
  actions: { label: string; plan: PlanId }[]
  signs: ZoneSignsId
  keywords: string[]
}

export const regions: Region[] = [
  {
    id: 'head',
    label: 'Cabeça',
    inPhrase: 'na cabeça',
    dot: [80, 26],
    side: 'left',
    summary: 'Descanso, ecrãs, hidratação e períodos de maior tensão costumam ser as primeiras coisas a observar.',
    body: ['noites mal dormidas', 'muitas horas de ecrã', 'refeições ou água em falta'],
    context: ['dias de muita exigência', 'preocupação que não larga'],
    question: 'Aparece a uma hora certa ou a seguir a um certo tipo de dia?',
    actions: [
      { label: 'Pausa de ecrã', plan: 'screen' },
      { label: 'Expirar mais devagar', plan: 'breath' },
      { label: 'Pôr a preocupação no papel', plan: 'write' },
    ],
    signs: 'head',
    keywords: ['cabeca', 'enxaqueca', 'enxaquecas', 'testa', 'tempora', 'temporas', 'tontura', 'tonturas'],
  },
  {
    id: 'jaw',
    label: 'Maxilar',
    inPhrase: 'no maxilar',
    dot: [80, 54],
    side: 'right',
    summary: 'Apertar os dentes, de dia ou a dormir, é uma das primeiras coisas a observar nesta zona.',
    body: ['apertar ou ranger os dentes', 'mastigar pastilha ou alimentos duros'],
    context: ['concentração prolongada', 'irritação que fica por dizer'],
    question: 'Como está o maxilar quando acordas e ao fim do dia?',
    actions: [
      { label: 'Contrair e soltar', plan: 'release' },
      { label: 'Calor e pausa', plan: 'warmth' },
      { label: 'Expirar mais devagar', plan: 'breath' },
    ],
    signs: 'jaw',
    keywords: ['maxilar', 'mandibula', 'dentes', 'bruxismo', 'queixo'],
  },
  {
    id: 'neck',
    label: 'Pescoço',
    inPhrase: 'no pescoço',
    dot: [80, 72],
    side: 'left',
    summary: 'Posições mantidas muito tempo e períodos de alerta constante costumam ser as primeiras coisas a observar.',
    body: ['muito tempo na mesma posição', 'ecrã baixo ou telemóvel', 'almofada ou posição de dormir'],
    context: ['estar sempre em alerta', 'dias sem pausas'],
    question: 'Quanto tempo passa entre te sentares e o pescoço começar a prender?',
    actions: [
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Pausa de ecrã', plan: 'screen' },
      { label: 'Expirar mais devagar', plan: 'breath' },
    ],
    signs: 'neck',
    keywords: ['pescoco', 'nuca', 'cervical', 'cervicais', 'torcicolo'],
  },
  {
    id: 'shoulders',
    label: 'Ombros',
    inPhrase: 'nos ombros',
    dot: [48, 98],
    side: 'left',
    summary: 'Carga, gestos repetidos e ombros levantados sem dar por isso costumam ser as primeiras coisas a observar.',
    body: ['carregar peso de um só lado', 'gestos repetidos', 'ombros subidos ao teclado'],
    context: ['acumular responsabilidades', 'dificuldade em delegar'],
    question: 'Os ombros descem quando paras, ou continuam subidos?',
    actions: [
      { label: 'Contrair e soltar', plan: 'release' },
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Pedir uma ajuda concreta', plan: 'ask' },
    ],
    signs: 'shoulders',
    keywords: ['ombro', 'ombros', 'trapezio', 'trapezios'],
  },
  {
    id: 'chest',
    label: 'Peito',
    inPhrase: 'no peito',
    dot: [92, 116],
    side: 'right',
    summary: 'Dor no peito pede sempre que se excluam primeiro causas físicas. Só depois faz sentido olhar para o contexto.',
    body: ['esforço recente dos músculos do peito', 'tosse ou posição curvada'],
    context: ['ansiedade ou sobressalto', 'perda ou tristeza recente'],
    question: 'Já foi avaliada por um profissional de saúde?',
    actions: [
      { label: 'Expirar mais devagar', plan: 'breath' },
      { label: 'Pedir uma ajuda concreta', plan: 'ask' },
      { label: 'Pôr a preocupação no papel', plan: 'write' },
    ],
    signs: 'chest',
    keywords: ['peito', 'coracao', 'toracica', 'toracico', 'costela', 'costelas'],
  },
  {
    id: 'back',
    label: 'Costas',
    inPhrase: 'nas costas',
    dot: [66, 150],
    side: 'left',
    summary: 'Movimento, carga, sono e períodos de maior tensão costumam ser as primeiras coisas a observar.',
    body: ['muitas horas sentado', 'carga fora do habitual', 'pouco movimento durante o dia'],
    context: ['sentir que tens de aguentar sem ajuda', 'preocupações prolongadas, como as financeiras'],
    question: 'Melhora quando te mexes um pouco, ou quando descansas?',
    actions: [
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Pedir uma ajuda concreta', plan: 'ask' },
      { label: 'Aliviar a carga', plan: 'load' },
    ],
    signs: 'back',
    keywords: ['costas', 'lombar', 'lombares', 'coluna', 'dorsal', 'ciatica', 'rins'],
  },
  {
    id: 'stomach',
    label: 'Barriga',
    inPhrase: 'na barriga',
    dot: [86, 168],
    side: 'right',
    summary: 'Refeições, ritmo do dia e antecipação de situações difíceis costumam ser as primeiras coisas a observar.',
    body: ['comer depressa ou a horas irregulares', 'certos alimentos, café ou álcool'],
    context: ['antecipar reuniões ou conversas', 'conflito por resolver'],
    question: 'Começa antes da situação difícil ou depois da refeição?',
    actions: [
      { label: 'Calor e pausa', plan: 'warmth' },
      { label: 'Expirar mais devagar', plan: 'breath' },
      { label: 'Pôr a preocupação no papel', plan: 'write' },
    ],
    signs: 'stomach',
    keywords: ['barriga', 'estomago', 'abdomen', 'abdominal', 'nausea', 'nauseas', 'enjoo', 'digestao', 'intestino', 'intestinos', 'azia'],
  },
  {
    id: 'elbows',
    label: 'Cotovelos',
    inPhrase: 'nos cotovelos',
    dot: [31, 166],
    side: 'left',
    summary: 'Gestos repetidos e força feita com o braço estendido costumam ser as primeiras coisas a observar.',
    body: ['gestos repetidos', 'agarrar com força', 'apoio do braço à secretária'],
    context: ['trabalhar com pressa e sem pausas'],
    question: 'Que gesto concreto a provoca?',
    actions: [
      { label: 'Aliviar a carga', plan: 'load' },
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Pausa de ecrã', plan: 'screen' },
    ],
    signs: 'arm',
    keywords: ['cotovelo', 'cotovelos', 'epicondilite'],
  },
  {
    id: 'wrists',
    label: 'Pulsos',
    inPhrase: 'nos pulsos',
    dot: [137, 212],
    side: 'right',
    summary: 'Teclado, telemóvel e gestos repetidos costumam ser as primeiras coisas a observar.',
    body: ['teclado e rato', 'telemóvel numa só mão', 'gestos repetidos'],
    context: ['prazos apertados e poucas pausas'],
    question: 'Muda nos dias em que usas menos o teclado ou o telemóvel?',
    actions: [
      { label: 'Pausa de ecrã', plan: 'screen' },
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Aliviar a carga', plan: 'load' },
    ],
    signs: 'arm',
    keywords: ['pulso', 'pulsos', 'punho', 'punhos', 'carpo'],
  },
  {
    id: 'hands',
    label: 'Mãos',
    inPhrase: 'nas mãos',
    dot: [20, 234],
    side: 'left',
    summary: 'Força repetida, frio e muitas horas de ecrã costumam ser as primeiras coisas a observar.',
    body: ['agarrar com força', 'frio', 'muitas horas de teclado ou telemóvel'],
    context: ['tensão que se nota em punhos fechados'],
    question: 'Reparas em punhos fechados ao longo do dia?',
    actions: [
      { label: 'Contrair e soltar', plan: 'release' },
      { label: 'Calor e pausa', plan: 'warmth' },
      { label: 'Pausa de ecrã', plan: 'screen' },
    ],
    signs: 'arm',
    keywords: ['mao', 'maos', 'dedo', 'dedos', 'polegar'],
  },
  {
    id: 'pelvis',
    label: 'Pelve',
    inPhrase: 'na pelve',
    dot: [80, 230],
    side: 'right',
    summary: 'Há muitas causas físicas possíveis. Uma avaliação ajuda; a tensão muscular é apenas uma das coisas a observar.',
    body: ['tensão muscular da zona', 'muitas horas sentado', 'ciclo menstrual, se for o caso'],
    context: ['períodos de maior tensão', 'desconforto com a intimidade'],
    question: 'Varia ao longo do mês, com a posição ou com a tensão do dia?',
    actions: [
      { label: 'Expirar mais devagar', plan: 'breath' },
      { label: 'Calor e pausa', plan: 'warmth' },
      { label: 'Movimento suave', plan: 'move' },
    ],
    signs: 'pelvis',
    keywords: ['pelve', 'pelvica', 'pelvico', 'baixo ventre', 'virilha', 'genitais', 'ovarios', 'utero', 'menstrual', 'menstruais'],
  },
  {
    id: 'hips',
    label: 'Ancas',
    inPhrase: 'nas ancas',
    dot: [54, 222],
    side: 'left',
    summary: 'Tempo sentado, carga e mudanças de rotina costumam ser as primeiras coisas a observar.',
    body: ['muitas horas sentado', 'aumento recente de treino', 'dormir sobre o mesmo lado'],
    context: ['fases de mudança com menos movimento'],
    question: 'Dói mais a começar a andar ou depois de andares um bocado?',
    actions: [
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Aliviar a carga', plan: 'load' },
      { label: 'Calor e pausa', plan: 'warmth' },
    ],
    signs: 'hips',
    keywords: ['anca', 'ancas', 'quadril', 'quadris'],
  },
  {
    id: 'knees',
    label: 'Joelhos',
    inPhrase: 'nos joelhos',
    dot: [63, 310],
    side: 'left',
    summary: 'Escadas, impacto e mudanças de carga costumam ser as primeiras coisas a observar.',
    body: ['escadas ou impacto', 'aumento recente de treino', 'ficar muito tempo de joelhos dobrados'],
    context: ['continuar sem pausa apesar do cansaço'],
    question: 'É pior a subir, a descer ou depois de ficares sentado?',
    actions: [
      { label: 'Aliviar a carga', plan: 'load' },
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Pedir uma ajuda concreta', plan: 'ask' },
    ],
    signs: 'knees',
    keywords: ['joelho', 'joelhos', 'rotula', 'menisco'],
  },
  {
    id: 'legs',
    label: 'Pernas',
    inPhrase: 'nas pernas',
    dot: [96, 276],
    side: 'right',
    summary: 'Cansaço, pouco ou muito movimento e qualidade do sono costumam ser as primeiras coisas a observar.',
    body: ['pouco movimento', 'esforço fora do habitual', 'muitas horas de pé'],
    context: ['inquietação ao fim do dia', 'cansaço acumulado'],
    question: 'Pedem movimento ou pedem descanso?',
    actions: [
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Contrair e soltar', plan: 'release' },
      { label: 'Sentir o apoio', plan: 'ground' },
    ],
    signs: 'legs',
    keywords: ['perna', 'pernas', 'coxa', 'coxas', 'gemeo', 'gemeos', 'barriga da perna'],
  },
  {
    id: 'ankles',
    label: 'Tornozelos',
    inPhrase: 'nos tornozelos',
    dot: [91, 378],
    side: 'right',
    summary: 'Entorses antigas, calçado e piso irregular costumam ser as primeiras coisas a observar.',
    body: ['entorse antiga', 'calçado', 'piso irregular'],
    context: ['andar com pressa e pouca atenção ao passo'],
    question: 'Muda com outro calçado ou noutro piso?',
    actions: [
      { label: 'Sentir o apoio', plan: 'ground' },
      { label: 'Movimento suave', plan: 'move' },
      { label: 'Aliviar a carga', plan: 'load' },
    ],
    signs: 'foot',
    keywords: ['tornozelo', 'tornozelos', 'entorse'],
  },
  {
    id: 'feet',
    label: 'Pés',
    inPhrase: 'nos pés',
    dot: [94, 398],
    side: 'right',
    summary: 'Calçado, horas de pé e cansaço acumulado costumam ser as primeiras coisas a observar.',
    body: ['calçado', 'muitas horas de pé', 'aumento recente de passos ou corrida'],
    context: ['cansaço acumulado e pouco descanso'],
    question: 'É pior nos primeiros passos da manhã ou ao fim do dia?',
    actions: [
      { label: 'Sentir o apoio', plan: 'ground' },
      { label: 'Aliviar a carga', plan: 'load' },
      { label: 'Movimento suave', plan: 'move' },
    ],
    signs: 'foot',
    keywords: ['pe', 'pes', 'calcanhar', 'calcanhares', 'planta do pe'],
  },
]

export const regionById = new Map(regions.map((region) => [region.id, region]))

export const starters = [
  'Tensão no pescoço ao fim de um dia ao computador',
  'Dor lombar há semanas e sinto que carrego tudo sozinho',
  'Barriga às voltas antes de reuniões',
  'Dor no cotovelo quando trabalho com pressa',
]
