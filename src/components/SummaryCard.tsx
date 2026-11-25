import { ClipboardCopy, Download } from 'lucide-react'
import { useState } from 'react'

export function SummaryCard({ text }: { text: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'somasignal-resumo.txt'
    link.click()
    // Alguns navegadores ainda estão a ler o ficheiro quando click() regressa.
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  return (
    <div className="summary-card">
      <h4>Leva isto a uma consulta</h4>
      <p>Junta o que escreveste, o que experimentaste e as perguntas a observar.</p>
      <details>
        <summary>Ver o resumo</summary>
        <pre tabIndex={0} aria-label="Texto do resumo">{text}</pre>
      </details>
      <div className="choice-row">
        <button className="button" type="button" onClick={copy}>
          <ClipboardCopy size={16} aria-hidden="true" /> Copiar resumo
        </button>
        <button className="button" type="button" onClick={download}>
          <Download size={16} aria-hidden="true" /> Descarregar
        </button>
      </div>
      <p className="field-hint" role="status">
        {status === 'copied' ? 'Resumo copiado.' : null}
        {status === 'failed' ? 'Não foi possível copiar. Abre «Ver o resumo» e seleciona o texto.' : null}
      </p>
    </div>
  )
}
