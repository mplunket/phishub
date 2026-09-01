"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type SongSuggestion = { song: string; slug: string; times_played?: number };

// Give up on the suggestion prefetch after this long so a hung request can
// never leave the field unusable.
const SUGGESTION_FETCH_TIMEOUT_MS = 8000;

export function SearchBar({ shadow = true }: { shadow?: boolean }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [songs, setSongs] = useState<SongSuggestion[]>([]);

  useEffect(() => {
    // Prefetch song names/slugs once and cache them for the suggestions
    // dropdown. This is a progressive enhancement: the input stays usable and
    // submitting always falls back to the server-side search on /songs, so a
    // slow, failed, or aborted request never blocks typing.
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      SUGGESTION_FETCH_TIMEOUT_MS
    );

    async function fetchSongs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("songs")
          .select("song,slug,times_played")
          .order("times_played", { ascending: false })
          .abortSignal(controller.signal);
        if (!active || error || !data) return;
        setSongs(
          data.map((row: SongSuggestion) => ({
            song: row.song,
            slug: row.slug,
            times_played: row.times_played,
          }))
        );
      } catch {
        // Aborted or network failure — suggestions stay empty, search still works.
      } finally {
        clearTimeout(timeout);
      }
    }
    fetchSongs();

    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  const filteredSongs = songs.filter(
    (song) =>
      song.song.toLowerCase().includes(searchTerm.toLowerCase()) &&
      searchTerm.length > 0
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    setShowSuggestions(false);
    router.push(`/songs?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="w-full max-w-md mx-auto relative p-2">
      {/* Orange Gaussian Blur Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600 opacity-20 blur-xl scale-110 -z-10 rounded-xl" />

      <div
        className={
          `relative bg-white/90 rounded-xl border border-white/50` +
          (shadow ? " shadow-2xl shadow-purple-500/75" : "")
        }
      >
        <form onSubmit={handleSubmit} className="relative">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full h-12 pl-4 pr-12 text-base border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg bg-white/95"
          />
          <Button
            type="submit"
            size="sm"
            className="absolute right-1 top-1 h-10 bg-purple-600 hover:bg-purple-700"
          >
            <Music className="h-4 w-4" />
          </Button>
        </form>

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
