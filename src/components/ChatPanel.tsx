import { Bot, RotateCcw, Send, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { starters } from '../data/regions'

export type ChatMessage = { id: number; sender: 'bot' | 'user'; text: string; warning?: boolean }

export function ChatPanel({
  messages,
  onSubmit,
  onReset,
  canReset,
}: {
  messages: ChatMessage[]
  onSubmit: (text: string) => void
  onReset: () => void
  canReset: boolean
}) {
  const [draft, setDraft] = useState('')
  const [emptyHint, setEmptyHint] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)
  const hasUserMessages = messages.some((message) => message.sender === 'user')

  useEffect(() => {
    const thread = threadRef.current
    if (thread) {
      thread.scrollTop = thread.scrollHeight
    }
  }, [messages.length])

  function send(text: string) {
    const clean = text.trim()
    if (!clean) {
      setEmptyHint(true)
      return
    }
    setEmptyHint(false)
    setDraft('')
    onSubmit(clean)
  }

  return (
    <section className="panel chat-panel" aria-labelledby="passo-2">
      <div className="panel-title">
        <h2 id="passo-2">
          <span aria-hidden="true">2</span> Conta em que momentos dói
        </h2>
        {canReset ? (
          <button className="text-button" type="button" onClick={onReset}>
            <RotateCcw size={15} aria-hidden="true" /> Recomeçar
          </button>
        ) : null}
      </div>

      <div
        className="chat-thread"
        ref={threadRef}
        role="log"
        aria-label="Conversa"
        tabIndex={0}
      >
        {messages.map((message) => (
          <div className={`chat-message ${message.sender} ${message.warning ? 'is-warning' : ''}`} key={message.id}>
            {message.sender === 'bot' ? <Bot size={16} aria-hidden="true" /> : <UserRound size={16} aria-hidden="true" />}
            <p>
              <span className="sr-only">{message.sender === 'bot' ? 'SomaSignal: ' : 'Tu: '}</span>
              {message.text}
            </p>
          </div>
        ))}
      </div>

      {hasUserMessages ? null : (
        <div className="starter-row">
          <p className="label">Ou começa por um exemplo</p>
          {starters.map((starter) => (
            <button key={starter} type="button" onClick={() => send(starter)}>
              {starter}
            </button>
          ))}
        </div>
      )}

      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault()
          send(draft)
        }}
      >
        <label htmlFor="descricao">Descreve a dor por palavras tuas</label>
        <div>
          <textarea
            id="descricao"
            rows={2}
            maxLength={500}
            value={draft}
            aria-describedby={emptyHint ? 'descricao-ajuda descricao-privacidade' : 'descricao-privacidade'}
            aria-invalid={emptyHint || undefined}
            onChange={(event) => {
              setDraft(event.target.value)
              setEmptyHint(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                send(draft)
              }
            }}
            placeholder="Ex.: dói-me o joelho quando subo escadas"
          />
          <button type="submit">
            <Send size={17} aria-hidden="true" />
            <span>Enviar</span>
          </button>
        </div>
        {emptyHint ? (
          <p className="field-hint is-error" id="descricao-ajuda" role="alert">
            Escreve pelo menos a zona e quando aparece, ou escolhe um exemplo.
          </p>
        ) : null}
        <p className="field-hint" id="descricao-privacidade">
          O que escreves não é enviado para nenhum servidor.
        </p>
      </form>
    </section>
  )
}
