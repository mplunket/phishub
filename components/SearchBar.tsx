"use client"

import { useState, useEffect, KeyboardEvent } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Database, Tables, Enums } from '@/database.types';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

let Song: Tables<'song'>;

const SearchBar = () => {

    const supabase = createClient();

    const [songs, setSongs] = useState<typeof Song[] | null>([])

    useEffect(() => {
        const fetchSongs = async () => {
            const { data, error } = await supabase.from('song').select('*')
            setSongs(data)
        }

        fetchSongs()
    }, [])

    return (
        <div className="w-full flex-1">
            <form>
                <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search songs, tabs, etc..."
                        className="w-full appearance-none bg-white pl-8 shadow-none md:w-2/3 lg:w-1/2"
                    />
                </div>
                <div className="hidden">
                    {songs && songs.map(song => (
                        <p key={song.id}>{song.song_name}</p>
                    ))}
                </div>
            </form>
        </div>
    )
};

export default SearchBar;
