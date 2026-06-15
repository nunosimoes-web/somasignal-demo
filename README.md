# SomaSignal demo

Frontend mockup for an investor-facing psychosomatic symptom map.

The app lets a user describe pain, select a body region, and receive an exploratory interpretation: likely emotional/contextual patterns, possible causes to investigate, micro-interventions, and medical safety warnings.

## Benchmark notes

Direct open-source equivalents were limited. Useful references found:

- Curable: mind-body chronic pain education and guided exercises.
- Pathways: structured pain relief program with a biopsychosocial framing.
- Bearable: symptom tracking and pattern/correlation discovery.
- Lin Health: clinician-supported chronic pain positioning.
- `Kmorris1370/Bones-and-All`: recent Flutter health app with interactive body map and pain tracking.
- `navillasa/biolingual-app`: interactive anatomy map using ApiMedic/translation APIs.
- `benediktclaus/bodymap`: R package for mapping body-related data visually.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run lint
```

## Deploy

GitHub Pages deploys from `.github/workflows/deploy.yml` on pushes to `main`.
