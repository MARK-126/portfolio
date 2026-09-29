# CLAUDE.md

Personal portfolio of Marcos Rio (Data Engineer, studying Data Science & AI, psychologist).
React 19 + React Router 8 (framework mode, static prerender) + TypeScript + Vite + plain CSS.

## Git

- **Do not add `Co-Authored-By` or any other AI attribution lines (e.g. `Claude-Session`) to commit
  messages.** Write plain, descriptive commit messages.
- Branches: `page/main` holds the shared layout and home page; each section is built in its own
  branch created from it: `page/work`, `page/notes`, `page/lab`, `page/contact`.

## Commands

```bash
yarn dev          # dev server (draft content visible)
yarn build        # typegen + tsc + static build (prerenders every route into build/client)
yarn preview      # serve build/client
yarn lint         # ESLint (must pass; pre-commit runs eslint --fix + prettier via lint-staged)
yarn prettier:write
```

Run `yarn lint` and `yarn build` before committing. Check UI changes in a browser (dark and light
theme, EN and ES, desktop and ~390px mobile) and watch the console for hydration errors.

## Architecture

- `react-router.config.ts`: `ssr: false` + `prerender` → every route is static HTML. Anything in a
  route `loader` runs at build time only. `/404` is prerendered and copied to `build/client/404.html`.
- `src/routes.ts` is the route table; route modules live in `src/routes/`. Content pages (e.g.
  case studies) are **one static route per Markdown file** (`content-paths.ts` lists them), not a
  dynamic `:slug` route: `ssr: false` forbids loaders on routes that are not prerendered, and static
  routes let unknown URLs fall through to the `*` 404 route. Their loaders read the slug from the
  URL (strip the `.data` suffix). Restart `yarn dev` after adding a content file.
- `src/content/*.server.ts` read Markdown from `content/` at build time; they must never be
  imported by client-only code. Frontmatter format is documented in `content/README.md`.
  `draft: true` files show only in `yarn dev`.
- Theme (`data-theme` on `<html>`, dark by default) and language are restored after hydration so
  prerendered HTML and the first client render match. Do not read `localStorage`/`document`
  during render.

## Conventions

- **Every UI string goes through i18n** and must exist in both `src/i18n/locales/en.json` and
  `es.json`. English is the default. Content in `content/` is single-language.
- Plain CSS, one `.css` file next to each component, BEM-like class names. Colors only through the
  tokens in `src/index.css` (`--bg`, `--text`, `--muted`, `--faint`, `--border`...), never
  hard-coded, so both themes keep working.
- Visual style: monochrome, editorial. Big tight display type (`--display`), uppercase mono labels
  (`--mono`), thin borders, no accent color, no rounded cards. Respect `prefers-reduced-motion`.
- Prettier: no semicolons, single quotes, 120 columns.
