# Auditoria de conversão e produto — SomaSignal (26/11/2026)

**Âmbito:** landing, primeira utilização, valor percebido, mobile, acessibilidade, performance e SEO.
**Comparação:** live (`main`, https://nunosimoes-web.github.io/somasignal-demo/, acedido a 2026-11-26) contra esta branch (`agente/q2-somasignal`).
**Benchmark:** 6 produtos semelhantes, com as fontes em [BENCHMARK-conversao.md](BENCHMARK-conversao.md).

## 1. Público e objetivo

Há dois públicos:
1. **Adultos com dor recorrente.** Precisam de chegar ao primeiro valor sem esforço e sem medo de que lhes digam que a dor é "psicológica".
2. **Parceiros clínicos e investidores.** Precisam de perceber em 30 segundos o que o produto faz, porque é seguro e como entrar em contacto.

Conversões que contam:
- **Primeiro valor:** a pessoa chega ao resultado.
- **Valor completo:** faz o passo medido e fica com o resumo.
- **Contacto de parceiro:** usa o mailto.

## 2. Linha de base (live em `main`)

| Área | Achado | Impacto |
|---|---|---|
| Copy | O H1 "Onde doi? O que pode estar por tras?" e o título do passo 3, "Causas e solucoes", estão sem acentos. A app "sugere causas possíveis", uma promessa clínica forte demais para uma demo sem validação. | Credibilidade e risco regulatório |
| Segurança | Alertas só quando o texto livre os deteta. Não há confirmação de sinais de alerta por zona antes das sugestões. | Risco para o utilizador e para os parceiros clínicos |
| Estrutura | Página única de ferramenta. Não tem "como funciona", limites, FAQ, privacidade nem CTA de parceria; o contacto está só no rodapé. | Investidores e clínicos não encontram o pitch |
| Primeira utilização | Havia exemplos, mas o resultado não explicava "porquê isto" e não havia nada para levar (resumo). | Valor percebido baixo |
| SEO | `lang="pt"`, sem favicon ligado, sem OG/Twitter, sem canonical, sem JSON-LD, sem robots nem sitemap. Descrição sem acentos ("psicossomaticos"). | Partilha nas redes sem pré-visualização |
| Acessibilidade | axe (WCAG 2.2 AA) sem violações automáticas, nem em desktop nem em mobile. | — |
| Mobile | Sem scroll horizontal. O resultado fica muito abaixo da dobra, sem atalho. | Abandono no telemóvel |
| Testes | Havia 1 e2e, desatualizado em relação ao código WIP. Não havia testes unitários. | Regressões silenciosas |

## 3. Estado do WIP de 25/11 (encontrado ao retomar)

O commit `e49021a` reestruturou a app em componentes. Acrescentou:
- confirmação de sinais de alerta por zona (NHS);
- painel de crise com o 1411;
- passo medido 0–10 antes e depois;
- registo local;
- resumo para a consulta;
- secções da landing.

Ficou com três problemas:
- **O build estava partido:** `rule.test` era uma RegExp chamada como função, em `src/data/safety.ts`.
- **O lint falhava:** `no-useless-assignment` em `src/lib/journal.ts`.
- **Nenhuma das ~70 classes novas tinha CSS:** a página aparecia sem estilos.

## 4. O que mudou nesta branch

| # | Melhoria | Origem (benchmark) | Evidência |
|---|---|---|---|
| 1 | Correções de build e lint no WIP | — | `npm run build` e `npm run lint` verdes |
| 2 | CSS novo, de raiz: sistema de tokens, mapa com etiquetas alinhadas aos pontos, escala 0–10 acessível, estados de alerta, `prefers-reduced-motion` | — | Capturas em desktop e mobile |
| 3 | Hero com promessa de tempo ("cerca de 5 minutos"), "resumo para a tua próxima consulta" e microcopy de confiança (sem registo, nada sai do navegador, não é diagnóstico) | Manage My Pain "<60 seconds"; Symptomate "get ready for your visit"; Curable "complement your existing care" | `Landing.tsx` |
| 4 | Cartão de exemplo com "Experimentar este exemplo", e "Ver um exemplo" também no estado vazio do resultado | Manage My Pain "Download Sample Report" | e2e "o exemplo do hero…" e "estado vazio…" |
| 5 | Resumo com os sinais de alerta excluídos ("confirmei não ter") | Ada (relatório com o que está presente e o que está ausente) | Teste unitário e e2e |
| 6 | Secção "A tua privacidade, em quatro promessas", todas verificáveis no código | Bearable, Manage My Pain | `Privacy()` |
| 7 | Fontes NHS visíveis na secção de limites (8 links, todos com HTTP 200 a 2026-11-26) | Prova honesta, sem métricas inventadas | `Limits()` |
| 8 | Bloco de parceiros com o que procuramos (clínicos, clínicas piloto, investidores) e CTA "Experimentar" fixo na barra de topo | — | `Partners()`, `App.tsx` |
| 9 | SEO: título e descrição novos, `pt-PT`, canonical, favicon, OG e Twitter com imagem 1200×630, JSON-LD `WebApplication` e `FAQPage` gerado no build a partir de `faq.ts` (nunca diverge), `robots.txt`, `sitemap.xml`, `<noscript>` com 112 e SNS 24 | — | e2e "landing"; `dist/index.html` |
| 10 | Mobile: barra fixa "ver resultado" quando o resultado está fora do ecrã, e mapa compacto em ecrãs estreitos | — | e2e "mobile" (Pixel 7) |
| 11 | Limpeza: assets não usados removidos (`hero.png`, `react.svg`, `vite.svg`) e `@playwright/test` duplicado no `package.json` | — | diff |

## 5. Portões (G0) nesta branch

- `npm run lint`: verde.
- `npm test` (vitest): 32 testes unitários em 4 ficheiros. Cobrem a deteção de zonas e contextos, os alertas físicos e de crise, os contactos, o registo, o resumo, o schema FAQ e a integridade dos dados.
- `npm run build`: verde. JS com 81,5 kB gzip, CSS com 4,7 kB gzip.
- `npm run test:e2e` (Playwright, desktop + Pixel 7): 21 passaram e 1 foi ignorado (o teste só de mobile, no projeto desktop). Inclui axe WCAG 2.2 AA na landing e no resultado, sem violações sérias nem críticas, e a ausência de scroll horizontal.

## 6. O que fica por fazer

Está priorizado em [ROADMAP-conversao.md](ROADMAP-conversao.md). Os pontos críticos são três:
- validação clínica dos sinais de alerta;
- medição (hoje não há analítica, por opção de privacidade);
- prova social real.
