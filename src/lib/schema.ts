export type FaqItem = { question: string; answer: string }

/** JSON-LD FAQPage, escapado para poder ir dentro de um <script> no HTML. */
export function faqJsonLd(items: FaqItem[]): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: 'pt-PT',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
  return JSON.stringify(data).replaceAll('<', '\\u003c')
}

export const FAQ_PLACEHOLDER = /<!-- faq-schema:[^>]*-->/
