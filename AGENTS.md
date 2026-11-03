# AGENTS.md

Single-package Next.js (App Router) app — "StudioSpace", a studio-rental directory. Routes: `/` (home), `/studios`, `/studios/[id]`, `/studio/details/[studioId]`, `/login`, `/register` (grouped under `src/app/(auth)/`), `/my-listings`, `/my-bookings` (`/my-booking` is a redirect alias), `/add-studio`, `/edit-studio/[studioId]`, `/profile`, `/wishlist`, plus API routes `/api/auth/[...all]` (better-auth handler), `/api/studios` (POST create listing), `/api/studios/[studioId]` (authenticated listing updates/deletion), `/api/bookings` + `/api/bookings/[id]` (authenticated booking ops), and `/api/wishlist` (authenticated GET/POST/DELETE wishlist ops). All app code lives under `src/`; root has no business logic. No tests exist.

## Commands

- `npm run dev` — dev server on http://localhost:3000 (Turbopack).
- `npm run build` — production build (`.env*` files are gitignored; the local `.env` holds auth secrets, keep it that way).
- `npm run lint` — flat-config ESLint (no args; lints the repo root).
- Typecheck: `npx tsc --noEmit` (no `typecheck` script). Run lint + typecheck before finishing changes.
- No test runner is configured — don't invent one or add test files unless asked.

## Data layer — studio backend and MongoDB bookings

- Studio data lives in a separate backend configured by the server-side `BACKEND_URL` environment variable (not this repo) and is requested in `src/lib/studios-server.ts` and `src/app/api/studios/route.ts`. Set it to the backend origin without a trailing slash in local `.env` and Vercel Environment Variables. If it is unset or unavailable, `/` and `/studios` fail to render and studio writes return an error.
  - `GET /studios` — `getStudios()` uses the Next.js `minutes` cache profile and is invalidated after successful listing mutations; `getStudioById(id)` filters the cached list in memory. Type is `IStudio` in `src/type.ts`.
  - Booking records are stored in the `bookings` collection in MongoDB database `studio_Space`. The authenticated Next.js handlers at `/api/bookings` and `/api/bookings/[id]` derive the user from the server session, verify studio data against `BACKEND_URL`, calculate prices on the server, and protect booking reads, cancellation, and deletion by user email (cancel only works on `Pending` bookings, via PATCH).
  - Hourly reservations are guarded by unique records in the MongoDB `bookingSlots` collection (unique index `{studioId, date, hour}`, created on every POST) to prevent overlapping bookings; a `E11000` duplicate-key error becomes a 409, and cancelling a pending reservation releases its slots.
  - Fixed valid booking start times live in `BOOKING_START_SLOTS` in `src/lib/bookings.ts` (09:00–19:00, 2h grid); `/api/bookings` rejects anything else, plus durations outside 1–8h and past dates. Client code must go through the helpers in `src/lib/bookings.ts` (`createBooking`, `getMyBookings`, `cancelBooking`, `deleteBooking`) — never raw-fetch `/api/bookings`.
  - Booking records deliberately store duplicate fields (`status`/`bookingStatus`, `total`/`totalPrice`, `date`/`bookingDate`, `user.*`/`userName`...) — the dashboards rely on this; keep the pairs in sync in any new write.
  - Wishlist records live in the MongoDB `wishlist` collection (unique index `{userEmail, studioId}`, created on every request; `E11000` duplicates become a 409). Client code must go through the helpers in `src/lib/wishlist.ts` (`getWishlist`, `getWishlistStatus`, `addItemToWishlist`, `removeItemFromWishlist`) — never raw-fetch `/api/wishlist`.
  - Listing create/update validation uses `parseStudioInput` in `src/lib/studio-validation.ts`; mutation headers (`x-booking-api-secret`, `x-studio-owner-email`) are built by `getStudioServiceHeaders` in `src/lib/studio-service.ts` (returns `null` when `BOOKING_API_SECRET` is unset — backends then answer 503).
  - `POST /studios` — listing creation goes through this repo's `/api/studios` (auth-gated, server-side), never directly from the client.
  - `PUT`/`PATCH`/`DELETE /studios/:id` — listing edits and deletion go through this repo's authenticated `/api/studios/[studioId]` proxy, which verifies the signed-in owner. Backend mutations require the shared `BOOKING_API_SECRET` and trusted owner-email headers; keep the secret configured in both ignored `.env` files.
- Valid `category`/`amenities` values come from `src/lib/studio-options.ts` (`STUDIO_CATEGORIES`, `STUDIO_AMENITIES`) — `/api/studios` rejects anything else; don't hardcode new option lists elsewhere.
- Pages are thin server components under `src/app/` that fetch and pass data down to client components in `src/components/home_component/`, `src/components/studios/`, and `src/components/auth_component/`.

## Auth (better-auth + MongoDB) — now wired to the UI

- Server instance is `auth` in `src/lib/auth.ts` (better-auth with `mongodbAdapter`, email+password enabled); the catch-all route at `src/app/api/auth/[...all]/route.ts` exposes it; browser client is `authClient` in `src/lib/auth-client.ts` (also re-exports `signIn`, `signUp`, `useSession`).
- Server-side session: use `getCurrentUser()` from `src/lib/server-auth.ts` (`auth.api.getSession({ headers: await headers() })`) — never call `auth.api` directly from a page.
- Shared Mongo client is `src/lib/mongodb.ts` (`mongoClient` + `mongoDb` = `studio_Space` db); API routes import `mongoDb` directly. Required env vars (all in the gitignored `.env`): `MONGODB_URL` (throws at import time if missing, in `mongodb.ts`), `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`. Auth DB is the same `studio_Space` database.
- Auth screens are real (`src/components/auth_component/`): `LoginScreen`/`RegisterScreen` use `authClient`, read `?callbackURL=` from `window.location.search`, and refuse non-local paths (must start with `/` but not `//`).
- Protected pages (`/my-listings`, `/my-bookings`, `/add-studio`, `/profile`, `/wishlist`) follow the existing pattern: async private server component that `redirect("/login?callbackURL=...")` when unauthenticated, wrapped in `<Suspense>` by the exported page; `/my-listings` filters studios by `ownerEmail`, `/profile` computes listing/rating stats the same way, and `/my-bookings` + `/wishlist` load records through their authenticated APIs. Keep that pattern for new private pages.

## Next.js quirks (verified in `next.config.ts`)

- `cacheComponents: true` (also `partialPrefetching`) — `params`/`searchParams` are Promises (see `/studios/[id]/page.tsx` awaiting `params`), and dynamic APIs require awaited/cached usage; follow Next's cacheComponents rules, not Next 14/15 habits.
- `reactCompiler: true` (`babel-plugin-react-compiler`) — write React Compiler-safe components (no hook calls in conditions, no mutating props/state, stable keys); it will transpile but misbehave otherwise.
- `next/image` only allows `https://images.unsplash.com` with `/photo-*` pathname (remotePatterns in `next.config.ts`) — any other remote image URL fails the build; user-submitted imageUrl values are shown via the shared `StudioImage` component (`src/components/studios/StudioImage.tsx`), which renders `<Image unoptimized>` and falls back to local images in `public/images/` per category. Use `StudioImage` (not raw `next/image`) for studio images, and `public/images/` for new local images.
- Dev/build run on Turbopack. Tailwind v4 is wired via a Turbopack rule in `next.config.ts`; there is no `tailwind.config`, no PostCSS config — all theme/token config goes in `src/app/globals.css` (Tailwind v4 `@theme`). Most page styling uses arbitrary-value hex classes, not theme tokens.
- Server-fetched home/studios sections are wrapped in `<Suspense>` with skeleton fallbacks; the data wrappers call `await connection()` (`src/app/page.tsx`, `src/app/studios/`) so they stream instead of prerendering — follow this streaming pattern for new server-fetched sections.

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
