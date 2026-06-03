/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Proxy the API in dev so the app calls same-origin /api/v1 (and sidesteps CORS).
  server: {
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    passWithNoTests: true,
    // jest-axe runs are CPU-heavy in jsdom; give them headroom over the 5s default under CI load.
    testTimeout: 15000,
    // Node's fetch needs an absolute base; the app itself defaults to the same-origin /api/v1.
    env: { VITE_API_URL: 'http://localhost/api/v1' },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      // Type-only modules (e.g. types.ts) emit no runtime code, so they have nothing to cover.
      exclude: [
        'src/main.tsx',
        'src/test/**',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/types.ts',
      ],
      thresholds: { branches: 90, functions: 95, lines: 90, statements: 90 },
    },
  },
});
