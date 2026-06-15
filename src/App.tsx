import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  CheckCircle2,
  HeartPulse,
  Radar,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import './App.css'

type RegionId =
  | 'head'
  | 'jaw'
  | 'chest'
  | 'stomach'
  | 'pelvis'
  | 'shoulders'
  | 'back'
  | 'hands'
  | 'legs'

type Region = {
  id: RegionId
  label: string
  x: number
  y: number
  tone: string
  insight: string
  causes: string[]
  practices: string[]
  keywords: string[]
}

const regions: Region[] = [
  {
    id: 'head',
    label: 'Cabeca',
    x: 50,
    y: 10,
    tone: '#f97316',
    insight: 'sobrecarga cognitiva, vigilancia e fadiga decisional',
    causes: ['sono irregular', 'ruminacao', 'pressao de desempenho'],
    practices: ['2 min de respiracao nasal', 'pausa sem ecra', 'diario de preocupacoes'],
    keywords: ['cabeca', 'enxaqueca', 'testa', 'pressao', 'tontura', 'migraine'],
  },
  {
    id: 'jaw',
    label: 'Maxilar',
    x: 50,
    y: 18,
    tone: '#f59e0b',
    insight: 'tensao contida, controlo emocional e bruxismo',
    causes: ['raiva nao expressa', 'foco prolongado', 'stress nocturno'],
    practices: ['desbloquear a lingua', 'massagem masseter', 'relaxamento antes de dormir'],
    keywords: ['maxilar', 'mandibula', 'dentes', 'bruxismo', 'jaw'],
  },
  {
    id: 'chest',
    label: 'Peito',
    x: 50,
    y: 31,
    tone: '#ef4444',
    insight: 'alarme autonomico, ansiedade e necessidade de seguranca',
    causes: ['ansiedade', 'luto', 'hipervigilancia', 'sobrecarga emocional'],
    practices: ['expiracao longa', 'contactar alguem seguro', 'avaliar sinais de urgencia'],
    keywords: ['peito', 'coracao', 'aperto', 'falta de ar', 'respirar', 'chest'],
  },
  {
    id: 'stomach',
    label: 'Estomago',
    x: 50,
    y: 45,
    tone: '#22c55e',
    insight: 'stress digestivo, antecipacao e dificuldade em processar',
    causes: ['antecipacao', 'conflito', 'alimentacao irregular', 'ansiedade social'],
    practices: ['refeicao lenta', 'calor abdominal', 'nomear a preocupacao'],
    keywords: ['estomago', 'barriga', 'nausea', 'digestao', 'intestino', 'abdomen'],
  },
  {
    id: 'pelvis',
    label: 'Pelve',
    x: 50,
    y: 61,
    tone: '#a855f7',
    insight: 'seguranca, limites, intimidade e contraccao defensiva',
    causes: ['medo de exposicao', 'pressao relacional', 'historial de dor'],
    practices: ['relaxamento do pavimento pelvico', 'movimento suave', 'mapear limites'],
    keywords: ['pelve', 'pelvico', 'anca', 'baixo ventre', 'sexual', 'hip'],
  },
  {
    id: 'shoulders',
    label: 'Ombros',
    x: 50,
    y: 27,
    tone: '#06b6d4',
    insight: 'responsabilidade acumulada e estado de prontidao',
    causes: ['carga de trabalho', 'postura defensiva', 'perfeccionismo'],
    practices: ['baixar ombros em expiracao', 'delegar uma tarefa', 'alongar trapezio'],
    keywords: ['ombro', 'ombros', 'pescoco', 'trapezio', 'neck', 'shoulder'],
  },
  {
    id: 'back',
    label: 'Costas',
    x: 50,
    y: 41,
    tone: '#3b82f6',
    insight: 'suporte percebido, medo de falhar e tensao muscular',
    causes: ['pressao financeira', 'falta de apoio', 'longos periodos sentado'],
    practices: ['caminhada curta', 'check-in de suporte', 'mobilidade toracica'],
    keywords: ['costas', 'lombar', 'coluna', 'dorsal', 'back', 'sciatica'],
  },
  {
    id: 'hands',
    label: 'Maos',
    x: 22,
    y: 55,
    tone: '#14b8a6',
    insight: 'controlo, produtividade e dificuldade em largar',
    causes: ['sobrecarga digital', 'tensao de controlo', 'medo de parar'],
    practices: ['descanso tactil', 'alternar tarefas', 'aquecimento das maos'],
    keywords: ['mao', 'maos', 'dedos', 'pulso', 'formigueiro', 'hand'],
  },
  {
    id: 'legs',
    label: 'Pernas',
    x: 50,
    y: 79,
    tone: '#84cc16',
    insight: 'impulso travado, inquietacao e necessidade de movimento',
    causes: ['decisoes adiadas', 'sedentarismo', 'energia ansiosa'],
    practices: ['andar 5 minutos', 'contrair e soltar', 'definir proximo passo'],
    keywords: ['perna', 'pernas', 'joelho', 'pe', 'pes', 'cansaco', 'leg'],
  },
]

const presets = [
  'Aperto no peito quando penso no trabalho',
  'Dor lombar ha semanas e sinto que carrego tudo sozinho',
  'Nausea antes de reunioes importantes',
  'Maxilar preso ao acordar e dores de cabeca',
]

const competitorSignals = [
  'Curable: coach guiado e educacao sobre dor persistente',
  'Pathways: programa mind-body estruturado',
  'Bearable: tracking e correlacoes de sintomas',
  'Lin Health: abordagem biopsicossocial com suporte humano',
]

function scoreRegion(region: Region, text: string, selected: RegionId) {
  const normalized = text.toLowerCase()
  const keywordHits = region.keywords.filter((keyword) => normalized.includes(keyword)).length
  const selectedBoost = region.id === selected ? 2.6 : 0
  const emotionalHits = ['stress', 'ansiedade', 'medo', 'pressao', 'trabalho', 'sozinho', 'luto', 'raiva'].filter(
    (keyword) => normalized.includes(keyword),
  ).length

  return selectedBoost + keywordHits * 1.8 + emotionalHits * 0.32
}

function confidence(score: number) {
  return Math.min(94, Math.round(52 + score * 12))
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
          strokeWidth="35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M184 163 224 275c7 20 5 42-6 60l-41 67c-8 13-25 17-38 10-13-8-18-25-10-38l35-59-30-89"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {regions.map((region) => (
        <button
          className={`hotspot ${active === region.id ? 'is-active' : ''}`}
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
  const [description, setDescription] = useState(presets[0])

  const analysis = useMemo(() => {
    const ranked = regions
      .map((region) => ({ region, score: scoreRegion(region, description, selectedRegion) }))
      .sort((a, b) => b.score - a.score)

    const primary = ranked[0]
    const secondary = ranked.slice(1, 4)

    return {
      primary,
      secondary,
      confidence: confidence(primary.score),
    }
  }, [description, selectedRegion])

  return (
    <main className="app">
      <section className="workspace">
        <div className="topbar">
          <div className="brand-mark">
            <Brain size={20} />
            SomaSignal
          </div>
          <div className="status-pill">
            <ShieldCheck size={16} />
            Exploratorio, nao diagnostico
          </div>
        </div>

        <div className="hero-grid">
          <section className="left-panel">
            <div className="eyebrow">
              <Sparkles size={16} />
              Mapa de sintomas psicossomaticos
            </div>
            <h1>Transforma uma dor vaga numa hipotese emocional accionavel.</h1>
            <p className="lead">
              Um mockup de produto para captar sinais de dor, linguagem emocional e contexto de vida, devolvendo
              hipoteses provaveis com praticas de regulacao e red flags clinicas.
            </p>

            <div className="input-stack">
              <label htmlFor="pain-text">Descreve a dor</label>
              <textarea
                id="pain-text"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
              />
              <div className="preset-row">
                {presets.map((preset) => (
                  <button key={preset} type="button" onClick={() => setDescription(preset)}>
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="signals">
              <div>
                <Activity size={18} />
                Linguagem da dor
              </div>
              <div>
                <Radar size={18} />
                Zona corporal
              </div>
              <div>
                <Waves size={18} />
                Contexto emocional
              </div>
            </div>
          </section>

          <section className="map-panel">
            <BodyMap active={selectedRegion} setActive={setSelectedRegion} />
          </section>

          <section className="analysis-panel">
            <div className="panel-heading">
              <span>Interpretacao provavel</span>
              <strong>{analysis.confidence}%</strong>
            </div>
            <div className="result-card" style={{ ['--tone' as string]: analysis.primary.region.tone }}>
              <div className="result-icon">
                <HeartPulse size={24} />
              </div>
              <div>
                <h2>{analysis.primary.region.label}</h2>
                <p>{analysis.primary.region.insight}</p>
              </div>
            </div>

            <div className="cause-list">
              <span>Possiveis causas a explorar</span>
              {analysis.primary.region.causes.map((cause) => (
                <div key={cause}>
                  <CheckCircle2 size={16} />
                  {cause}
                </div>
              ))}
            </div>

            <div className="practice-list">
              <span>Primeiras micro-intervencoes</span>
              {analysis.primary.region.practices.map((practice) => (
                <button key={practice} type="button">
                  {practice}
                  <ArrowRight size={15} />
                </button>
              ))}
            </div>

            <div className="safety-note">
              <AlertTriangle size={18} />
              Dor no peito, falta de ar, perda de forca, febre ou dor intensa/subita exigem avaliacao medica.
            </div>
          </section>
        </div>
      </section>

      <section className="investor-strip">
        <div>
          <span>Benchmark usado</span>
          <h2>Curable + Bearable + body map, mas com narrativa emocional imediata.</h2>
        </div>
        <div className="benchmark-grid">
          {competitorSignals.map((signal) => (
            <article key={signal}>{signal}</article>
          ))}
        </div>
      </section>

      <section className="secondary-grid">
        <article>
          <span>Produto</span>
          <h3>Da queixa ao padrao</h3>
          <p>Detecta regioes, palavras emocionais e intensidade para construir um mapa pessoal de triggers.</p>
        </article>
        <article>
          <span>Modelo</span>
          <h3>Hipoteses transparentes</h3>
          <p>Mostra factores provaveis, grau de confianca e limites da interpretacao em linguagem humana.</p>
        </article>
        <article>
          <span>Monetizacao</span>
          <h3>Plano guiado premium</h3>
          <p>Jornadas de 14 dias, exercicios somaticos, relatorios e eventual triagem com profissionais.</p>
        </article>
      </section>
    </main>
  )
}

export default App
