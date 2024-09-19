'use server'

import { createClient } from "@/utils/supabase/server"
import { Tables } from '@/lib/database.types'

type Song = Tables<'songs'>

export async function createSetlist(userId: string, name: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('setlists')
    .insert({ created_by: userId, name })
    .select()

  if (error) {
    console.error('Error creating setlist:', error)
    throw new Error('Failed to create setlist')
  }

  return data[0]
}

export async function addContentToSetlist(setlistId: number, userId: string, contentId: number, order: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('setlist_contents')
    .insert({ setlist_id: setlistId, content_id: contentId, created_by: userId, order })

  if (error) {
    console.error('Error adding content to setlist:', error)
    throw new Error('Failed to add content to setlist')
  }

  return data
}

export async function getContentByType(songId: number, contentType: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('song_id', songId)
    .eq('content_type', contentType)

  if (error) {
    console.error('Error fetching content:', error)
    throw new Error('Failed to fetch content')
  }

  return data
}

export async function getContent(songId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('song_id', songId)

  if (error) {
    console.error('Error fetching content:', error)
    throw new Error('Failed to fetch content')
  }

  return data
}

export async function getSongs() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching songs:', error)
    throw new Error('Failed to fetch songs')
  }

  return data
}

export async function getSongBySlug(slug: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .eq('slug', slug)
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching song:', error)
    throw new Error('Failed to fetch song')
  }

  return data
}

export async function searchSongs(query: string): Promise<Song[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('songs')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('name')
    .limit(10)

  if (error) {
    console.error('Error searching songs:', error)
    throw new Error('Failed to search songs')
  }

  return data
}

export async function logout() {
  const supabase = createClient()
  await supabase.auth.signOut()
}