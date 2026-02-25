# Phishub

A collaborative, web-based platform for Phish music education and community engagement. Phishub is the go-to resource hub for guitar tabs, video lessons, setlist management, and community discussion around the music of Phish.

## Overview

Phishub provides a rich set of tools for Phish fans and musicians:

- **Song & Tab Library** — Browse and interact with guitar tabs, chord charts, and notation for 950+ Phish songs sourced from [phish.net](https://phish.net)
- **Video Integration** — Watch embedded lessons and live performances alongside tabs
- **Setlist Management** — Create, organize, and share custom setlists for practice or shows
- **Community Content** — Submit tabs, post comments, and collaborate with fellow fans
- **Song Database** — Detailed song profiles including debut dates, composer credits, performance history, and play counts
- **Authentication** — Secure user accounts with profile creation, password management, and session persistence

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| UI Library | [React 19](https://react.dev) |
| Styling | [Tailwind CSS 3](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Icons | [lucide-react](https://lucide.dev) |
| Database & Auth | [Supabase](https://supabase.com) (PostgreSQL) |
| Deployment | [Vercel](https://vercel.com) |
| External API | [phish.net API v5](https://phish.net/api) |

## Architecture

```
phishub/
├── app/                        # Next.js App Router pages & layouts
│   ├── (auth-pages)/           # Sign-in, sign-up, forgot/reset password
│   ├── (dashboard)/            # Protected routes: songs, setlists, profile
│   │   ├── songs/[slug]/       # Individual song detail page
│   │   └── setlists/           # Setlist listing and creation
│   ├── auth/callback/          # OAuth callback handler
│   ├── create-profile/         # New user profile setup
│   └── page.tsx                # Landing/home page
├── components/                 # Reusable React components
│   ├── ui/                     # shadcn/ui primitives (25+ components)
│   ├── dashboard-shell.tsx     # App shell with sidebar navigation
│   ├── search-bar.tsx          # Real-time song search with autocomplete
│   ├── song-list.tsx           # Song browsing component
│   ├── tab-viewer.tsx          # Tab display and interaction
│   └── landing-page.tsx        # Marketing landing page
├── lib/
│   └── api.ts                  # Supabase data-fetching functions
├── utils/supabase/             # Supabase client configuration (server, client, middleware)
├── types/index.ts              # Shared TypeScript interfaces
├── scripts/syncSongs.ts        # CLI script to sync songs from phish.net API
├── middleware.ts               # Auth session refresh middleware
└── flags.ts                    # Feature flags (e.g. waitlist toggle)
```

### Key Patterns

- **React Server Components** — Data fetching happens server-side via `lib/api.ts` using the Supabase server client, keeping secrets off the client
- **Server Actions** — Auth operations (`signIn`, `signUp`, `signOut`, `resetPassword`) and content creation (`createTab`, `createSetlist`, `createComment`) are handled via Next.js Server Actions in `app/actions.ts`
- **Middleware Auth** — `middleware.ts` runs on every request to refresh the Supabase session cookie, ensuring protected routes are always up to date
- **Route Groups** — `(auth-pages)` and `(dashboard)` route groups apply separate layouts without affecting URL structure
- **Feature Flags** — `flags.ts` controls the `waitlistDisabled` flag to toggle between waitlist mode and full app access

### Data Models

| Model | Description |
|---|---|
| `Song` | Phish song with slug, composer, debut date, lyrics, play count |
| `Tab` | Guitar tab or chord chart linked to a song, with author and favorites |
| `Comment` | Threaded comment on a song or tab |
| `Setlist` | User-curated collection of songs |
| `Video` | Embedded YouTube/Vimeo lesson or performance linked to a song |

## Local Development

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mplunket/phishub.git
   cd phishub
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   ```

   Both values are available in your [Supabase project API settings](https://app.supabase.com/project/_/settings/api).

4. (Optional) Sync songs from the phish.net API:

   ```bash
   NEXT_PUBLIC_PHISHNET_API_KEY=<your-api-key> npx ts-node scripts/syncSongs.ts
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous API key |
| `NEXT_PUBLIC_PHISHNET_API_KEY` | No | phish.net API key for song sync script |
