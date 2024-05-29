"use client"

import { useState, useEffect, ChangeEvent, KeyboardEvent, MouseEvent, FocusEvent } from 'react';
import { fetchSongs } from '@/lib/actions';
import { Database, Tables, Enums } from '@/database.types'
import Link from 'next/link';

type Song = Tables<'song'>;

const SearchBar = () => {
    const [suggestions, setSuggestions] = useState<Song[]>([]);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        const fetchAndSetSuggestions = async () => {
            console.log('Fetching songs with title "' + inputValue + '"');
            const songs = await fetchSongs(inputValue);
            console.log(songs);
            setSuggestions(songs);
        };

        if (inputValue) {
            fetchAndSetSuggestions();
        } else {
            setSuggestions([]);
        }
    }, [inputValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setActiveSuggestionIndex(0);
        setShowSuggestions(true);
    };

    const handleClick = (e: MouseEvent<HTMLLIElement>) => {
        setInputValue(e.currentTarget.innerText);
        setActiveSuggestionIndex(0);
        setShowSuggestions(false);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        setShowSuggestions(false);
    }

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
        setShowSuggestions(true);
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setInputValue(suggestions[activeSuggestionIndex].song_name);
            setActiveSuggestionIndex(0);
            setShowSuggestions(false);
        } else if (e.key === 'ArrowUp') {
            if (activeSuggestionIndex === 0) {
                return;
            }
            setActiveSuggestionIndex(activeSuggestionIndex - 1);
        } else if (e.key === 'ArrowDown') {
            if (activeSuggestionIndex - 1 === suggestions.length) {
                return;
            }
            setActiveSuggestionIndex(activeSuggestionIndex + 1);
        }
    };

    return (
        <div className="w-full">
            <div className="relative w-256">
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded"
                    placeholder="Search for a song..."
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                />
                {showSuggestions && inputValue && (
                    <ul className="absolute w-full bg-white border border-gray-300 rounded mt-1 z-10">
                        {suggestions.length ? (
                            suggestions.map((suggestion, index) => {
                                let className;
                                if (index === activeSuggestionIndex) {
                                    className = 'bg-blue-500 text-white';
                                }
                                return (
                                    <li
                                        className={`px-4 py-2 cursor-pointer ${className}`}
                                        key={suggestion.id}
                                        onClick={handleClick}
                                    >
                                        <Link href={`/songs/${suggestion.slug}`}>{suggestion.song_name}</Link>
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
