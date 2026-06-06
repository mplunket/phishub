# CLAUDE.md

Guidance for AI assistants (and humans) working in the **Phishub** codebase.

## Project overview

Phishub is a collaborative, web-based platform for Phish music education and
community: guitar tabs, video lessons, setlist management, a 950+ song database
sourced from [phish.net](https://phish.net), and community discussion. It is a
Next.js 15 (App Router) app backed by Supabase (Postgres + Auth), deployed on
Vercel.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) — `next@15.5.8` |
| Language | TypeScript 5 (`strict: true`, `target: es5`) |
| UI | React 19 |
| Styling | Tailwind CSS 3 + `tailwindcss-animate`, CSS variables |
| Components | shadcn/ui (style: `default`, baseColor: `neutral`) + Radix UI primitives |
| Icons | `lucide-react` |
| Database & Auth | Supabase (`@supabase/ssr`, `@supabase/supabase-js`) |
| Feature flags | Vercel `flags` SDK |
| Analytics / tooling | `@vercel/analytics`, `@vercel/toolbar` |
| Deployment | Vercel |
| External data | phish.net API v5 (song sync only) |

## Commands

```bash
npm install          # uses legacy-peer-deps (see .npmrc) — required for React 19
npm run dev          # start dev server at http://localhost:3000
npm run build        # production build (next build)
npm run start        # serve production build

# Sync the song catalog from phish.net into Supabase (one-off / manual):
NEXT_PUBLIC_PHISHNET_API_KEY=<key> npx ts-node scripts/syncSongs.ts
```

> There is **no `lint` or `test` script** defined in `package.json`, and there
> is no test suite in the repo. `prettier` is installed as a dependency — match
> its default formatting (2-space indent, double quotes, trailing commas, semicolons).
> Type-check by running `npm run build` or `npx tsc --noEmit`.

## Environment variables

Create `.env.local` in the project root:

| Variable | Required | Used by |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | server, client, middleware, script clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | all Supabase clients |
| `SUPABASE_SERVICE_ROLE_KEY` | No | `scripts/syncSongs.ts` (falls back to anon key) |
| `NEXT_PUBLIC_PHISHNET_API_KEY` | No | `scripts/syncSongs.ts` |

## Repository layout

```
app/                         # Next.js App Router (pages, layouts, routes)
  (auth-pages)/              # Route group: sign-in, sign-up, forgot-password, smtp-message
  (dashboard)/               # Route group: protected, reset-password, setlists/, songs/[slug]/
  auth/callback/route.ts     # OAuth / email-link callback handler
  create-profile/            # First-run profile setup (username, location, avatar)
  .well-known/vercel/flags/  # Vercel flags discovery endpoint
  actions.ts                 # Server Actions (auth + content mutations)
  layout.tsx, page.tsx       # Root layout + home (landing vs. dashboard switch)
  globals.css, loading.tsx, favicon.ico
components/                   # React components
  ui/                        # shadcn/ui primitives (button, dialog, sidebar, …) — generated
  hooks/                     # use-mobile, use-current-user-name, use-current-user-image
  typography/                # inline-code, etc.
  *.tsx                      # app-specific: dashboard-shell, search-bar, song-list,
                             #   tab-viewer, landing-page, waitlist-form, nav, sidebar, …
lib/
  api.ts                     # Supabase read queries (server-side data fetching)
  utils.ts                   # cn() class-name helper (clsx + tailwind-merge)
utils/
  supabase/server.ts         # server client (cookies) — RSC & Server Actions
  supabase/client.ts         # browser client — Client Components
  supabase/middleware.ts     # session refresh + profile guard (updateSession)
  supabase/script.ts         # standalone client for Node scripts (service-role capable)
  utils.ts                   # encodedRedirect() helper
types/index.ts               # shared interfaces: Song, Tab, Comment, Setlist, Video, …
scripts/syncSongs.ts         # phish.net → Supabase song upsert
supabase/
  config.toml                # local Supabase stack config (project_id "phishub")
  migrations/                # timestamped SQL migrations (source of truth for schema)
middleware.ts                # delegates to utils/supabase/middleware updateSession
flags.ts                     # feature flags (waitlistDisabled)
next.config.ts               # wrapped with @vercel/toolbar plugin
components.json              # shadcn/ui config
```

Path alias: **`@/*` → repo root** (e.g. `@/components/ui/button`,
`@/utils/supabase/server`, `@/lib/api`, `@/types`).

## Architecture & conventions

### Data access
- **Reads** live in `lib/api.ts` as `async` functions using the **server**
  Supabase client (`@/utils/supabase/server`). Call these from React Server
  Components. Secrets stay on the server.
- **Writes / mutations** are **Server Actions** in `app/actions.ts` (`"use server"`).
  Each action: gets the user via `supabase.auth.getUser()`, guards with
  `if (!user) throw new Error("Not authenticated")`, mutates, then calls
  `revalidatePath(...)` for affected routes.
- **Client Components** ("use client") that touch Supabase use the **browser**
  client (`@/utils/supabase/client`) — e.g. `components/waitlist-form.tsx`.
- Standalone Node scripts use `@/utils/supabase/script` (prefers
  `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS).

### Auth & routing
- `middleware.ts` runs on (almost) every request → `updateSession`, which:
  1. refreshes the Supabase session cookie, and
  2. **guards profile completion** — authenticated users without a `profiles`
     row are redirected to `/create-profile` (except on `/api`, `/auth`,
     `/sign-in`, `/sign-up`, `/create-profile`, `/public`, `/_next`).
- The matcher in `middleware.ts` excludes static assets and image files.
- Auth Server Actions (`signUpAction`, `signInAction`, `forgotPasswordAction`,
  `resetPasswordAction`, `signOutAction`) use `encodedRedirect(type, path, msg)`
  to surface success/error messages as query params, rendered via
  `components/form-message.tsx`.
- **Route groups** `(auth-pages)` and `(dashboard)` apply distinct layouts
  without changing URL paths.
- `app/page.tsx` renders `LandingPage` for anonymous visitors and
  `DashboardHome` for authenticated users.

### UI
- Use shadcn/ui primitives from `components/ui/` and compose with the `cn()`
  helper from `@/lib/utils` for conditional class names. Don't hand-roll
  components that already exist there.
- Theming via `next-themes` (`theme-switcher.tsx`); Tailwind uses CSS variables.
- Mobile/responsive handled with `components/hooks/use-mobile.ts`, `mobile-nav`,
  `drawer` (`vaul`), and the shadcn `sidebar`.

### Feature flags
- `flags.ts` defines flags with the Vercel `flags/next` SDK. `waitlistDisabled`
  toggles between waitlist mode and the full app (default `false`; override in
  the Vercel dashboard / via targeting). Flags are discoverable at
  `app/.well-known/vercel/flags/route.ts`.

## Database

Schema is defined by timestamped SQL files in `supabase/migrations/` — treat
these as the **source of truth** and add a new timestamped migration for any
schema change rather than editing past ones.

Core tables (RLS enabled on all; public `SELECT`, authenticated/owner writes):

| Table | Notes |
|---|---|
| `songs` | phish.net-backed. Key cols: `song` (title), `slug` (unique), `songid` (unique, phish.net id), `abbr`, `artist`, `debut`, `last_played`, `times_played`, `gap`, `lyrics`. GIN trigram/`tsvector` search indexes. |
| `tabs` | `song_id`→songs, `author_id`→auth.users, `content`, `type`. |
| `comments` | Self-referential (`parent_id`) for threads; XOR check: exactly one of `song_id` / `tab_id`. |
| `setlists` + `setlist_songs` | Many-to-many with `position` ordering (`UNIQUE(setlist_id, position)`). |
| `videos` | `song_id`→songs, `type` (`lesson`/`performance`), `platform` (`youtube`/`vimeo`), `video_id`. |
| `favorites` | Links users to tabs; counts aggregated in `getTabsBySongId`. |
| `profiles` | `user_id`→auth.users PK, unique `username`, `avatar_url`, `country/state/city`. Required before accessing the app. |
| `waitlist` | `email` (unique), `source`, `referrer_url`. |

`updated_at` columns are maintained by the `update_updated_at_column()` trigger.

> ⚠️ **Schema history to be aware of:** the `songs` table was migrated from an
> original shape (`title`, `composer`, `debut_date`, `history`) to the phish.net
> shape (`song`, `slug`, `songid`, …) in
> `20250626121000_update_songs_table_for_phishnet.sql`. The canonical shape is
> the one in `types/index.ts` and the `syncSongs.ts` mapping — `song` (title),
> `slug`, `artist`, `debut`, `lyrics`, etc. When touching song code, use these
> current columns; don't reintroduce the dropped legacy ones.

### Working with Supabase
- Local stack config lives in `supabase/config.toml` (`project_id = "phishub"`,
  API on `:54321`, DB on `:54322`). Use the `supabase` CLI (dev dependency) for
  local development and migrations.
- After schema changes, keep `types/index.ts` in sync with the new columns.

## Conventions checklist for changes

- Put server-side reads in `lib/api.ts`; mutations as Server Actions in
  `app/actions.ts`; always `revalidatePath` after a write.
- Pick the right Supabase client: server (RSC/actions), client (browser
  components), script (Node scripts). Never expose the service-role key to the
  browser.
- Reuse `components/ui/*` and `cn()`; follow Prettier defaults.
- Add a new timestamped migration for schema changes and update `types/index.ts`.
- Use the `@/` path alias for imports.
- Don't commit secrets; `.env*.local` and `.env` are gitignored.

## Git workflow

- Default branch: `main`. Do work on a feature branch and open a PR; **do not
  push directly to `main`** and don't create PRs unless asked.
- Deployment is via Vercel on merge.
