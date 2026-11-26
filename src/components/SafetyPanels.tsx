import { Phone, ShieldAlert, ShieldCheck } from 'lucide-react'
import { contacts, zoneSigns, type Alert, type Sign } from '../data/safety'
import type { Region } from '../data/regions'

type HeadingRef = React.RefObject<HTMLHeadingElement | null>

function CallLink({ contact, primary }: { contact: { label: string; href: string }; primary?: boolean }) {
  return (
    <a className={`call-link ${primary ? 'is-primary' : ''}`} href={contact.href}>
      <Phone size={17} aria-hidden="true" /> {contact.label}
    </a>
  )
}

export function CrisisPanel({ headingRef, onDismiss }: { headingRef: HeadingRef; onDismiss: () => void }) {
  return (
    <div className="urgent" role="alert">
      <h3 ref={headingRef} tabIndex={-1}>
        <ShieldAlert size={20} aria-hidden="true" /> Vamos parar o mapa aqui
      </h3>
      <p>
        O que escreveste pode querer dizer que estás em sofrimento. Não tens de passar por isto sem companhia. Se estás
        em perigo, ou pensas magoar-te, liga agora.
      </p>
      <div className="call-row">
        <CallLink contact={contacts.emergency} primary />
        <CallLink contact={contacts.prevention} />
      </div>
      <p>
        O 1411 é a linha nacional de prevenção do suicídio e funciona 24 horas por dia. Se puderes, pede a alguém de
        confiança que fique contigo.
      </p>
      <button className="text-button" type="button" onClick={onDismiss}>
        Não é o meu caso, voltar ao mapa
      </button>
    </div>
  )
}

export function PhysicalAlertPanel({
  alert,
  headingRef,
  onDismiss,
}: {
  alert: Alert
  headingRef: HeadingRef
  onDismiss: () => void
}) {
  return (
    <div className="urgent" role="alert">
      <h3 ref={headingRef} tabIndex={-1}>
        <ShieldAlert size={20} aria-hidden="true" /> Primeiro, fala com um profissional
      </h3>
      <p>
        Reparei nisto no que escreveste: <strong>{alert.labels.join(', ')}</strong>. Pode precisar de avaliação médica e
        não deve ser explicado por stress ou emoções sem isso.
      </p>
      {alert.level === 'now' ? (
        <>
          <p>Se está a acontecer agora, começou de repente ou é muito forte, liga 112. Se tiveres dúvidas, liga SNS 24.</p>
          <div className="call-row">
            <CallLink contact={contacts.emergency} primary />
            <CallLink contact={contacts.sns24} />
          </div>
        </>
      ) : (
        <>
          <p>Liga para o SNS 24 para saberes o que fazer. Se piorares de repente, liga 112.</p>
          <div className="call-row">
            <CallLink contact={contacts.sns24} primary />
            <CallLink contact={contacts.emergency} />
          </div>
        </>
      )}
      <button className="text-button" type="button" onClick={onDismiss}>
        Não é o meu caso, ou já fui avaliado por isto
      </button>
    </div>
  )
}

export function SafetyCheck({
  region,
  headingRef,
  onClear,
  onFlag,
}: {
  region: Region
  headingRef: HeadingRef
  onClear: () => void
  onFlag: () => void
}) {
  const signs: Sign[] = zoneSigns[region.signs]
  return (
    <div className="safety-check">
      <h3 ref={headingRef} tabIndex={-1}>
        <ShieldCheck size={20} aria-hidden="true" /> {region.label}: confirma primeiro
      </h3>
      <p>Tens algum destes sinais?</p>
      <ul>
        {signs.map((sign) => (
          <li key={sign.text}>{sign.text}</li>
        ))}
      </ul>
      <div className="choice-row">
        <button className="button is-primary" type="button" onClick={onClear}>
          Nenhum destes
        </button>
        <button className="button" type="button" onClick={onFlag}>
          Sim, ou não tenho a certeza
        </button>
      </div>
    </div>
  )
}

export function FlaggedPanel({
  region,
  headingRef,
  onBack,
}: {
  region: Region
  headingRef: HeadingRef
  onBack: () => void
}) {
  const signs: Sign[] = zoneSigns[region.signs]
  const now = signs.filter((sign) => sign.level === 'now')
  const today = signs.filter((sign) => sign.level === 'today')

  return (
    <div className="urgent" role="alert">
      <h3 ref={headingRef} tabIndex={-1}>
        <ShieldAlert size={20} aria-hidden="true" /> Fala com um profissional antes de continuares
      </h3>
      {now.length > 0 ? (
        <>
          <p>
            <strong>Liga 112 se tens:</strong>
          </p>
          <ul>
            {now.map((sign) => (
              <li key={sign.text}>{sign.text}</li>
            ))}
          </ul>
        </>
      ) : null}
      {today.length > 0 ? (
        <>
          <p>
            <strong>Liga SNS 24 se tens:</strong>
          </p>
          <ul>
            {today.map((sign) => (
              <li key={sign.text}>{sign.text}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p>Não tens a certeza? O SNS 24 ajuda-te a decidir. Se piorares de repente, liga 112.</p>
      <div className="call-row">
        <CallLink contact={contacts.emergency} primary={now.length > 0} />
        <CallLink contact={contacts.sns24} primary={now.length === 0} />
      </div>
      <button className="text-button" type="button" onClick={onBack}>
        Voltar à confirmação
      </button>
    </div>
  )
}
