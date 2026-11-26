import { Check, Play, Square } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Plan } from '../data/plans'
import { describeChange, type CheckIn } from '../lib/summary'

type Stage = 'before' | 'running' | 'after' | 'done'

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
}

function Scale({
  legend,
  name,
  value,
  onChange,
}: {
  legend: string
  name: string
  value: number | null
  onChange: (value: number) => void
}) {
  return (
    <fieldset className="scale">
      <legend>{legend}</legend>
      <div className="scale-row">
        {Array.from({ length: 11 }, (_, score) => (
          <label key={score}>
            <input
              type="radio"
              name={name}
              value={score}
              checked={value === score}
              onChange={() => onChange(score)}
            />
            <span>{score}</span>
          </label>
        ))}
      </div>
      <div className="scale-ends" aria-hidden="true">
        <span>sem dor</span>
        <span>a pior imaginável</span>
      </div>
    </fieldset>
  )
}

export function StepRunner({
  plan,
  actionLabel,
  onComplete,
  onSave,
}: {
  plan: Plan
  actionLabel: string
  onComplete: (checkIn: CheckIn) => void
  onSave: (checkIn: CheckIn) => boolean
}) {
  const [stage, setStage] = useState<Stage>('before')
  const [before, setBefore] = useState<number | null>(null)
  const [after, setAfter] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(plan.seconds)
  const [saved, setSaved] = useState<'idle' | 'ok' | 'failed'>('idle')
  const headingRef = useRef<HTMLHeadingElement>(null)

  function go(next: Stage) {
    setStage(next)
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  useEffect(() => {
    if (stage !== 'running') {
      return
    }
    // Conta a partir do relógio: os temporizadores abrandam quando o separador fica em segundo plano.
    const endsAt = Date.now() + plan.seconds * 1000
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) {
        window.clearInterval(timer)
        setStage('after')
        requestAnimationFrame(() => headingRef.current?.focus())
      }
    }, 250)
    return () => window.clearInterval(timer)
  }, [stage, plan.seconds])

  function restart() {
    setBefore(after)
    setAfter(null)
    setRemaining(plan.seconds)
    setSaved('idle')
    go('before')
  }

  const elapsed = plan.seconds - remaining
  const inhaling = elapsed % 10 < 4
  const tooStrong = stage === 'before' && before !== null && before >= 8

  return (
    <div className="step-runner">
      <div className="step-head">
        <h4 ref={headingRef} tabIndex={-1}>
          {plan.title}
        </h4>
        <span className="pill">{Math.round(plan.seconds / 60)} min</span>
      </div>

      {stage === 'before' ? (
        <>
          <ol>
            {plan.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p className="notice">{plan.notice}</p>
          <Scale legend="Quanto dói agora, de 0 a 10?" name="antes" value={before} onChange={setBefore} />
          {tooStrong ? (
            <p className="notice is-strong" role="status">
              Uma dor de {before} é forte. Se é nova, está a piorar ou te preocupa, liga SNS 24 (808 24 24 24) antes de
              experimentares um exercício.
            </p>
          ) : null}
          <button className="button is-primary" type="button" disabled={before === null} onClick={() => go('running')}>
            <Play size={16} aria-hidden="true" /> {before === null ? 'Escolhe um valor para começar' : 'Começar'}
          </button>
        </>
      ) : null}

      {stage === 'running' ? (
        <>
          {plan.id === 'breath' ? (
            <div className="pacer" aria-hidden="true">
              <span className={inhaling ? 'is-in' : 'is-out'} />
              <b>{inhaling ? 'Inspira' : 'Expira'}</b>
            </div>
          ) : (
            <ol>
              {plan.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          )}
          <p className="clock" role="timer" aria-label="Tempo restante">
            {formatTime(remaining)}
          </p>
          <button className="button" type="button" onClick={() => go('after')}>
            <Square size={15} aria-hidden="true" /> Terminar agora
          </button>
        </>
      ) : null}

      {stage === 'after' ? (
        <>
          <Scale legend="E agora, de 0 a 10?" name="depois" value={after} onChange={setAfter} />
          <button
            className="button is-primary"
            type="button"
            disabled={after === null}
            onClick={() => {
              if (before !== null && after !== null) {
                onComplete({ action: actionLabel, before, after })
                go('done')
              }
            }}
          >
            <Check size={16} aria-hidden="true" /> Ver o que mudou
          </button>
        </>
      ) : null}

      {stage === 'done' && before !== null && after !== null ? (
        <>
          <p className="change" role="status">
            {describeChange({ before, after })}
          </p>
          <div className="choice-row">
            <button
              className="button is-primary"
              type="button"
              disabled={saved === 'ok'}
              onClick={() => setSaved(onSave({ action: actionLabel, before, after }) ? 'ok' : 'failed')}
            >
              {saved === 'ok' ? 'Guardado neste dispositivo' : 'Guardar neste dispositivo'}
            </button>
            <button className="button" type="button" onClick={restart}>
              Repetir
            </button>
          </div>
          {saved === 'failed' ? (
            <p className="notice is-strong" role="alert">
              O navegador não deixou guardar. Podes copiar o resumo mais abaixo.
            </p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
