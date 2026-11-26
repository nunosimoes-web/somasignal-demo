import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { faq } from './src/data/faq.ts'
import { FAQ_PLACEHOLDER, faqJsonLd } from './src/lib/schema.ts'

/** Gera o FAQPage a partir da mesma fonte que a página mostra: nunca divergem. */
function faqSchema(): Plugin {
  return {
    name: 'somasignal-faq-schema',
    transformIndexHtml(html) {
      if (!FAQ_PLACEHOLDER.test(html)) {
        throw new Error('index.html: falta o marcador faq-schema')
      }
      return html.replace(FAQ_PLACEHOLDER, `<script type="application/ld+json" id="schema-faq">${faqJsonLd(faq)}</script>`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/somasignal-demo/',
  plugins: [react(), faqSchema()],
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
