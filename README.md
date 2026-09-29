# Portfolio — Marcos Rio

Personal portfolio as a Data Engineer. Built with React 19, React Router 8 (framework mode),
TypeScript, Vite and plain CSS.

Every route is **prerendered to static HTML** at build time (`ssr: false`, `prerender: true` in
`react-router.config.ts`), so the site can be deployed to any static host and is indexable by
search engines.

## Scripts

```bash
yarn dev             # local dev server (drafts visible)
yarn build           # typegen + type-check + static build into build/client
yarn preview         # serve the static build
yarn typecheck       # typegen + type-check only
yarn lint            # ESLint
yarn prettier:write  # format
```

## Structure

```
content/               # Markdown notes and projects (see content/README.md)
src/
  root.tsx             # HTML layout, header/footer, theme script, error page
  routes.ts            # route table: /, /work, /notes, /lab, /contact
  routes/              # one module per route (meta, loader, component)
  content/             # build-time Markdown loaders (*.server.ts never reach the browser)
  components/          # Header, Footer, Hero, ParticleField, PageIntro, home/ previews
  config/              # site data (name, links), sections, page meta helper
  hooks/               # useTheme, useLanguage
  i18n/                # i18next setup + locales/en.json, locales/es.json
  index.css            # design tokens (colors per theme) and shared styles
```

## Content

Notes and projects are Markdown files in `content/`. Adding a file and rebuilding publishes it.
See [`content/README.md`](content/README.md) for the frontmatter format.

## Theming

Colors are CSS custom properties defined in `src/index.css` for `[data-theme='dark']` and
`[data-theme='light']`. The theme is applied to `<html>` by an inline script in `src/root.tsx`
before first paint, so there is no flash. Dark is always the default.

## Translations

English is the default language and the one pages are prerendered in; a language chosen by the
visitor is restored after load. Texts live in `src/i18n/locales/*.json`; to add a language, create
a new JSON file with the same keys and register it in `src/i18n/index.ts`.
