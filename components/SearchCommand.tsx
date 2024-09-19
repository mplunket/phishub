'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { toast } from 'sonner'
import { searchSongs } from '@/app/actions'
import { Tables } from '@/lib/database.types'
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

type Song = Tables<'songs'>

export default function SearchCommand({ children }: { children: React.ReactNode }) {
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Song[]>([])
    const router = useRouter()

    const [debouncedSearchQuery] = useDebounce(searchQuery, 300)

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchQuery.trim() === '') {
                setSearchResults([])
                return
            }

            try {
                const results = await searchSongs(debouncedSearchQuery)
                setSearchResults(results)
                if (results.length === 0) {
                    toast.error('No songs found')
                }
            } catch (error) {
                console.error('Search error:', error)
                toast.error('Failed to search songs')
            }
        }

        performSearch()
    }, [debouncedSearchQuery])

    const handleSongSelect = (slug: string) => {
        router.push(`/songs/${slug}`)
        setSearchQuery('')
        setSearchResults([])
        setIsSearchOpen(false)
    }

    return (
        <>
            <div onClick={() => setIsSearchOpen(true)}>
                {children}
            </div>
            <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <Command>
                    <CommandInput
                        placeholder="Search songs..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Songs">
                            {searchResults.map((song) => (
                                <CommandItem
                                    key={song.id}
                                    onSelect={() => handleSongSelect(song.slug)}
                                >
                                    <div className="flex flex-col">
                                        <div>{song.name}</div>
                                        <div>{song.artist}</div>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    )
}