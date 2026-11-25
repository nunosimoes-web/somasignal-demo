export type Theme = {
  id: string
  label: string
  /** Pergunta de observação: ajuda a testar a pista em vez de a dar como certa. */
  question: string
  terms: string[]
}

export const themes: Theme[] = [
  {
    id: 'work',
    label: 'trabalho ou estudos',
    question: 'A dor muda nos dias de folga ou nas férias?',
    terms: ['trabalho', 'trabalhar', 'emprego', 'chefe', 'reuniao', 'reunioes', 'escritorio', 'prazo', 'prazos', 'escola', 'exame', 'exames', 'estudar'],
  },
  {
    id: 'worry',
    label: 'preocupação ou ansiedade',
    question: 'A dor chega antes, durante ou depois da preocupação?',
    terms: ['ansiedade', 'ansios*', 'preocup*', 'medo', 'nervos*', 'stress', 'stressad*', 'panico', 'pressao no trabalho', 'sob pressao', 'sinto pressao'],
  },
  {
    id: 'sleep',
    label: 'sono e descanso',
    question: 'Como é a dor na manhã a seguir a uma noite mal dormida?',
    terms: ['sono', 'dormir', 'durmo', 'dormi', 'insonia', 'acordo', 'acordar', 'noite', 'cansaco', 'cansad*', 'exaust*'],
  },
  {
    id: 'posture',
    label: 'ecrã ou posição parada',
    question: 'Quanto tempo passa entre ficares parado e a dor aparecer?',
    terms: ['computador', 'ecra', 'ecras', 'telemovel', 'teclado', 'sentad*', 'secretaria', 'postura', 'conduzir'],
  },
  {
    id: 'effort',
    label: 'esforço ou movimento',
    question: 'Que movimento ou carga a torna pior, e qual a alivia?',
    terms: ['correr', 'corrida', 'treino', 'ginasio', 'escadas', 'peso', 'pesos', 'carregar', 'levantar', 'esforco', 'caminhar', 'andar', 'queda', 'cai'],
  },
  {
    id: 'alone',
    label: 'sentires que carregas muito',
    question: 'O que mudaria se uma dessas tarefas deixasse de ser só tua?',
    terms: ['sozinh*', 'carrego', 'responsabilidade', 'responsabilidades', 'sobrecarg*', 'cuidador', 'cuidadora', 'cuidar'],
  },
  {
    id: 'conflict',
    label: 'conflito ou tensão numa relação',
    question: 'A dor varia depois de conversas difíceis?',
    terms: ['conflito', 'discuss*', 'discuti', 'zang*', 'raiva', 'separacao', 'divorcio', 'relacao', 'namorad*', 'marido', 'mulher'],
  },
  {
    id: 'loss',
    label: 'perda ou tristeza',
    question: 'Há datas, lugares ou conversas em que a dor fica mais presente?',
    terms: ['luto', 'perdi alguem', 'perda de alguem', 'morreu', 'faleceu', 'tristeza', 'triste', 'saudade', 'saudades', 'chorar'],
  },
  {
    id: 'food',
    label: 'refeições',
    question: 'Aparece com certos alimentos, com pressa ou com refeições saltadas?',
    terms: ['comer', 'refeicao', 'refeicoes', 'almoco', 'jantar', 'cafe', 'alcool', 'comida'],
  },
  {
    id: 'hurry',
    label: 'pressa ou mudança',
    question: 'O que acontece à dor quando abrandas por uns minutos?',
    terms: ['pressa', 'rapido', 'mudanca', 'mudancas', 'mudar', 'decisao', 'decidir'],
  },
]
