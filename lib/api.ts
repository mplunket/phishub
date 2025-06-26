import { Song, Tab, Setlist, Comment } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getSongs() {
  const supabase = await createClient();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return songs as Song[];
}

export async function getSongBySlug(slug: string) {
  const supabase = await createClient();
  const { data: song, error } = await supabase
    .from("songs")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return song as Song;
}

export async function getSetlists(limit = 10) {
  const supabase = await createClient();
  const { data: setlists, error } = await supabase
    .from("setlists")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return setlists as Setlist[];
}

export async function getSetlistById(id: string) {
  const supabase = await createClient();
  const { data: setlist, error } = await supabase
    .from("setlists")
    .select(
      `
      *,
      setlist_songs!inner (
        *,
        songs!inner (*)
      )
    `
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return setlist as Setlist & { setlist_songs: Array<{ songs: Song }> };
}

export async function searchSongs(query: string) {
  const supabase = await createClient();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .or(`title.ilike.%${query}%, lyrics.ilike.%${query}%`)
    .order("title", { ascending: true });
  if (error) throw error;
  return songs as Song[];
}

export async function getComments(type: "song" | "tab", id: string) {
  const supabase = await createClient();
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq(type === "song" ? "song_id" : "tab_id", id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return comments as Comment[];
}

export async function getTabsBySongId(songId: string) {
  const supabase = await createClient();
  const { data: tabs, error } = await supabase
    .from("tabs")
    .select("*")
    .eq("song_id", songId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return tabs as Tab[];
}

export async function getCommentsBySongId(songId: string) {
  const supabase = await createClient();
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("song_id", songId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return comments as Comment[];
}
