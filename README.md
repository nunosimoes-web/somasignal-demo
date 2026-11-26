# SomaSignal demo

Frontend mockup for an investor-facing psychosomatic symptom map.

The app lets a user describe pain, select a body region, and receive an exploratory interpretation: likely emotional/contextual patterns, possible causes to investigate, micro-interventions, and medical safety warnings.

## Docs

- [Auditoria de conversão](docs/AUDITORIA-conversao.md) — linha de base, o que mudou e portões.
- [Benchmark](docs/BENCHMARK-conversao.md) — Curable, Pathways, Bearable, Ada, Manage My Pain e Symptomate, com fontes.
- [Roadmap de conversão](docs/ROADMAP-conversao.md) — próximas 10 melhorias priorizadas.

## Local development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm test          # vitest (unit)
npm run build
npm run test:e2e  # Playwright desktop + mobile, with axe accessibility checks
npm run check     # all of the above
```

## Deploy

GitHub Pages deploys from `.github/workflows/deploy.yml` on pushes to `main`.
