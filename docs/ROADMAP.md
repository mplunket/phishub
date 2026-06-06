# Phishub roadmap

Status of the app as scaffolded, and a sequenced plan to finish it. The read
side and presentational components are largely built; the write side and
several routes are stubs. Server actions `createTab`, `createComment`, and
`createSong` exist but nothing in the UI calls them. The `favorites` table,
RLS, and star UI exist, but there's no toggle action and `userFavoriteTabIds`
is hardcoded `[]`. Sidebar links point at `/tabs`, `/videos`, `/favorites`,
and the setlist list links to `/setlists/[id]` — none of those routes exist
yet.

**Routes that exist today:** `/` (landing vs. dashboard), `/sign-in`,
`/sign-up`, `/forgot-password`, `/reset-password`, `/protected` (starter
leftover), `/setlists`, `/setlists/new`, `/songs/[slug]`, `/create-profile`,
`/auth/callback`, flags endpoint.

## Suggested order

- **P0:** Phase 0 → 1 → 2 → 3 → 4 (core contributor loop: browse → view → add
  tab → favorite → discuss).
- **P1:** Phase 5 → 6 → 8.
- **P2:** Phase 7 → 9 → 10.

A natural first milestone is Phases 0–1: kill the known bugs and make song
discovery work, which everything else hangs off of.

---

## Phase 0 — Fix existing bugs ✅ (done)

Real defects in scaffolded code, not new features.

1. **Password-reset redirect 404** — `forgotPasswordAction` (`app/actions.ts`)
   pointed at `/auth/callback?redirect_to=/protected/reset-password`, but the
   page lives at `/reset-password`. Fixed.
2. **Server Component event handler** —
   `app/(dashboard)/setlists/new/page.tsx` is an `async` Server Component but
   rendered `<Button onClick={() => window.history.back()}>`, which throws.
   Replaced the Cancel button with a `Link` to `/setlists`.
3. **Removed `/protected`** — Supabase-starter boilerplate dumping raw user
   JSON; deleted, along with the related commented redirect logic in
   `utils/supabase/middleware.ts`.
4. **`resetPasswordAction` guards** — added `return` to the validation
   redirects for clarity/safety.

## Phase 1 — Song browsing & real search

5. **`/songs` index page** — `SongList` + `getSongs()` exist but no page uses
   them. Build a browse page (alphabetical, paginated/virtualized — 950+ rows).
6. **Search (both approaches)** — keep the client typeahead dropdown in
   `SearchBar` for quick jumps, AND build a server-rendered `/songs?q=` results
   page using `searchSongs()` (title + lyrics) on Enter. Remove the current
   dead `console.log` search button behavior.

## Phase 2 — Tabs (contribute + view)

7. **Reconcile tab-type drift** — `types/index.ts` says
   `TabType = "tab" | "chords" | "vextab"`, but the DB CHECK is
   `('tab','chord_chart','sheet_music')`. Pick a canonical set, add a migration
   to update the constraint, and align the type + `createTab`.
8. **Tab creation UI** — "Add Tab" form on the song page (and/or `/tabs/new`)
   wired to the existing `createTab` action.
9. **`/tabs` index page** — list recent/all tabs with song + author.
10. **(Optional) richer `TabViewer`** — `vextab`/chord rendering instead of
    `<pre>`.

## Phase 3 — Favorites

11. **Favorite toggle action** — new server action (insert/delete on
    `favorites`) + a DELETE RLS policy if missing.
12. **Real `userFavoriteTabIds`** — query the current user's favorites in
    `app/(dashboard)/songs/[slug]/page.tsx` and pass them down (replacing the
    hardcoded `[]`).
13. **`/favorites` page** — list the signed-in user's favorited tabs.

## Phase 4 — Discussion / comments

14. **Comment submit form** — discussion tab is read-only; wire a form to
    `createComment`.
15. **Author display + threading** — comments render no author and ignore
    `parent_id`. Add a `profiles` join (like `getTabsBySongId`) and render
    nested replies.

## Phase 5 — Videos

16. **Render videos** — `getVideosBySongId` is fetched but the Videos tab is an
    empty `<h2>`. Build a YouTube/Vimeo embed component; split lessons vs.
    performances.
17. **Video submission** — add a creator/owner column via migration (the table
    comment flags this), an action, and UI. `/videos` index page.

## Phase 6 — Setlists completion

18. **`/setlists/[id]` detail page** — `getSetlistById` exists; the list links
    here but the route doesn't. Build it (ordered songs).
19. **Edit / delete / reorder** — owner mutations + DELETE RLS; drag-to-reorder
    against the `position` column.

## Phase 7 — Profiles & auth polish

20. **Avatars storage bucket** — `create-profile` uploads to an `avatars`
    bucket that must exist. Add it as a Supabase setup step/migration and
    document it.
21. **Profile view/edit pages** — none exist; add `/u/[username]` (public) and
    a self-edit page.
22. **(Optional) OAuth** — `create-profile` already handles a social avatar,
    but no provider sign-in is wired.

## Phase 8 — Dashboard home

23. Replace the "Add your dashboard widgets here" placeholder with real widgets
    (recent tabs, your favorites, popular songs, recent setlists).

## Phase 9 — Data, schema & RLS hardening

24. **Run/seed data** — execute the phish.net `syncSongs` sync; seed videos.
25. **RLS gaps** — add DELETE policies (favorites, comments, setlists/
    setlist_songs) and review the unusual `songs` UPDATE policy.
26. **(Optional) generated types** — replace hand-maintained `types/index.ts`
    with Supabase-generated types to prevent future drift.

## Phase 10 — Tooling & robustness

27. Add ESLint + a test setup (neither exists today), plus `loading.tsx`/
    `not-found.tsx`/error boundaries for the new routes.
