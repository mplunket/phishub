export interface Song {
  id: string;
  title: string;
  composer: string[];
  debut_date: string | null;
  history: string | null;
  lyrics: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tab {
  id: string;
  song_id: string;
  content: string;
  type: "tab" | "chord_chart" | "sheet_music";
  author_id: string;
  created_at: string;
  updated_at: string;
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
