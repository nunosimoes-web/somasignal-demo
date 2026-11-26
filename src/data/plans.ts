export type PlanId = 'breath' | 'move' | 'warmth' | 'release' | 'screen' | 'write' | 'ask' | 'load' | 'ground'

export type Plan = {
  id: PlanId
  title: string
  seconds: number
  steps: string[]
  notice: string
}

export const plans: Record<PlanId, Plan> = {
  breath: {
    id: 'breath',
    title: 'Expirar mais devagar',
    seconds: 120,
    steps: [
      'Senta-te ou deita-te com apoio.',
      'Inspira pelo nariz durante 4 segundos.',
      'Expira sem esforço durante 6 segundos e repete.',
    ],
    notice: 'Se ficares com tonturas ou desconforto, volta a respirar normalmente.',
  },
  move: {
    id: 'move',
    title: 'Movimento suave',
    seconds: 180,
    steps: [
      'Mexe a zona numa amplitude pequena e confortável.',
      'Mantém um ritmo lento; não procures alongar ao máximo.',
      'Para se a dor subir de forma clara.',
    ],
    notice: 'O objetivo é reparar no que muda, não forçar.',
  },
  warmth: {
    id: 'warmth',
    title: 'Calor e pausa',
    seconds: 300,
    steps: [
      'Coloca calor morno, com um pano entre a fonte e a pele.',
      'Apoia o corpo numa posição confortável.',
      'Repara se a zona fica mais solta ao fim de uns minutos.',
    ],
    notice: 'Evita calor se a zona estiver inchada, vermelha, com ferida ou com pouca sensibilidade.',
  },
  release: {
    id: 'release',
    title: 'Contrair e soltar',
    seconds: 120,
    steps: [
      'Contrai a zona com pouca força durante 3 segundos.',
      'Solta devagar durante 6 segundos.',
      'Repete e compara os dois momentos.',
    ],
    notice: 'Usa metade da força que usarias normalmente e salta este passo se contrair doer.',
  },
  screen: {
    id: 'screen',
    title: 'Pausa de ecrã',
    seconds: 180,
    steps: [
      'Larga o ecrã e levanta-te, se puderes.',
      'Olha para um ponto distante e baixa os ombros.',
      'Muda a posição em que estavas antes de recomeçar.',
    ],
    notice: 'Repara se a zona pede outra posição quando voltas.',
  },
  write: {
    id: 'write',
    title: 'Pôr a preocupação no papel',
    seconds: 180,
    steps: [
      'Escreve o que estava a acontecer antes de a dor aparecer.',
      'Escreve o que te preocupa, numa frase.',
      'Sublinha a única parte em que podes mexer hoje.',
    ],
    notice: 'Não precisas de resolver nada: basta ficar com uma pista.',
  },
  ask: {
    id: 'ask',
    title: 'Pedir uma ajuda concreta',
    seconds: 180,
    steps: [
      'Escolhe uma pessoa com quem te sintas em segurança.',
      'Formula um pedido pequeno e específico.',
      'Decide quando o vais fazer.',
    ],
    notice: 'Um pedido pequeno conta tanto como um grande.',
  },
  load: {
    id: 'load',
    title: 'Aliviar a carga',
    seconds: 120,
    steps: [
      'Identifica o gesto ou a posição que mais puxa pela zona.',
      'Escolhe uma versão mais leve: menos peso, menos tempo ou mais apoio.',
      'Experimenta-a na próxima vez que repetires o gesto.',
    ],
    notice: 'Reduzir não é parar de vez: é dar margem para reparar no que ajuda.',
  },
  ground: {
    id: 'ground',
    title: 'Sentir o apoio',
    seconds: 120,
    steps: [
      'Pousa os pés no chão, com ou sem sapatos.',
      'Repara no calcanhar, na planta e nos dedos.',
      'Passa o peso devagar de um lado para o outro, com apoio por perto.',
    ],
    notice: 'Faz sentado se tiveres pouco equilíbrio.',
  },
}
