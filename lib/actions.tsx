"use server"

import { createClient } from '@/utils/supabase/server'

export const fetchSongs = async (query: string) => {

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
