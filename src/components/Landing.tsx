import { ArrowDown, Ear, HeartPulse, LockKeyhole, Mail, ShieldCheck, UserX } from 'lucide-react'
import { faq } from '../data/faq'

export const CONTACT = 'somasignal@cognixhub.com'

export function Hero({ onExample }: { onExample: () => void }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Mapa de sintomas · demonstração gratuita</p>
        <h1>Onde dói? E o que se passa à volta dessa dor?</h1>
        <p className="lead">
          Escolhe uma zona do corpo e conta em que momentos dói. Em poucos minutos tens sinais de alerta a excluir,
          perguntas para observares e um primeiro passo simples.
        </p>
        <div className="hero-actions">
          <a className="button is-primary is-large" href="#mapa">
            Começar pelo mapa <ArrowDown size={18} aria-hidden="true" />
          </a>
          <button className="button is-large" type="button" onClick={onExample}>
            Ver um exemplo
          </button>
        </div>
        <ul className="trust">
          <li>
            <UserX size={16} aria-hidden="true" /> Sem registo
          </li>
          <li>
            <LockKeyhole size={16} aria-hidden="true" /> O que escreves não sai do navegador
          </li>
          <li>
            <ShieldCheck size={16} aria-hidden="true" /> Exploratório, não é diagnóstico
          </li>
        </ul>
      </div>
      <aside className="hero-card" aria-label="Exemplo de resultado">
        <p className="label">Exemplo de resultado</p>
        <p className="hero-quote">«Tensão no pescoço ao fim de um dia ao computador»</p>
        <dl>
          <div>
            <dt>Excluir primeiro</dt>
            <dd>Fraqueza, dormência, febre com rigidez</dd>
          </div>
          <div>
            <dt>Observar</dt>
            <dd>Quanto tempo passa entre ficares parado e a dor aparecer?</dd>
          </div>
          <div>
            <dt>Experimentar</dt>
            <dd>Movimento suave, 3 minutos, dor medida antes e depois</dd>
          </div>
        </dl>
      </aside>
    </section>
  )
}

export function HowItWorks() {
  return (
    <section className="section" id="como-funciona" aria-labelledby="titulo-como">
      <h2 id="titulo-como">Como funciona</h2>
      <ol className="how">
        <li>
          <HeartPulse size={22} aria-hidden="true" />
          <h3>Excluir o urgente</h3>
          <p>Antes de qualquer interpretação, confirmas uma lista curta de sinais de alerta para essa zona.</p>
        </li>
        <li>
          <Ear size={22} aria-hidden="true" />
          <h3>Observar padrões</h3>
          <p>Recebes perguntas ligadas ao que contaste, para testares nos próximos dias. São hipóteses, não veredictos.</p>
        </li>
        <li>
          <ShieldCheck size={22} aria-hidden="true" />
          <h3>Experimentar e medir</h3>
          <p>Fazes um passo curto, comparas a dor antes e depois e levas um resumo a uma consulta, se quiseres.</p>
        </li>
      </ol>
    </section>
  )
}

export function Limits() {
  return (
    <section className="section limits" id="seguranca" aria-labelledby="titulo-seguranca">
      <div>
        <h2 id="titulo-seguranca">O que é, e o que não é</h2>
        <p>
          O SomaSignal parte de uma ideia simples: uma dor raramente vem sozinha. Sono, movimento, carga e preocupações
          podem acompanhá-la, e reparar nisso ajuda a conversar melhor com quem te trata.
        </p>
      </div>
      <div className="limits-grid">
        <div>
          <h3>Serve para</h3>
          <ul>
            <li>organizar o que sentes</li>
            <li>reparar em padrões ao longo dos dias</li>
            <li>preparar uma consulta</li>
          </ul>
        </div>
        <div>
          <h3>Não serve para</h3>
          <ul>
            <li>diagnosticar ou excluir doenças</li>
            <li>decidir sobre medicação ou tratamentos</li>
            <li>emergências: aí, liga 112</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  return (
    <section className="section" id="perguntas" aria-labelledby="titulo-perguntas">
      <h2 id="titulo-perguntas">Perguntas frequentes</h2>
      <div className="faq">
        {faq.map((item) => (
          <details key={item.question}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function Partners() {
  const subject = encodeURIComponent('SomaSignal: quero saber mais')
  return (
    <section className="section partners" id="contacto" aria-labelledby="titulo-contacto">
      <div>
        <h2 id="titulo-contacto">Trabalhas em saúde, dor ou investimento?</h2>
        <p>
          O SomaSignal é uma demonstração à procura de parceiros para validar clinicamente o conteúdo e testar com
          pessoas reais. Se te interessa, escreve-nos.
        </p>
      </div>
      <div>
        <a className="button is-light is-large" href={`mailto:${CONTACT}?subject=${subject}`}>
          <Mail size={18} aria-hidden="true" /> Falar com a equipa
        </a>
        <p className="small">
          ou escreve para <span className="email">{CONTACT}</span>
        </p>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <p>
        <strong>Em emergência liga 112.</strong> SNS 24: <a href="tel:808242424">808 24 24 24</a>. Prevenção do suicídio:{' '}
        <a href="tel:1411">1411</a>.
      </p>
      <p>
        O SomaSignal é uma demonstração exploratória. Não é um dispositivo médico, não faz diagnósticos e não substitui um
        profissional de saúde.
      </p>
      <p>
        <a href={`mailto:${CONTACT}`}>Apoio à demonstração · {CONTACT}</a>
      </p>
    </footer>
  )
}
