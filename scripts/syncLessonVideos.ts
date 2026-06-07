// scripts/syncLessonVideos.ts
//
// Enumerate a YouTube channel's uploads and link instructional ("...Guitar
// Lesson") videos to the matching song in Supabase.
//
// Usage:
//   YOUTUBE_API_KEY=<key> npx ts-node scripts/syncLessonVideos.ts            # insert
//   YOUTUBE_API_KEY=<key> npx ts-node scripts/syncLessonVideos.ts --dry-run  # preview only
//
// Requires (in .env.local or the environment):
//   YOUTUBE_API_KEY               YouTube Data API v3 key
//   NEXT_PUBLIC_SUPABASE_URL      Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY     service role (bypasses RLS for the upsert)
//                                 falls back to NEXT_PUBLIC_SUPABASE_ANON_KEY,
//                                 which will fail the insert under RLS.
//
// Matching is intentionally conservative ("auto-link confident only"): a video
// is linked only when the song name parsed from its title is an exact match
// (after normalization) to a song in the DB. Unmatched lesson titles are
// printed so they can be reconciled by hand.

import { createScriptClient } from "../utils/supabase/script";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID =
  process.env.PHISH_LESSONS_CHANNEL_ID || "UCU2KgjTb0rQ4d3_ei1boiGw";
const DRY_RUN = process.argv.includes("--dry-run");

type YtVideo = { videoId: string; title: string };

async function getUploadsPlaylistId(): Promise<string> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`channels.list failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as any;
  const uploads =
    json.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error("Could not find uploads playlist for channel");
  return uploads;
}

async function getAllVideos(playlistId: string): Promise<YtVideo[]> {
  const videos: YtVideo[] = [];
  let pageToken = "";
  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : "");
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(
        `playlistItems.list failed: ${res.status} ${await res.text()}`
      );
    }
    const json = (await res.json()) as any;
    for (const item of json.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title;
      if (videoId && title) videos.push({ videoId, title });
    }
    pageToken = json.nextPageToken ?? "";
  } while (pageToken);
  return videos;
}

// Lowercase, strip punctuation, collapse whitespace.
function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Pull the song name out of a title like
// "PHISH - Reba - Guitar Lesson (updated w/tabs)".
function extractSongTitle(title: string): string {
  let t = title;
  t = t.replace(/^\s*phish\s*[-–—:]\s*/i, ""); // leading "PHISH - "
  t = t.replace(/\([^)]*\)/g, ""); // (parentheticals)
  t = t.replace(/[-–—:]?\s*guitar\s+lesson.*$/i, ""); // trailing "- Guitar Lesson ..."
  t = t.replace(/[-–—:]?\s*lesson.*$/i, ""); // or just "- Lesson ..."
  return t.trim();
}

async function main() {
  if (!API_KEY) throw new Error("YOUTUBE_API_KEY is required");
  const supabase = createScriptClient();

  const { data: songs, error } = await supabase
    .from("songs")
    .select("id, song, slug");
  if (error) throw error;
  const songList = (songs ?? []) as {
    id: string;
    song: string;
    slug: string;
  }[];

  const byTitle = new Map<string, (typeof songList)[number]>();
  for (const s of songList) byTitle.set(normalize(s.song), s);

  const uploads = await getUploadsPlaylistId();
  const videos = await getAllVideos(uploads);
  console.log(`Found ${videos.length} videos on channel ${CHANNEL_ID}.`);

  let matched = 0;
  let inserted = 0;
  const unmatched: string[] = [];

  for (const v of videos) {
    if (!/lesson/i.test(v.title)) continue; // lessons only
    const candidate = normalize(extractSongTitle(v.title));
    const song = byTitle.get(candidate);
    if (!song) {
      unmatched.push(v.title);
      continue;
    }
    matched++;
    if (DRY_RUN) {
      console.log(`MATCH  ${song.slug.padEnd(28)} <- "${v.title}" [${v.videoId}]`);
      continue;
    }

    // Skip if this video is already linked to the song.
    const { data: existing } = await supabase
      .from("videos")
      .select("id")
      .eq("song_id", song.id)
      .eq("video_id", v.videoId)
      .maybeSingle();
    if (existing) continue;

    const { error: insErr } = await supabase.from("videos").insert({
      song_id: song.id,
      type: "lesson",
      platform: "youtube",
      video_id: v.videoId,
      name: v.title,
    });
    if (insErr) {
      console.error(`Insert failed for "${v.title}": ${insErr.message}`);
      continue;
    }
    inserted++;
  }

  console.log(
    `\nMatched ${matched} lesson videos; inserted ${inserted} new${
      DRY_RUN ? " (dry run — nothing written)" : ""
    }.`
  );
  if (unmatched.length) {
    console.log(`\nUnmatched lesson titles (${unmatched.length}):`);
    for (const t of unmatched) console.log(`  - ${t}`);
  }
}

main().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
