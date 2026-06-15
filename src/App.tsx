import {
  AlertTriangle,
  Bot,
  Brain,
  CheckCircle2,
  HeartPulse,
  MapPinned,
  Send,
  ShieldCheck,
  Sparkles,
  TimerReset,
  UserRound,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

type RegionId =
  | 'head'
  | 'jaw'
  | 'neck'
  | 'chest'
  | 'stomach'
  | 'pelvis'
  | 'shoulders'
  | 'elbows'
  | 'wrists'
  | 'back'
  | 'hands'
  | 'hips'
  | 'knees'
  | 'ankles'
  | 'feet'
  | 'legs'

type Region = {
  id: RegionId
  label: string
  x: number
  y: number
  tone: string
  insight: string
  causes: string[]
  solutions: string[]
  keywords: string[]
  detail?: boolean
}

type ChatMessage = {
  sender: 'bot' | 'user'
  text: string
  warning?: boolean
}

const regions: Region[] = [
  {
    id: 'head',
    label: 'Cabeca',
    x: 50,
    y: 10,
    tone: '#f97316',
    insight: 'sobrecarga mental, pouco descanso ou preocupacao persistente',
    causes: ['sono irregular', 'ruminacao', 'pressao de desempenho'],
    solutions: ['beber agua e descansar 10 min', 'respirar devagar por 2 min', 'escrever a preocupacao principal'],
    keywords: ['cabeca', 'enxaqueca', 'testa', 'pressao', 'tontura', 'migraine'],
  },
  {
    id: 'jaw',
    label: 'Maxilar',
    x: 50,
    y: 18,
    tone: '#f59e0b',
    insight: 'tensao acumulada, controlo ou apertar os dentes sem notar',
    causes: ['stress nocturno', 'raiva contida', 'foco prolongado'],
    solutions: ['relaxar a lingua', 'massajar o maxilar', 'evitar ecra antes de dormir'],
    keywords: ['maxilar', 'mandibula', 'dentes', 'bruxismo', 'jaw'],
  },
  {
    id: 'neck',
    label: 'Pescoco',
    x: 50,
    y: 23,
    tone: '#0ea5e9',
    insight: 'rigidez, alerta constante ou excesso de carga mental',
    causes: ['postura', 'hipervigilancia', 'muito tempo ao computador'],
    solutions: ['rodar o pescoco devagar', 'baixar ombros ao expirar', 'fazer pausa de ecras'],
    keywords: ['pescoco', 'nuca', 'cervical', 'torcicolo', 'neck'],
    detail: true,
  },
  {
    id: 'chest',
    label: 'Peito',
    x: 50,
    y: 31,
    tone: '#ef4444',
    insight: 'alarme do corpo, ansiedade ou necessidade de seguranca',
    causes: ['ansiedade', 'luto', 'sobrecarga emocional', 'stress'],
    solutions: ['expirar mais devagar', 'contactar alguem de confianca', 'verificar sinais de urgencia'],
    keywords: ['peito', 'coracao', 'aperto', 'falta de ar', 'respirar', 'chest'],
  },
  {
    id: 'shoulders',
    label: 'Ombros',
    x: 50,
    y: 27,
    tone: '#06b6d4',
    insight: 'responsabilidade acumulada ou sensacao de carregar demasiado',
    causes: ['trabalho', 'perfeccionismo', 'postura defensiva'],
    solutions: ['baixar os ombros 5 vezes', 'delegar uma tarefa', 'alongar trapezios'],
    keywords: ['ombro', 'ombros', 'trapezio', 'shoulder'],
  },
  {
    id: 'back',
    label: 'Costas',
    x: 50,
    y: 41,
    tone: '#3b82f6',
    insight: 'falta de suporte, tensao muscular ou peso emocional',
    causes: ['sentir-se sozinho', 'pressao financeira', 'muitas horas sentado'],
    solutions: ['caminhar 5 minutos', 'pedir ajuda concreta', 'mobilizar costas devagar'],
    keywords: ['costas', 'lombar', 'coluna', 'dorsal', 'back', 'sciatica'],
  },
  {
    id: 'stomach',
    label: 'Estomago',
    x: 50,
    y: 45,
    tone: '#22c55e',
    insight: 'antecipacao, ansiedade social ou dificuldade em processar algo',
    causes: ['reunioes', 'conflito', 'alimentacao irregular'],
    solutions: ['comer devagar', 'colocar calor na barriga', 'nomear o que preocupa'],
    keywords: ['estomago', 'barriga', 'nausea', 'digestao', 'intestino', 'abdomen'],
  },
  {
    id: 'elbows',
    label: 'Cotovelos',
    x: 25,
    y: 48,
    tone: '#0891b2',
    insight: 'esforco repetido, pouca flexibilidade ou pressa para concluir',
    causes: ['sobrecarga repetitiva', 'tensao de produtividade', 'dificuldade em adaptar'],
    solutions: ['descansar a carga', 'mexer o cotovelo sem dor', 'abrandar uma tarefa'],
    keywords: ['cotovelo', 'cotovelos', 'epicondilite', 'tendinite', 'elbow'],
    detail: true,
  },
  {
    id: 'wrists',
    label: 'Pulsos',
    x: 17,
    y: 60,
    tone: '#0d9488',
    insight: 'excesso de execucao, computador ou dificuldade em parar',
    causes: ['teclado', 'gestos repetitivos', 'pressao de entrega'],
    solutions: ['pausar teclado', 'rodar punhos devagar', 'reduzir micro-tarefas'],
    keywords: ['pulso', 'pulsos', 'punho', 'carpo', 'tendinite', 'wrist'],
    detail: true,
  },
  {
    id: 'hands',
    label: 'Maos',
    x: 29,
    y: 57,
    tone: '#14b8a6',
    insight: 'controlo, produtividade ou dificuldade em largar algo',
    causes: ['sobrecarga digital', 'tensao de controlo', 'medo de parar'],
    solutions: ['aquecer as maos', 'fechar e abrir dedos', 'fazer pausa tactil'],
    keywords: ['mao', 'maos', 'dedos', 'formigueiro', 'hand'],
  },
  {
    id: 'pelvis',
    label: 'Pelve',
    x: 50,
    y: 61,
    tone: '#a855f7',
    insight: 'limites, seguranca, intimidade ou contraccao defensiva',
    causes: ['medo de exposicao', 'pressao relacional', 'historial de dor'],
    solutions: ['movimento suave', 'relaxar pavimento pelvico', 'mapear limites'],
    keywords: ['pelve', 'pelvico', 'anca', 'baixo ventre', 'sexual'],
  },
  {
    id: 'hips',
    label: 'Ancas',
    x: 62,
    y: 66,
    tone: '#8b5cf6',
    insight: 'transicao, estabilidade ou medo de avancar',
    causes: ['sedentarismo', 'decisoes adiadas', 'mudancas recentes'],
    solutions: ['balancar ancas devagar', 'dar uma caminhada curta', 'escolher um proximo passo'],
    keywords: ['anca', 'ancas', 'quadril', 'hip'],
    detail: true,
  },
  {
    id: 'knees',
    label: 'Joelhos',
    x: 40,
    y: 78,
    tone: '#65a30d',
    insight: 'suporte, direccao ou pressao para continuar sem pausa',
    causes: ['sobrecarga mecanica', 'medo de ceder', 'dificuldade em pedir apoio'],
    solutions: ['reduzir impacto', 'observar se ha inchaco', 'pedir apoio numa decisao'],
    keywords: ['joelho', 'joelhos', 'rotula', 'menisco', 'ligamento', 'knee'],
    detail: true,
  },
  {
    id: 'legs',
    label: 'Pernas',
    x: 61,
    y: 82,
    tone: '#84cc16',
    insight: 'energia bloqueada, cansaco ou necessidade de movimento',
    causes: ['sedentarismo', 'decisoes adiadas', 'energia ansiosa'],
    solutions: ['andar 5 minutos', 'contrair e soltar', 'definir o proximo passo'],
    keywords: ['perna', 'pernas', 'coxa', 'gemeo', 'cansaco', 'leg'],
  },
  {
    id: 'ankles',
    label: 'Tornozelos',
    x: 40,
    y: 91,
    tone: '#a3e635',
    insight: 'equilibrio, adaptacao ou inseguranca no proximo passo',
    causes: ['instabilidade', 'mudancas recentes', 'receio de avancar'],
    solutions: ['equilibrio apoiado', 'dar passos pequenos', 'reduzir pressa'],
    keywords: ['tornozelo', 'tornozelos', 'entorse', 'ankle'],
    detail: true,
  },
  {
    id: 'feet',
    label: 'Pes',
    x: 61,
    y: 96,
    tone: '#bef264',
    insight: 'base, aterramento ou cansaco de sustentar tudo',
    causes: ['fadiga acumulada', 'pressao de movimento', 'pouco descanso'],
    solutions: ['sentir a planta dos pes', 'andar devagar', 'reduzir carga'],
    keywords: ['pe', 'pes', 'planta', 'calcanhar', 'foot', 'feet'],
    detail: true,
  },
]

const starters = [
  'Aperto no peito quando penso no trabalho',
  'Dor lombar ha semanas e sinto que carrego tudo sozinho',
  'Dor no cotovelo quando tento acabar tudo rapido',
  'Joelho doi quando penso em mudar de direccao',
]

const redFlagWords = ['falta de ar', 'desmaio', 'fraqueza', 'febre', 'subita', 'insuportavel', 'perda de forca']
const emotionalWords = ['ansiedade', 'medo', 'pressao', 'trabalho', 'sozinho', 'carrego', 'stress', 'rapido', 'mudar']

function normalize(text: string) {
  return text.toLowerCase()
}

function hasRedFlag(text: string) {
  const normalized = normalize(text)
  return redFlagWords.some((word) => normalized.includes(word))
}

function scoreRegion(region: Region, text: string, selected: RegionId) {
  const normalized = normalize(text)
  const keywordHits = region.keywords.filter((keyword) => normalized.includes(keyword)).length
  const emotionHits = emotionalWords.filter((keyword) => normalized.includes(keyword)).length
  const selectedBoost = region.id === selected ? 1.2 : 0

  return keywordHits * 2 + emotionHits * 0.25 + selectedBoost
}

function inferRegionFromText(text: string) {
  const ranked = regions
    .map((region) => ({ region, score: scoreRegion(region, text, region.id) }))
    .sort((a, b) => b.score - a.score)

  return ranked[0].score > 1.2 ? ranked[0].region.id : null
}

function confidence(score: number) {
  return Math.min(92, Math.round(50 + score * 14))
}

function botReply(text: string, region: Region) {
  if (hasRedFlag(text)) {
    return {
      warning: true,
      text: 'Isto pode precisar de avaliacao medica. Antes de procurar uma causa emocional, confirma estes sintomas com um profissional.',
    }
  }

  return {
    warning: false,
    text: `Entendi. Vou olhar para ${region.label.toLowerCase()} e para o contexto que descreveste. Abaixo tens causas possiveis e um primeiro passo simples.`,
  }
}

function BodyMap({
  active,
  setActive,
}: {
  active: RegionId
  setActive: (region: RegionId) => void
}) {
  return (
    <div className="body-shell" aria-label="Mapa corporal interactivo">
      <div className="body-aura" />
      <svg className="body-map" viewBox="0 0 260 620" role="img" aria-label="Silhueta humana com zonas de dor">
        <defs>
          <linearGradient id="bodyFill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>
        <circle cx="130" cy="64" r="42" fill="url(#bodyFill)" />
        <path
          d="M81 145c8-33 30-51 49-51s41 18 49 51l12 85c3 21-4 42-18 58l-14 16 9 86 30 153c3 17-8 34-25 37-15 3-30-6-35-21l-39-134-38 134c-5 15-20 24-35 21-17-3-28-20-25-37l30-153 9-86-14-16c-14-16-21-37-18-58l12-85Z"
          fill="url(#bodyFill)"
        />
        <path
          d="M76 163 36 275c-7 20-5 42 6 60l41 67c8 13 25 17 38 10 13-8 18-25 10-38l-35-59 30-89"
          fill="none"
          stroke="#cbd5e1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="35"
        />
        <path
          d="M184 163 224 275c7 20 5 42-6 60l-41 67c-8 13-25 17-38 10-13-8-18-25-10-38l35-59-30-89"
          fill="none"
          stroke="#cbd5e1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="35"
        />
      </svg>
      {regions.map((region) => (
        <button
          className={`hotspot ${region.detail ? 'is-detail' : ''} ${active === region.id ? 'is-active' : ''}`}
          key={region.id}
          onClick={() => setActive(region.id)}
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            ['--tone' as string]: region.tone,
          }}
          type="button"
          title={region.label}
        >
          <span />
          <b>{region.label}</b>
        </button>
      ))}
    </div>
  )
}

function App() {
  const [selectedRegion, setSelectedRegion] = useState<RegionId>('chest')
  const [draft, setDraft] = useState('')
  const [latestText, setLatestText] = useState(starters[0])
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Diz-me onde doi e quando aparece. Eu ajudo-te a explorar causas possiveis e um primeiro passo.',
    },
  ])

  const analysis = useMemo(() => {
    const ranked = regions
      .map((region) => ({ region, score: scoreRegion(region, latestText, selectedRegion) }))
      .sort((a, b) => b.score - a.score)

    return {
      primary: ranked[0],
      related: ranked.slice(1, 3),
      confidence: confidence(ranked[0].score),
      warning: hasRedFlag(latestText),
    }
  }, [latestText, selectedRegion])

  function submitText(text: string) {
    const cleanText = text.trim()
    if (!cleanText) {
      return
    }

    const inferred = inferRegionFromText(cleanText)
    const nextRegionId = inferred ?? selectedRegion
    const nextRegion = regions.find((region) => region.id === nextRegionId) ?? analysis.primary.region
    const reply = botReply(cleanText, nextRegion)

    setLatestText(cleanText)
    setSelectedRegion(nextRegionId)
    setMessages((current) => [
      ...current.slice(-3),
      { sender: 'user', text: cleanText },
      { sender: 'bot', text: reply.text, warning: reply.warning },
    ])
    setDraft('')
  }

  const activeRegion = analysis.primary.region

  return (
    <main className="app">
      <section className="workspace">
        <header className="topbar">
          <div className="brand-mark">
            <Brain size={20} />
            SomaSignal
          </div>
          <div className="status-pill">
            <ShieldCheck size={16} />
            Exploratorio, nao diagnostico
          </div>
        </header>

        <section className="intro">
          <div>
            <div className="eyebrow">
              <Sparkles size={16} />
              Mapa de sintomas
            </div>
            <h1>Onde doi? O que pode estar por tras?</h1>
            <p>
              Escolhe uma zona do corpo ou escreve no chat. A app sugere causas possiveis e passos simples para
              explorar com seguranca.
            </p>
          </div>
        </section>

        <section className="app-grid">
          <section className="map-panel">
            <div className="panel-title">
              <MapPinned size={18} />
              <span>1. Escolhe a zona</span>
            </div>
            <BodyMap active={selectedRegion} setActive={setSelectedRegion} />
          </section>

          <section className="chat-panel">
            <div className="panel-title">
              <Bot size={18} />
              <span>2. Conta-me o que sentes</span>
            </div>

            <div className="chat-thread">
              {messages.map((message, index) => (
                <div className={`chat-message ${message.sender} ${message.warning ? 'is-warning' : ''}`} key={index}>
                  {message.sender === 'bot' ? <Bot size={16} /> : <UserRound size={16} />}
                  <p>{message.text}</p>
                </div>
              ))}
            </div>

            <div className="starter-row">
              {starters.map((starter) => (
                <button key={starter} type="button" onClick={() => submitText(starter)}>
                  {starter}
                </button>
              ))}
            </div>

            <form
              className="chat-input"
              onSubmit={(event) => {
                event.preventDefault()
                submitText(draft)
              }}
            >
              <input
                aria-label="Descrever dor"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ex: doi-me o joelho quando subo escadas..."
              />
              <button type="submit" aria-label="Enviar">
                <Send size={17} />
              </button>
            </form>
          </section>

          <section className="result-panel">
            <div className="panel-title">
              <HeartPulse size={18} />
              <span>3. Causas e solucoes</span>
            </div>

            <div className="result-card" style={{ ['--tone' as string]: activeRegion.tone }}>
              <div className="result-icon">
                <HeartPulse size={24} />
              </div>
              <div>
                <strong>{analysis.confidence}% provavel</strong>
                <h2>{activeRegion.label}</h2>
                <p>{activeRegion.insight}</p>
              </div>
            </div>

            {analysis.warning ? (
              <div className="safety-note priority">
                <AlertTriangle size={18} />
                Alguns sinais merecem avaliacao medica. Esta app nao substitui urgencia, medico ou diagnostico.
              </div>
            ) : (
              <div className="safety-note">
                <AlertTriangle size={18} />
                Se a dor for forte, subita, vier com falta de ar, febre, perda de forca ou desmaio, procura ajuda medica.
              </div>
            )}

            <div className="simple-list">
              <span>Pode estar ligado a</span>
              {activeRegion.causes.map((cause) => (
                <div key={cause}>
                  <CheckCircle2 size={16} />
                  {cause}
                </div>
              ))}
            </div>

            <div className="simple-list solutions">
              <span>Experimenta agora</span>
              {activeRegion.solutions.map((solution) => (
                <button key={solution} type="button">
                  <TimerReset size={16} />
                  {solution}
                </button>
              ))}
            </div>

            <div className="next-step">
              <strong>Proximo passo</strong>
              <p>Observa se a intensidade muda depois da primeira acao. Se piorar ou persistir, fala com um profissional.</p>
            </div>
          </section>
        </section>
      </section>
    </main>
  )
}

export default App
