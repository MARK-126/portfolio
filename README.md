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
  routes.ts            # route table: /, /projects(/<project>), /notes(/<article>), /contact, 404
  routes/              # one module per route (meta, loader, component)
  content/             # build-time Markdown loaders (*.server.ts never reach the browser)
  components/          # Header, Footer, Hero, PageIntro, Pager, FilterTabs, home/, projects/, notes/, contact/
  config/              # site data (name, links), sections, page meta helper
  hooks/               # useTheme, useLanguage
  i18n/                # i18next setup + locales/en.json, locales/es.json
  index.css            # design tokens (colors per theme) and shared styles
```

## Deploying

The site is hosted on **Cloudflare Pages**, connected to this GitHub repository: every push to
`main` publishes https://www.dataengineermarcos.cloud, and every other branch gets a preview URL.

| Setting                | Value          |
| ---------------------- | -------------- |
| Production branch      | `main`         |
| Build command          | `yarn build`   |
| Build output directory | `build/client` |
| Node version           | `.node-version` (22) |

The build also writes `404.html` (served by Cloudflare Pages for unknown URLs), `sitemap.xml` and
`robots.txt`. The production URL lives in `src/config/site.ts` (`url`) and is used for canonical
links, social previews (`public/og.png`) and the sitemap.

## Contact form

The form on `/contact` posts directly from the browser to [Web3Forms](https://web3forms.com), which
emails each message; no backend is needed. The access key lives in `src/config/site.ts`
(`contactFormKey`) and is public by design. With an empty key the form is disabled and points to
the email address instead.

## Content

Notes and projects are Markdown files in `content/`, images go in `public/images/`. Adding a file
and rebuilding publishes it. See [`content/README.md`](content/README.md) for the frontmatter
format, Markdown features and how to add images.

## Theming

Colors are CSS custom properties defined in `src/index.css` for `[data-theme='dark']` and
`[data-theme='light']`. The theme is applied to `<html>` by an inline script in `src/root.tsx`
before first paint, so there is no flash. Dark is always the default.

## Translations

Spanish is the default language and the one pages are prerendered in; English is available from
the language switch and a visitor's choice is restored after load. Texts live in
`src/i18n/locales/*.json`; to add a language, create a new JSON file with the same keys and
register it in `src/i18n/index.ts`.
