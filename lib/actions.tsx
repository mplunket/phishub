"use server"

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { Database, Tables, Enums } from '@/database.types'

type Song = Tables<'song'>;
type Tab = Tables<'tab'>;

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

export const getTabsFromSong = async (song_id: number): Promise<Tab[] | null> => {

    const supabase = createClient();

    const { data: tabs, error } = await supabase
        .from('tab')
        .select('*')
        .eq('song_id', song_id)
    if (error) {
        console.error('Error fetching tabs:', error);
        return null;
    }

    return tabs;
};

export async function navigate(url: String) {
    redirect(`${url}`);
}