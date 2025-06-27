"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [songs, setSongs] = useState<
    { song: string; slug: string; times_played?: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all song names, slugs, and times_played once and cache in state
    async function fetchSongs() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("songs")
        .select("song,slug,times_played")
        .order("times_played", { ascending: false });
      if (!error && data) {
        setSongs(
          data.map(
            (row: { song: string; slug: string; times_played?: number }) => ({
              song: row.song,
              slug: row.slug,
              times_played: row.times_played,
            })
          )
        );
      }
      setLoading(false);
    }
    fetchSongs();
  }, []);

  const filteredSongs = songs.filter(
    (song) =>
      song.song.toLowerCase().includes(searchTerm.toLowerCase()) &&
      searchTerm.length > 0
  );

  return (
    <div className="w-full max-w-md mx-auto relative pt-8">
      {/* Orange Gaussian Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 blur-xl scale-110 -z-10 rounded-xl" />

      <div className="relative bg-white/90 rounded-xl shadow-2xl shadow-purple-500/75 border border-white/50">
        <div className="relative">
          <Input
            type="text"
            placeholder={
              loading ? "Loading songs..." : "Search for a Phish song..."
            }
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full h-12 pl-4 pr-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg bg-white/95"
            disabled={loading}
          />
          <Button
            size="sm"
            className="absolute right-1 top-1 h-10 bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              if (searchTerm) {
                console.log("Searching for:", searchTerm);
                // Will implement actual search later
              }
            }}
            disabled={loading}
          >
            <Music className="h-4 w-4" />
          </Button>
        </div>

        {showSuggestions && filteredSongs.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredSongs.map((song, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => {
                  setSearchTerm(song.song);
                  setShowSuggestions(false);
                  window.location.href = `/songs/${song.slug}`;
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Music className="h-4 w-4 text-purple-600 mr-3" />
                    <span className="text-gray-900">{song.song}</span>
                  </div>
                  {typeof song.times_played === "number" && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">
                      {song.times_played}×
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
