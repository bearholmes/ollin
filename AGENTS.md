# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains the Chrome Extension (background, content script, options UI,
  `_locales`, icons) and is the folder you load via `chrome://extensions`.
- `bookmarklet/` adapts the shared overlay UI for the bookmarklet; reuse logic
  from `shared/ollin-core.ts` and definitions in `types/index.ts`.
- `tests/` stores Jest suites (`*.test.ts`) with DOM setup in `tests/setup.js`.
- `scripts/` holds helpers for builds and releases, `.github/workflows/` drives
  CI, and `dist/` is generated output (ignored in git).

## Build, Test, and Development Commands

- `npm install` to bootstrap dependencies.
- `npm run build` builds both Chrome and bookmarklet bundles (`build:chrome` +
  `build:bookmarklet`); `dist/` receives the artifacts.
- `npm run clean` removes `dist/` for a fresh build.
- `npm run lint` / `npm run lint:fix`: ESLint checks/fixes `.js` and `.ts`
  files.
- `npm run format` / `npm run format:check`: Prettier formats or validates
  JS/TS/JSON/MD/CSS/HTML.
- `npm test` / `npm run test:watch` / `npm run test:coverage`: run Jest suites,
  watch mode, or collect coverage (covers `app/`, excludes `shared/i18n.ts`).
- `npm run type-check` validates TypeScript with `tsc`.
- `npm run deploy`, `deploy:patch`, `deploy:minor`, `deploy:major` use
  `scripts/deploy.js`; reserve them for release work.

## Coding Style & Naming Conventions

- TypeScript is required; follow `tsconfig.json`, `eslint.config.js`, and
  Prettier defaults (2-space indent, semicolons, quoted strings) enforced via
  Husky + lint-staged (`eslint --fix` and `prettier --write` on staged files).
- Favor camelCase for functions/variables, PascalCase for exported
  classes/components, kebab-case for directories (e.g., `background/`,
  `content/`), and SCREAMING_SNAKE for shared constants when it improves
  clarity.
- Keep browser-specific logic inside `app/` or `bookmarklet/` and share code
  through `shared/ollin-core.ts` so both targets stay in sync.

## Testing Guidelines

- Jest runs in `jsdom` per `package.json`; coverage reports land in `coverage/`.
- Place new tests under `tests/` with a `*.test.ts` suffix and keep fixtures
  near the feature they exercise.
- Run `npm test` before pushing, use `npm run test:coverage` for hit rate
  checks, and `npm run test:watch` when iterating.

## Commit & Pull Request Guidelines

- Mirror existing commit subjects (`fix:`, `update:`, etc.)—start with a verb,
  stay under 72 characters, and reference issues with `#NNN` so reviewers can
  trace the request.
- Husky + lint-staged run on every commit; resolve lint/format issues locally
  with `npm run lint:fix` or `npm run format` before committing.
- PRs need a clear description, testing notes, and links to related issues or
  screenshots when UI changes are included.
