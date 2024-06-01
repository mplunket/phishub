"use client"

import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, MouseEvent, FocusEvent } from 'react';
import { searchSongs, navigate } from '@/lib/actions';
import { Database, Tables, Enums } from '@/database.types'
import Link from 'next/link';
import React from 'react';

type Song = Tables<'song'>;

const SearchBar = () => {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchAndSetSuggestions = async () => {
            console.log('Fetching songs with title "' + inputValue + '"');
            const songs = await searchSongs(inputValue);
            console.log(songs);
            setSuggestions(songs);
        };

        const handleClickOutside = (e: Event) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }

        if (inputValue) {
            fetchAndSetSuggestions();
        } else {
            setSuggestions([]);
        }

        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, [inputValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setActiveSuggestionIndex(0);
        setShowSuggestions(true);
    };

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setShowSuggestions(true);
    }

    const handleClick = (e: MouseEvent<HTMLLIElement>) => {
        setInputValue('');
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Navigate to selected suggestion
            setInputValue('');
            setActiveSuggestionIndex(0);
            setShowSuggestions(false);
            navigate(`/songs/${suggestions[activeSuggestionIndex].slug}`);
        } else if (e.key === 'ArrowUp') {
            if (activeSuggestionIndex === 0) {
                return;
            }
            setActiveSuggestionIndex(activeSuggestionIndex - 1);
        } else if (e.key === 'ArrowDown') {
            if (activeSuggestionIndex === suggestions.length - 1) {
                return;
            }
            setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
    };

    return (
        <div className=" min-w-48 w-1/2">
            <div className="relative" ref={ref}>
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:text-black rounded"
                    placeholder="Search for a song..."
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                />
                {showSuggestions && inputValue && (
                    <ul className="absolute w-full dark:text-black bg-white border border-gray-300 rounded mt-1 z-10">
                        {suggestions.length ? (
                            suggestions.map((suggestion, index) => {
                                let className;
                                if (index === activeSuggestionIndex) {
                                    className = 'bg-blue-500 hover:bg-blue-400 text-white hover:text-slate-200';
                                }
                                return (
                                    <li
                                        className={`px-4 py-2 cursor-pointer hover:bg-slate-200 ${className}`}
                                        key={suggestion.id}
                                        onClick={handleClick}
                                    >
                                        <Link href={`/songs/${suggestion.slug}`}>
                                            <div>{suggestion.song_name}</div>
                                            <div className="text-xs uppercase">{suggestion.artist_name}</div>
                                        </Link>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-2">No suggestions available</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
