# CLAUDE.md

Personal portfolio of Marcos Rio (Data Engineer, studying Data Science & AI, psychologist).
React 19 + React Router 8 (framework mode, static prerender) + TypeScript + Vite + plain CSS.

## Git

- **Do not add `Co-Authored-By` or any other AI attribution lines (e.g. `Claude-Session`) to commit
  messages.** Write plain, descriptive commit messages.
- `main` is deployed by Cloudflare Workers (static assets only, `wrangler.jsonc`). Work happens on `page/*` branches that are merged into
  `main` through pull requests.

## Commands

```bash
yarn dev          # dev server (draft content visible)
yarn build        # typegen + tsc + static build (prerenders every route into build/client)
yarn preview      # serve build/client like Cloudflare does (not `vite preview`: it breaks inner pages)
yarn lint         # ESLint (must pass; pre-commit runs eslint --fix + prettier via lint-staged)
yarn prettier:write
```

Run `yarn lint` and `yarn build` before committing. Check UI changes in a browser (dark and light
theme, EN and ES, desktop and ~390px mobile) and watch the console for hydration errors.

## Architecture

- `react-router.config.ts`: `ssr: false` + `prerender` → every route is static HTML. Anything in a
  route `loader` runs at build time only. `/404` is prerendered and copied to `build/client/404.html`.
- `src/routes.ts` is the route table; route modules live in `src/routes/`. Content pages (e.g.
  projects) are **one static route per Markdown file** (`content-paths.ts` lists them), not a
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
  `es.json`. Spanish is the default UI language (pages are prerendered in Spanish; English is optional). Content in `content/` is single-language, written
  in Spanish by default (`lang` frontmatter overrides it); mark content elements with `lang` and
  use `LangBadge` where content language may differ from the UI.
- Plain CSS, one `.css` file next to each component, BEM-like class names. Colors only through the
  tokens in `src/index.css` (`--bg`, `--text`, `--muted`, `--faint`, `--border`...), never
  hard-coded, so both themes keep working.
- Visual style: cyber, apocalyptic manifesto in black, white and greys only (no color accent: the
  "signal" is contrast, e.g. inverted blocks). Message: everything will become data; the work is to
  see what will become data and how it will be processed before it exists. Headlines in uppercase
  cyber display (`--display`, Chakra Petch); `--glitch` (Doto, dot matrix) is the face text falls
  into when it glitches (`GlitchText`, used on the hero's answer line, every few seconds). Body in
  IBM Plex Sans, uppercase mono labels (`--mono`), film grain over the page (`body::after`). The
  home is built from rounded `.panel` blocks inset from the screen edges; `--invert-*` tokens are
  the grey block that flips against the page (manifesto), the closing block inverts `--text`/`--bg`.
  The hero background is `ParticleField`: static entering from the left that falls into a few
  straight lanes, drawn dashed across the field before any data reaches them; it reacts to the
  pointer and fades around the hero's text (measured from the DOM). The headline sits huge at the
  hero's bottom-left. Keep the hero uncluttered. Inner pages start with `BackLink` (history
  back, or the parent section when the visitor landed directly) via `PageIntro`. Respect `prefers-reduced-motion`.
- Motion: internal links use `viewTransition` (page fade, styled in `src/index.css`). Scroll reveals use
  `m.*` elements from `motion/react` with `reveal()` (`src/components/motion/reveal.ts`); `LazyMotion` in
  `root.tsx` loads the features as a separate chunk (`strict`: never import `motion.*`, always `m.*`).
  Mono labels can use `DecodeText`. Keep animations subtle and for content below the fold.
- The behavior panel (`BehaviorPanel` / `useBehaviorLog`) lives in the "Tu comportamiento como
  dato" project, embedded with `<div data-embed="behavior-panel"></div>` (see
  `src/components/projects/ProjectBody.tsx`). It only records interactions in memory in the
  browser; never send or store them.
- Prettier: no semicolons, single quotes, 120 columns.
