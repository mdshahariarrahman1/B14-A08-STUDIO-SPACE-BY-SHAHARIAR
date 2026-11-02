# AGENTS.md

Single-package Next.js (App Router) app — "StudioSpace", a studio-rental directory. Routes: `/` (home), `/studios`, `/studios/[id]`, `/login`, `/register` (grouped under `src/app/(auth)/`), `/my-listings`, `/add-studio`, plus API routes `/api/auth/[...all]` (better-auth handler) and `/api/studios` (POST create listing). All app code lives under `src/`; root has no business logic. No tests exist.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack).
- `npm run build` — production build (`.env*` files are gitignored; the local `.env` holds auth secrets, keep it that way).
- `npm run lint` — flat-config ESLint (no args; lints the repo root).
- Typecheck: `npx tsc --noEmit` (no `typecheck` script). Run lint + typecheck before finishing changes.
- No test runner is configured — don't invent one or add test files unless asked.

## Data layer — backend on port 5000

- All studio/booking data lives in a **separate backend at `http://localhost:5000`** (not this repo; the URL is **hardcoded**, not read from `.env`) in `src/lib/studios.ts`, `src/lib/bookings.ts`, and `src/app/api/studios/route.ts`. If nothing is listening on port 5000, `/` and `/studios` fail to render and writes return 502.
  - `GET /studios` — `getStudios()` (server, `cache: "no-store"`); `getStudioById(id)` loads the full list and filters in memory. Type is `IStudio` in `src/type.ts`.
  - `POST /bookings` — `createBooking()` in `src/lib/bookings.ts`, called **from the browser** (`BookingWidget.tsx` client component), so the backend must serve CORS.
  - `POST /studios` — listing creation goes through this repo's `/api/studios` (auth-gated, server-side), never directly from the client.
- Valid `category`/`amenities` values come from `src/lib/studio-options.ts` (`STUDIO_CATEGORIES`, `STUDIO_AMENITIES`) — `/api/studios` rejects anything else; don't hardcode new option lists elsewhere.
- Pages are thin server components under `src/app/` that fetch and pass data down to client components in `src/components/home_component/`, `src/components/studios/`, and `src/components/auth_component/`.

## Auth (better-auth + MongoDB) — now wired to the UI

- Server instance is `auth` in `src/lib/auth.ts` (better-auth with `mongodbAdapter`, email+password enabled); the catch-all route at `src/app/api/auth/[...all]/route.ts` exposes it; browser client is `authClient` in `src/lib/auth-client.ts` (also re-exports `signIn`, `signUp`, `useSession`).
- Server-side session: use `getCurrentUser()` from `src/lib/server-auth.ts` (`auth.api.getSession({ headers: await headers() })`) — never call `auth.api` directly from a page.
- Required env vars (all in the gitignored `.env`): `MONGODB_URL` (`process.env.MONGODB_URL!` non-null assertion in `auth.ts`), `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`. If `MONGODB_URL` is missing, anything importing `@/lib/auth` breaks. Auth DB is MongoDB, `studio_Space` database.
- Auth screens are real (`src/components/auth_component/`): `LoginScreen`/`RegisterScreen` use `authClient`, and the login page honors `?callbackURL=` (refuses non-local paths: must start with `/` and not `//`).
- Protected pages (`/my-listings`, `/add-studio`) follow the existing pattern: async private server component that `redirect("/login?callbackURL=...")` when unauthenticated, wrapped in `<Suspense>` by the exported page; `/my-listings` filters studios by `ownerEmail`. Keep that pattern for new private pages.

## Next.js quirks (verified in `next.config.ts`)

- `cacheComponents: true` (also `partialPrefetching`) — `params`/`searchParams` are Promises (see `/studios/[id]/page.tsx` awaiting `params`), and dynamic APIs require awaited/cached usage; follow Next's cacheComponents rules, not Next 14/15 habits.
- `reactCompiler: true` (`babel-plugin-react-compiler`) — write React Compiler-safe components (no hook calls in conditions, no mutating props/state, stable keys); it will transpile but misbehave otherwise.
- `next/image` only allows `https://images.unsplash.com` with `/photo-*` pathname (remotePatterns in `next.config.ts`) — any other remote image URL fails the build; user-submitted imageUrl values get around this with `<Image unoptimized>` (see `my-listings/page.tsx`). Use `public/images/` for new local images.
- Dev/build run on Turbopack. Tailwind v4 is wired via a Turbopack rule in `next.config.ts`; there is no `tailwind.config`, no PostCSS config — all theme/token config goes in `src/app/globals.css` (Tailwind v4 `@theme`). Most page styling uses arbitrary-value hex classes, not theme tokens.
- Home section components are wrapped in `<Suspense>` with skeleton fallbacks and scroll-streamed via `await connection()` in `src/app/page.tsx` — follow this streaming pattern for new server-fetched sections.

## shadcn / UI (verified in `components.json`)

- Style is `base-nova`: primitives come from **`@base-ui/react`**, NOT Radix — don't import Radix packages.
- Components import `cn` from the `cn` npm package directly; `src/lib/utils.ts` re-exports it for the shadcn `@/lib/utils` alias.
- Add components with `npx shadcn add <component>`; they land in `src/components/ui`.
- Path alias `@/*` maps to `./src/*` (`tsconfig.json`).

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-adds the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
