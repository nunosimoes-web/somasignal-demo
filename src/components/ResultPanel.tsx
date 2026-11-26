import { ArrowRight, MessageCircleQuestion, Stethoscope, Timer } from 'lucide-react'
import { useState } from 'react'
import { plans } from '../data/plans'
import type { RegionId } from '../data/regions'
import { zoneSigns, type Alert } from '../data/safety'
import type { Analysis } from '../lib/analysis'
import { buildSummary, type CheckIn } from '../lib/summary'
import { CrisisPanel, FlaggedPanel, PhysicalAlertPanel, SafetyCheck } from './SafetyPanels'
import { StepRunner } from './StepRunner'
import { SummaryCard } from './SummaryCard'

export type SafetyState = 'unchecked' | 'clear' | 'flagged'

function Exploration({
  analysis,
  words,
  headingRef,
  onSelectRegion,
  onSave,
}: {
  analysis: Analysis
  words: string[]
  headingRef: React.RefObject<HTMLHeadingElement | null>
  onSelectRegion: (id: RegionId) => void
  onSave: (checkIn: CheckIn) => boolean
}) {
  const { region } = analysis
  const [actionIndex, setActionIndex] = useState(0)
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const action = region.actions[actionIndex]
  const hasClues = analysis.themes.length > 0

  return (
    <>
      <div className="result-head">
        <h3 ref={headingRef} tabIndex={-1}>
          {region.label}
        </h3>
        <p>{region.summary}</p>
        <p className="why">
          <strong>Porque vês isto:</strong>{' '}
          {hasClues
            ? `escolheste ou mencionaste ${region.label.toLowerCase()} e falaste de ${analysis.themes.map((theme) => theme.label).join(', ')}.`
            : `escolheste ou mencionaste ${region.label.toLowerCase()}. Conta no passo 2 quando aparece e as perguntas passam a ser sobre ti.`}
        </p>
      </div>

      {analysis.otherRegions.length > 0 ? (
        <div className="also">
          <span>Também mencionaste:</span>
          {analysis.otherRegions.map((other) => (
            <button key={other.id} type="button" onClick={() => onSelectRegion(other.id)}>
              {other.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="result-block">
        <h4>
          <MessageCircleQuestion size={17} aria-hidden="true" /> Perguntas para observares
        </h4>
        <ul className="questions">
          {analysis.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </div>

      <div className="result-block">
        <h4>Pode valer a pena reparar em</h4>
        <div className="factors">
          <div>
            <h5>Corpo e rotina</h5>
            <ul>
              {region.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5>Contexto</h5>
            <ul>
              {region.context.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="field-hint">São hipóteses para observar, não causas confirmadas.</p>
      </div>

      <div className="result-block">
        <h4>
          <Timer size={17} aria-hidden="true" /> Experimenta um passo
        </h4>
        <div className="actions" role="group" aria-label="Escolher um passo">
          {region.actions.map((item, index) => (
            <button
              aria-pressed={index === actionIndex}
              key={item.plan}
              type="button"
              onClick={() => setActionIndex(index)}
            >
              {item.label}
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <StepRunner
          key={action.plan}
          plan={plans[action.plan]}
          actionLabel={action.label}
          onComplete={(checkIn) => setCheckIns((current) => [...current, checkIn])}
          onSave={onSave}
        />
      </div>

      <SummaryCard
        key={checkIns.length}
        text={buildSummary(
          analysis,
          words,
          checkIns,
          new Date(),
          zoneSigns[region.signs].map((sign) => sign.text),
        )}
      />

      <p className="next-step">
        <Stethoscope size={18} aria-hidden="true" />
        {analysis.persistent
          ? 'Disseste que já dura há algum tempo. Marca uma consulta e leva o resumo contigo.'
          : 'Se a dor piorar, voltar muitas vezes ou te preocupar, fala com um profissional de saúde.'}
      </p>
    </>
  )
}

export function ResultPanel({
  analysis,
  alert,
  safety,
  words,
  sessionKey,
  headingRef,
  panelRef,
  onDismissAlert,
  onSafety,
  onSelectRegion,
  onSave,
  onExample,
}: {
  analysis: Analysis | null
  alert: Alert | null
  safety: SafetyState
  words: string[]
  sessionKey: string
  headingRef: React.RefObject<HTMLHeadingElement | null>
  panelRef: React.RefObject<HTMLElement | null>
  onDismissAlert: () => void
  onSafety: (state: SafetyState) => void
  onSelectRegion: (id: RegionId) => void
  onSave: (checkIn: CheckIn) => boolean
  onExample: () => void
}) {
  function content() {
    if (alert?.kind === 'crisis') {
      return <CrisisPanel headingRef={headingRef} onDismiss={onDismissAlert} />
    }
    if (alert) {
      return <PhysicalAlertPanel alert={alert} headingRef={headingRef} onDismiss={onDismissAlert} />
    }
    if (!analysis) {
      return (
        <div className="empty-state">
          <h3 ref={headingRef} tabIndex={-1}>
            O teu mapa aparece aqui
          </h3>
          <p>Escolhe uma zona ou descreve a dor. Depois encontras:</p>
          <ol>
            <li>sinais de alerta a excluir primeiro;</li>
            <li>perguntas para observares nos próximos dias;</li>
            <li>um passo de 2 a 5 minutos, com a dor medida antes e depois;</li>
            <li>um resumo para levares a uma consulta.</li>
          </ol>
          <div className="empty-actions">
            <button className="button" type="button" onClick={onExample}>
              Ver um exemplo
            </button>
          </div>
        </div>
      )
    }
    if (safety === 'unchecked') {
      return (
        <SafetyCheck
          region={analysis.region}
          headingRef={headingRef}
          onClear={() => onSafety('clear')}
          onFlag={() => onSafety('flagged')}
        />
      )
    }
    if (safety === 'flagged') {
      return <FlaggedPanel region={analysis.region} headingRef={headingRef} onBack={() => onSafety('unchecked')} />
    }
    return (
      <Exploration
        key={sessionKey}
        analysis={analysis}
        words={words}
        headingRef={headingRef}
        onSelectRegion={onSelectRegion}
        onSave={onSave}
      />
    )
  }

  return (
    <section className="panel result-panel" id="resultado" ref={panelRef} aria-labelledby="passo-3">
      <div className="panel-title">
        <h2 id="passo-3">
          <span aria-hidden="true">3</span> O que observar e experimentar
        </h2>
      </div>
      <div className="result-body">{content()}</div>
    </section>
  )
}
