"use server"

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { Database, Tables, Enums } from '@/database.types'

type Song = Tables<'song'>;

export const searchSongs = async (query: string) => {

    const supabase = createClient();

    const { data, error } = await supabase
        .from('song')
        .select('*')
        //.ilike('song_name', `%${query}%`)
        .or(`song_name.ilike.%${query}%,abbr.ilike.%${query}%,artist_name.ilike.%${query}%`)
        .limit(10);

    if (error) {
        console.error('Error fetching songs:', error);
        return [];
    }

    return data;
};

export const getSongFromSlug = async (slug: string): Promise<Song | null> => {

    const supabase = createClient();

    const { data: song, error } = await supabase
        .from('song')
        .select('*')
        .eq('slug', slug)
        .single()
    if (error) {
        console.error('Error fetching songs:', error);
        return null;
    }

    return song;
};

export async function navigate(url: String) {
    redirect(`${url}`);
}