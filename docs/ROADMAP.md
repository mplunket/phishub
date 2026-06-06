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

## Phase 1 — Song browsing & real search ✅ (done)

5. **`/songs` index page** ✅ — paginated alphabetical browse via
   `getSongsPage()`, plus a server-rendered `?q=` search results view.
6. **Search (both approaches)** ✅ — `SearchBar` keeps the client typeahead and
   now submits (Enter + button) to `/songs?q=`, which renders `searchSongs()`
   results. Dead `console.log` button removed. Added a Songs sidebar link.

## Phase 2 — Tabs (contribute + view) ✅ (done)

7. **Reconcile tab-type drift** ✅ — migration
   `20260606120000_reconcile_tab_type_check.sql` updates the CHECK to
   `('tab','chords','vextab')` to match `TabType`. **Must be applied to the DB.**
8. **Tab creation UI** ✅ — `AddTabDialog` on the song page (auth-gated), wired
   to `createTab` (now revalidates by slug, the actual route key).
9. **`/tabs` index page** ✅ — recent tabs with song + author via
   `getRecentTabs()`.
10. **(Deferred) richer `TabViewer`** — `vextab`/chord rendering instead of
    `<pre>`; not done yet.

## Phase 3 — Favorites ✅ (done)

11. **Favorite toggle action** ✅ — `toggleFavorite()` server action
    (insert/delete on `favorites`). DELETE RLS policy already existed.
12. **Real `userFavoriteTabIds`** ✅ — `getUserFavoriteTabIds()` feeds the song
    page; `FavoriteButton` does an optimistic toggle on the selected tab.
13. **`/favorites` page** — list the signed-in user's favorited tabs; not done
    yet.

## Phase 4 — Discussion / comments ✅ (done)

14. **Comment submit form** ✅ — `Discussion` component posts via
    `createComment` (now revalidates by slug).
15. **Author display + threading** ✅ — `getCommentsBySongId` joins author
    profiles in code (no FK to embed); `Discussion` renders authors, one level
    of nested replies, and per-comment reply forms.

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
