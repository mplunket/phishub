import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Song {
  id: number;
  slug: string;
  name: string;
  artist: string;
  created_at: string;
}

export interface Tab {
  id: number;
  song_id: number;
  instrument: 'guitar' | 'bass' | 'piano' | 'drums';
  author: string;
  content: string;
  created_at: string;
}

export interface Video {
  id: number;
  song_id: number;
  type: 'performance' | 'lesson';
  platform: 'youtube' | 'vimeo';
  video_id: string;
  created_at: string;
}

export async function getSongs(): Promise<Song[]> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
  if (error) throw error
  return data
}

export async function getSong(slug: string): Promise<Song | null> {
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}

export async function getTabs(songId: number): Promise<Tab[]> {
  const { data, error } = await supabase
    .from('tabs')
    .select('*')
    .eq('song_id', songId)
  if (error) throw error
  return data
}

export async function getTab(id: number): Promise<Tab | null> {
  const { data, error } = await supabase
    .from('tabs')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getVideos(songId: number): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('song_id', songId)
  if (error) throw error
  return data
}

export async function searchSongs(query: string): Promise<Song[]> {
    const { data, error } = await supabase
      .from('songs')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name')
      .limit(5)
    if (error) throw error
    return data
  }