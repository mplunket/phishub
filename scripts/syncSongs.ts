// scripts/syncSongs.ts
import { createScriptClient } from "../utils/supabase/script";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const PHISHNET_API_URL = "https://api.phish.net/v5/songs.json";

async function fetchPhishNetSongs() {
  const apiKey = process.env.NEXT_PUBLIC_PHISHNET_API_KEY;
  const res = await fetch(PHISHNET_API_URL + `?apikey=${apiKey}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  const json = (await res.json()) as { data: any[] };
  return json.data || [];
}

async function syncSongs() {
  const supabase = createScriptClient();
  const phishSongs = await fetchPhishNetSongs();

  for (const song of phishSongs) {
    // Upsert by songid
    const { error } = await supabase.from("songs").upsert(
      {
        songid: song.songid,
        slug: song.slug,
        song: song.song,
        abbr: song.abbr,
        artist: song.artist,
        debut: song.debut || null,
        last_played: song.last_played || null,
        times_played: song.times_played,
        last_permalink: song.last_permalink,
        debut_permalink: song.debut_permalink,
        gap: song.gap,
      },
      { onConflict: "songid" }
    );
    if (error) {
      console.error(`Error upserting songid ${song.songid}:`, error.message);
    }
  }
  console.log(`Synced ${phishSongs.length} songs from phish.net.`);
}

syncSongs().catch((err) => {
  console.error("Sync failed:", err);
  process.exit(1);
});
