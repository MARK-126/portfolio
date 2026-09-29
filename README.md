# Portfolio — Marcos Rio

Personal portfolio as a Data Engineer. Built with React 19, TypeScript, Vite and plain CSS.

## Scripts

```bash
yarn dev             # local dev server
yarn build           # type-check + production build
yarn preview         # serve the production build
yarn lint            # ESLint
yarn prettier:write  # format
```

## Structure

```
src/
  config/site.ts       # name and social links (empty link = hidden)
  i18n/                # i18next setup + locales/en.json, locales/es.json
  hooks/useTheme.ts    # dark (default) / light theme, persisted in localStorage
  components/          # Header, Hero, PipelineCard, Icons (+ their CSS)
  index.css            # design tokens (colors per theme) and shared styles
```

## Theming

Colors are CSS custom properties defined in `src/index.css` for `[data-theme='dark']` and
`[data-theme='light']`. The theme is applied to `<html>` by an inline script in `index.html`
before first paint, so there is no flash. Dark is always the default.

## Translations

English is the default language. Texts live in `src/i18n/locales/*.json`; to add a language,
create a new JSON file with the same keys and register it in `src/i18n/index.ts`.
