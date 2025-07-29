export interface Song {
  id: string;
  songid?: number;
  song: string;
  slug: string;
  abbr?: string;
  artist?: string;
  debut?: string | null;
  last_played?: string | null;
  times_played?: number;
  last_permalink?: string;
  debut_permalink?: string;
  gap?: number;
  lyrics: string | null;
  created_at: string;
  updated_at: string;
}

export type TabType = "tab" | "chords" | "vextab";

export interface Tab {
  id: string;
  song_id: string;
  content: string;
  type: TabType;
  author_id: string;
  created_at: string;
  updated_at: string;
  favorites: number; // new
  user: {
    username: string;
    avatar_url?: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  parent_id: string | null;
  song_id: string | null;
  tab_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Setlist {
  id: string;
  name: string;
  date: string | null;
  venue: string | null;
  creator_id: string;
  created_at: string;
  updated_at: string;
}

export interface SetlistSong {
  id: string;
  setlist_id: string;
  song_id: string;
  position: number;
  created_at: string;
}

export type VideoType = "lesson" | "performance";
export type VideoPlatform = "youtube" | "vimeo";

export interface Video {
  id: string;
  song_id: string;
  type: VideoType;
  platform: VideoPlatform;
  video_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}
