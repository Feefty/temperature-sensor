# Web

Vite + React + TypeScript dashboard for the Temperature Sensor API, styled with the
reverse-engineered Harvest design system (dark theme by default).

## Scripts

```bash
npm run dev -w @temperature-sensor/web      # dev server
npm run build -w @temperature-sensor/web    # typecheck + production build
npm run test -w @temperature-sensor/web     # unit/component tests (Vitest + RTL + jest-axe)
```

## Conventions

- **Imports** use the `@/` alias for `src/` (e.g. `import { Button } from '@/components/Button'`).
- **Components** live in their own folder:
  `ComponentName/ComponentName.tsx`, `index.ts` (re-export), `ComponentName.module.css`,
  `ComponentName.test.tsx`, and `scheme.ts` for static strings/labels/test ids when needed.
- **Styling** is CSS Modules over the design tokens in `src/styles/` (`tokens.css` primitives,
  `theme.css` semantic dark/light, `base.css` reset). No hard-coded colours or sizes.
- **Accessibility** is checked in tests with `jest-axe`; state is never conveyed by colour alone.
