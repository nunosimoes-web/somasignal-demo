import { Trash2 } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'
import { regionById } from '../data/regions'
import { journalStore } from '../lib/journal'

export function Journal() {
  const entries = useSyncExternalStore(journalStore.subscribe, journalStore.getSnapshot, journalStore.getServerSnapshot)
  const [failed, setFailed] = useState(false)

  if (entries.length === 0) {
    return null
  }

  return (
    <section className="journal" aria-labelledby="registo">
      <div className="journal-head">
        <div>
          <h2 id="registo">Os teus registos</h2>
          <p>Guardados só neste navegador. Quem usar este dispositivo pode vê-los.</p>
        </div>
        <button className="text-button" type="button" onClick={() => setFailed(!journalStore.clear())}>
          <Trash2 size={15} aria-hidden="true" /> Apagar tudo
        </button>
      </div>
      {failed ? (
        <p role="alert" className="field-hint is-error">
          O navegador não deixou apagar. Limpa os dados deste site nas definições do navegador.
        </p>
      ) : null}
      <ul>
        {entries.slice(0, 6).map((entry) => (
          <li key={entry.date}>
            <span>{new Date(entry.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}</span>
            <strong>{regionById.get(entry.regionId)?.label}</strong>
            <span>{entry.action}</span>
            <b aria-label={`de ${entry.before} para ${entry.after}`}>
              {entry.before} → {entry.after}
            </b>
          </li>
        ))}
      </ul>
    </section>
  )
}
