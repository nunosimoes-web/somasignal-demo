import { defineConfig, devices } from '@playwright/test'

// Porta própria para não reaproveitar por engano o servidor de outro projeto na 5173.
const PORT = 5187
const baseURL = `http://127.0.0.1:${PORT}/somasignal-demo/`

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL,
    locale: 'pt-PT',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
})
