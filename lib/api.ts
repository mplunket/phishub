import { Song, Tab, Setlist, Comment, Video } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getSongs() {
  const supabase = await createClient();
  const { data: songs, error } = await supabase
    .from("songs")
    .select("*")
    .order("song", { ascending: true });
  if (error) throw error;
  return songs as Song[];
}

export async function getSongsPage(page = 1, pageSize = 50) {
  const supabase = await createClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const {
    data: songs,
    count,
    error,
  } = await supabase
    .from("songs")
    .select("*", { count: "exact" })
    .order("song", { ascending: true })
    .range(from, to);
  if (error) throw error;
  return { songs: (songs ?? []) as Song[], total: count ?? 0 };
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
    .or(`song.ilike.%${query}%, lyrics.ilike.%${query}%`)
    .order("times_played", { ascending: false });
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
    .select(
      `
      *,
      user:profiles!author_id (
        username,
        avatar_url
      ),
      favorites:favorites!tab_id (
        id
      )
    `
    )
    .eq("song_id", songId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message || "Failed to fetch tabs");
  // Aggregate favorite counts
  const tabsWithFavorites = (tabs as any[]).map((tab) => ({
    ...tab,
    favorites: tab.favorites ? tab.favorites.length : 0,
  }));
  return tabsWithFavorites as Tab[];
}

export type CommentAuthor = { username: string; avatar_url?: string };
export type CommentWithAuthor = Comment & { author?: CommentAuthor };

export async function getCommentsBySongId(
  songId: string
): Promise<CommentWithAuthor[]> {
  const supabase = await createClient();
  const { data: comments, error } = await supabase
    .from("comments")
    .select("*")
    .eq("song_id", songId)
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = (comments ?? []) as Comment[];
  // comments.author_id references auth.users, not profiles, so PostgREST
  // can't embed the profile directly — fetch and join them in code.
  const authorIds = rows
    .map((c) => c.author_id)
    .filter((id, i, arr) => arr.indexOf(id) === i);
  let profilesById: Record<string, CommentAuthor> = {};
  if (authorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_url")
      .in("user_id", authorIds);
    profilesById = Object.fromEntries(
      (profiles ?? []).map((p) => [
        p.user_id as string,
        {
          username: p.username as string,
          avatar_url: (p.avatar_url as string) ?? undefined,
        },
      ])
    );
  }

  return rows.map((c) => ({ ...c, author: profilesById[c.author_id] }));
}

export async function getUserFavoriteTabIds(
  tabIds: string[]
): Promise<string[]> {
  if (tabIds.length === 0) return [];
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("favorites")
    .select("tab_id")
    .eq("user_id", user.id)
    .in("tab_id", tabIds);
  if (error) throw error;
  return (data ?? []).map((r) => r.tab_id as string);
}

export type RecentTab = Tab & { song: { song: string; slug: string } };

export async function getRecentTabs(limit = 50): Promise<RecentTab[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tabs")
    .select(
      `
      *,
      song:songs!song_id (song, slug),
      user:profiles!author_id (username, avatar_url)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as RecentTab[];
}

export async function getVideosBySongId(songId: string) {
  const supabase = await createClient();
  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .eq("song_id", songId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return videos as Video[];
}
