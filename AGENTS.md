# AGENTS.md

Single-package Next.js (App Router) app — "StudioSpace", a studio-rental directory with routes `/` and `/studios`. All app code lives under `src/`; root has no business logic. No tests exist.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack).
- `npm run build` — production build (`.env*` files are gitignored, including the existing empty `.env`).
- `npm run lint` — flat-config ESLint (no args; lints the repo root).
- Typecheck: `npx tsc --noEmit` (no `typecheck` script). Run lint + typecheck before finishing changes.
- No test runner is configured — don't invent one or add test files unless asked.

## Data layer (external backend)

- Data comes from a **separate backend at `http://localhost:5000`** (not this repo, and the URL is hardcoded in `src/lib/studios.ts`, not read from `.env`). If nothing is listening on port 5000, both `/` and `/studios` fail to render.
- `getStudios()` in `src/lib/studios.ts` is the only data function; it fetches with `cache: "no-store"` at request time. Type is `IStudio` in `src/type.ts`.
- Pages (`src/app/page.tsx`, `src/app/studios/page.tsx`) are thin server components that fetch and pass data down to client components in `src/components/home_component/` (home UI) and `src/components/studios/` (listing UI).

## Next.js quirks (verified in `next.config.ts`)

- `cacheComponents: true` (also `partialPrefetching`) — `params`, `searchParams`, and dynamic APIs (`cookies`, `headers`) require awaited/cached usage; follow Next's cacheComponents rules, not Next 14/15 habits.
- `reactCompiler: true` (`babel-plugin-react-compiler`) — write React Compiler-safe components (no hook calls in conditions, no mutating props/state, stable keys); it will transpile but misbehave otherwise.
- `next/image` only allows `https://images.unsplash.com` with `/photo-*` pathname (remotePatterns in `next.config.ts`) — any other remote image URL fails the build; use `public/images/` for local ones.
- Dev/build run on Turbopack. Tailwind v4 is wired via a Turbopack rule in `next.config.ts`; there is no `tailwind.config`, no PostCSS config — all theme/token config goes in `src/app/globals.css` (Tailwind v4 `@theme`).

## shadcn / UI (verified in `components.json`)

- Style is `base-nova`: primitives come from **`@base-ui/react`**, NOT Radix — don't import Radix packages.
- Components import `cn` from the `cn` npm package directly; `src/lib/utils.ts` re-exports it for the shadcn `@/lib/utils` alias.
- Add components with `npx shadcn add <component>`; they land in `src/components/ui`.
- Path alias `@/*` maps to `./src/*` (`tsconfig.json`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
