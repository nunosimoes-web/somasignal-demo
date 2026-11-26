import { ArrowDown, Brain } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { BodyMap } from './components/BodyMap'
import { ChatPanel, type ChatMessage } from './components/ChatPanel'
import { Journal } from './components/Journal'
import { Faq, Footer, Hero, HowItWorks, Limits, Partners, Privacy } from './components/Landing'
import { ResultPanel, type SafetyState } from './components/ResultPanel'
import { regionById, starters, type RegionId } from './data/regions'
import { detectAlert, type Alert } from './data/safety'
import { analyse, findRegions } from './lib/analysis'
import { journalStore } from './lib/journal'
import type { CheckIn } from './lib/summary'

const greeting: ChatMessage = {
  id: 0,
  sender: 'bot',
  text: 'Diz-me onde dói, quando aparece e o que costuma estar a acontecer à volta. Uma ou duas frases chegam.',
}

function App() {
  const [regionId, setRegionId] = useState<RegionId | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([greeting])
  const [alert, setAlert] = useState<Alert | null>(null)
  const [safety, setSafety] = useState<SafetyState>('unchecked')
  const [session, setSession] = useState(0)
  const [resultVisible, setResultVisible] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const panelRef = useRef<HTMLElement>(null)

  const text = words.join('. ')
  const analysis = useMemo(() => (regionId ? analyse(regionId, text) : null), [regionId, text])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !('IntersectionObserver' in window)) {
      return
    }
    const observer = new IntersectionObserver(([entry]) => setResultVisible(entry.isIntersecting))
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  /** Leva a pessoa (e o leitor de ecrã) ao resultado depois de uma ação que o muda. */
  function focusResult() {
    requestAnimationFrame(() => headingRef.current?.focus())
  }

  function say(...added: Omit<ChatMessage, 'id'>[]) {
    setMessages((current) => {
      const nextId = current[current.length - 1].id + 1
      return [...current, ...added.map((message, index) => ({ ...message, id: nextId + index }))]
    })
  }

  function selectRegion(id: RegionId) {
    if (id === regionId) {
      return
    }
    setRegionId(id)
    setSafety('unchecked')
    setSession((current) => current + 1)
  }

  function submitText(input: string) {
    const nextAlert = detectAlert(input)
    const mentioned = findRegions(input)[0]
    const nextId = mentioned?.id ?? regionId
    const user = { sender: 'user' as const, text: input }

    setWords((current) => [...current, input])
    setSafety('unchecked')
    setSession((current) => current + 1)
    if (mentioned) {
      setRegionId(mentioned.id)
    }
    // Um alerta só sai quando a pessoa o afasta; uma crise nunca é substituída por um alerta físico.
    if (nextAlert && alert?.kind !== 'crisis') {
      setAlert(nextAlert)
    }

    if (nextAlert?.kind === 'crisis') {
      say(user, { sender: 'bot', warning: true, text: 'Obrigado por escreveres isto. Antes de mais, vê os contactos de ajuda imediata.' })
    } else if (nextAlert) {
      say(user, { sender: 'bot', warning: true, text: 'Isto pode precisar de avaliação médica. Vê primeiro o que fazer, antes de procurarmos padrões.' })
    } else if (!nextId) {
      say(user, {
        sender: 'bot',
        text: 'Ainda não percebi a zona. Toca no mapa ou escreve, por exemplo, «dói-me a lombar ao fim do dia».',
      })
      return
    } else {
      say(user, {
        sender: 'bot',
        text: `Entendi: ${regionById.get(nextId)?.label.toLowerCase()}. Confirma os sinais de alerta e mostro-te o que observar.`,
      })
    }
    focusResult()
  }

  function reset() {
    setRegionId(null)
    setWords([])
    setMessages([greeting])
    setAlert(null)
    setSafety('unchecked')
    setSession((current) => current + 1)
  }

  function showExample() {
    reset()
    submitText(starters[0])
  }

  function saveCheckIn(checkIn: CheckIn) {
    return regionId ? journalStore.add({ ...checkIn, regionId, date: new Date().toISOString() }) : false
  }

  return (
    <>
      <a className="skip-link" href="#mapa">
        Saltar para o mapa
      </a>
      <div className="app">
        <header className="topbar">
          <a className="brand-mark" href="#topo" id="topo">
            <Brain size={20} aria-hidden="true" /> SomaSignal
          </a>
          <nav aria-label="Principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#seguranca">Segurança</a>
            <a href="#perguntas">Perguntas</a>
            <a href="#contacto">Contacto</a>
            <a className="nav-cta" href="#mapa">
              Experimentar
            </a>
          </nav>
        </header>

        <main>
          <Hero onExample={showExample} />

          <div className="app-grid" id="mapa">
            <section className="panel map-panel" aria-labelledby="passo-1">
              <div className="panel-title">
                <h2 id="passo-1">
                  <span aria-hidden="true">1</span> Escolhe a zona
                </h2>
              </div>
              <BodyMap active={regionId} onSelect={selectRegion} />
              <p className="map-hint" role="status">
                {regionId ? `Zona escolhida: ${regionById.get(regionId)?.label}.` : 'Toca na zona que mais te incomoda.'}
              </p>
            </section>

            <ChatPanel
              messages={messages}
              onSubmit={submitText}
              onReset={reset}
              canReset={words.length > 0 || regionId !== null}
            />

            <ResultPanel
              analysis={analysis}
              alert={alert}
              safety={safety}
              words={words}
              sessionKey={String(session)}
              headingRef={headingRef}
              panelRef={panelRef}
              onDismissAlert={() => {
                setAlert(null)
                focusResult()
              }}
              onSafety={(state) => {
                setSafety(state)
                focusResult()
              }}
              onSelectRegion={(id) => {
                selectRegion(id)
                focusResult()
              }}
              onSave={saveCheckIn}
              onExample={showExample}
            />
          </div>

          <Journal />
          <HowItWorks />
          <Limits />
          <Privacy />
          <Faq />
          <Partners />
        </main>
        <Footer />
      </div>

      {analysis && !resultVisible ? (
        <a className="jump-bar" href="#resultado">
          <span>
            {analysis.region.label}
            {alert ? ': vê primeiro os contactos' : safety === 'unchecked' ? ': confirma os sinais' : ': ver resultado'}
          </span>
          <ArrowDown size={18} aria-hidden="true" />
        </a>
      ) : null}
    </>
  )
}

export default App
