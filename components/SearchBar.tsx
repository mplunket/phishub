'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { searchSongs, Song } from '@/lib/api';

const SearchBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<Song[]>([]);
    const router = useRouter();

    const handleSearch = async (value: string) => {
        if (value.length > 0) {
            const searchResults = await searchSongs(value);
            setResults(searchResults);
            setOpen(true);
        } else {
            setResults([]);
            setOpen(false);
        }
    };

    const handleSelect = (song: Song) => {
        router.push(`/songs/${song.slug}`);
        setOpen(false);
    };

    return (
        <Command className="rounded-lg border shadow-md w-full max-w-sm">
            <CommandInput placeholder="Search songs or tabs..." onValueChange={handleSearch} />
            {open && (
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Songs">
                        {results.map((song) => (
                            <CommandItem key={song.id} onSelect={() => handleSelect(song)}>
                                <span>{song.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            )}
        </Command>
    );
};

export default SearchBar;