// scripts/syncLyrics.ts
//
// Scrapes song lyrics from phish.net song pages and upserts them into the
// `songs.lyrics` column in Supabase.
//
// phish.net's v5 API does NOT expose lyrics (see scripts/syncSongs.ts — the
// songs.json payload has no lyrics field), so we read them from the public
// song lyrics pages at https://phish.net/song/<slug>/lyrics.
//
// ⚠️ Copyright: song lyrics are owned by their respective rights holders.
// phish.net displays them under its own licensing. Only run this against
// content you have the right to use, and honour the project's content policy
// (app/content-policy/page.tsx).
//
// Usage (locally):
//   DRY_RUN=true npx tsx scripts/syncLyrics.ts          // parse + log, no writes
//   LIMIT=5 DRY_RUN=true npx tsx scripts/syncLyrics.ts  // try the first 5 songs
//   npx tsx scripts/syncLyrics.ts                        // full run, writes lyrics
//
// In CI it is driven by .github/workflows/sync-lyrics.yml via env vars.
//
// Environment variables:
//   NEXT_PUBLIC_SUPABASE_URL       (required)
//   SUPABASE_SERVICE_ROLE_KEY      (required for writes — bypasses RLS)
//   DRY_RUN        "true" => parse and log only, never write   (default "false")
//   FORCE          "true" => re-scrape songs that already have lyrics (default "false")
//   LIMIT          max number of songs to process this run      (default: all)
//   DELAY_MS       delay between requests, be polite             (default 1500)
//   LYRICS_SELECTOR  comma-separated CSS selectors to try first  (optional)

import * as cheerio from "cheerio";
import { createScriptClient } from "../utils/supabase/script";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const DRY_RUN = (process.env.DRY_RUN ?? "false").toLowerCase() === "true";
const FORCE = (process.env.FORCE ?? "false").toLowerCase() === "true";
const LIMIT = process.env.LIMIT ? parseInt(process.env.LIMIT, 10) : Infinity;
const DELAY_MS = process.env.DELAY_MS ? parseInt(process.env.DELAY_MS, 10) : 1500;

// Candidate selectors for the lyrics block, tried in order. On phish.net the
// lyrics live in <blockquote class="bq"> on the /song/<slug>/lyrics page.
// Override via the LYRICS_SELECTOR env var (comma-separated) if the markup
// changes; if none match we fall back to a heuristic scan.
const SELECTORS = (
  process.env.LYRICS_SELECTOR ||
  "blockquote.bq,blockquote,#song-lyrics,.song-lyrics,[itemprop='lyrics'],.lyrics,#lyrics"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const BASE_URL = "https://phish.net/song";
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// A plausible lyrics block has several lines and a sane length. Tune if needed.
const MIN_LENGTH = 40;
const MIN_LINES = 3;
const MAX_LENGTH = 20000;

// Sentinel marking a real line break (<br> or block boundary). We insert it
// before collapsing whitespace, so genuine breaks survive while the source's
// insignificant newlines/indentation (present only for HTML readability) are
// flattened away. phish.net renders one <br> per line and <br><br> per stanza.
const BR = "@@LYRIC_BR@@";

interface SongRow {
  id: string;
  song: string;
  slug: string;
  lyrics: string | null;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Convert a cheerio selection into plain text, preserving real line breaks. */
function blockToText(
  $: cheerio.CheerioAPI,
  $el: cheerio.Cheerio<any>
): string {
  const clone = $el.clone();
  // Drop anything that clearly isn't lyrics.
  clone.find("script,style,nav,header,footer,form,button,iframe,noscript").remove();
  clone.find("br").replaceWith(BR);
  // Block-level elements also imply a line break at their boundary.
  clone.find("p,div,h1,h2,h3,h4,h5,h6,li,tr,blockquote").each((_, node) => {
    $(node).append(BR);
  });
  return normalize(clone.text());
}

function normalize(text: string): string {
  return text
    .replace(/\s+/g, " ") // collapse all insignificant HTML whitespace
    .split(BR) // split on real line breaks only
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // cap stanza gaps at a single blank line
    .trim();
}

function looksLikeLyrics(text: string): boolean {
  if (text.length < MIN_LENGTH || text.length > MAX_LENGTH) return false;
  if (text.split("\n").length < MIN_LINES) return false;
  return true;
}

/** Extract lyrics text from a phish.net song lyrics page's HTML. */
function extractLyrics(html: string): string | null {
  const $ = cheerio.load(html);

  // 1) Try the configured/known selectors first.
  for (const sel of SELECTORS) {
    const el = $(sel).first();
    if (el.length) {
      const text = blockToText($, el);
      if (looksLikeLyrics(text)) return text;
    }
  }

  // 2) Heuristic fallback: scan candidate containers and pick the one whose
  // text reads most like lyrics — many lines, few links. Scoring by
  // (non-empty lines − 2×links) favours the clean lyrics block over page
  // chrome (nav/footer/related links) and over the whole-page wrapper.
  let best: { text: string; score: number } | null = null;
  $("div,section,article,pre,td,main").each((_, node) => {
    const $node = $(node);
    const linkCount = $node.find("a").length;
    const text = blockToText($, $node);
    if (!looksLikeLyrics(text)) return;
    const lines = text.split("\n").filter((l) => l.trim()).length;
    if (lines < MIN_LINES) return;
    const score = lines - 2 * linkCount;
    if (!best || score > best.score) best = { text, score };
  });

  return best && (best as { score: number }).score > 0
    ? (best as { text: string }).text
    : null;
}

async function fetchSongPage(slug: string): Promise<string | null> {
  const url = `${BASE_URL}/${slug}/lyrics`;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
      if (res.ok) return await res.text();
      if (res.status === 404) {
        console.warn(`  [404] no page for slug "${slug}"`);
        return null;
      }
      if (res.status === 403) {
        // Likely a Cloudflare challenge — retries won't help much.
        console.warn(`  [403] blocked for slug "${slug}" (Cloudflare?)`);
        return null;
      }
      console.warn(`  [${res.status}] attempt ${attempt} for "${slug}"`);
    } catch (err) {
      console.warn(
        `  [network] attempt ${attempt} for "${slug}": ${(err as Error).message}`
      );
    }
    if (attempt < maxAttempts) await sleep(DELAY_MS * 2 * attempt);
  }
  return null;
}

async function syncLyrics() {
  const supabase = createScriptClient();

  let query = supabase
    .from("songs")
    .select("id, song, slug, lyrics")
    .order("song", { ascending: true });
  if (!FORCE) {
    // Only songs missing lyrics. (Empty-string lyrics are treated as missing.)
    query = query.or("lyrics.is.null,lyrics.eq.");
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load songs: ${error.message}`);

  const songs = (data as SongRow[]).filter((s) => s.slug);
  const target = songs.slice(0, LIMIT === Infinity ? songs.length : LIMIT);

  console.log(
    `${DRY_RUN ? "[DRY RUN] " : ""}Processing ${target.length} song(s)` +
      `${FORCE ? " (force re-scrape)" : " missing lyrics"}.`
  );

  let updated = 0;
  let notFound = 0;
  let consecutiveBlocked = 0;

  for (let i = 0; i < target.length; i++) {
    const song = target[i];
    process.stdout.write(`(${i + 1}/${target.length}) ${song.song} … `);
    const html = await fetchSongPage(song.slug);

    if (html === null) {
      consecutiveBlocked++;
      notFound++;
      // If phish.net is blocking everything, fail fast with a clear message.
      if (consecutiveBlocked >= 10) {
        throw new Error(
          "10 consecutive fetch failures — phish.net is likely blocking " +
            "this runner (Cloudflare). Aborting. Try a different runner/IP, " +
            "increase DELAY_MS, or confirm the site is reachable."
        );
      }
      console.log("skipped (no page)");
      await sleep(DELAY_MS);
      continue;
    }
    consecutiveBlocked = 0;

    const lyrics = extractLyrics(html);
    if (!lyrics) {
      notFound++;
      console.log("no lyrics found on page");
      await sleep(DELAY_MS);
      continue;
    }

    if (DRY_RUN) {
      const preview = lyrics.split("\n").slice(0, 2).join(" / ");
      console.log(`OK (${lyrics.length} chars) — "${preview}…"`);
    } else {
      const { error: upErr } = await supabase
        .from("songs")
        .update({ lyrics })
        .eq("id", song.id);
      if (upErr) {
        console.log(`DB error: ${upErr.message}`);
      } else {
        updated++;
        console.log(`saved (${lyrics.length} chars)`);
      }
    }

    await sleep(DELAY_MS);
  }

  console.log(
    `\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${
      DRY_RUN ? target.length - notFound : updated
    } song(s); ${notFound} without usable lyrics.`
  );
}

syncLyrics().catch((err) => {
  console.error("Lyrics sync failed:", err);
  process.exit(1);
});
