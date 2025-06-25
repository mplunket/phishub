"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const songs = ["Ghost", "Tweezer", "Divided Sky", "Wilson", "Harry Hood"];
  const filteredSongs = songs.filter(
    (song) =>
      song.toLowerCase().includes(searchTerm.toLowerCase()) &&
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
            placeholder="Search for a Phish song..."
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
            size="sm"
            className="absolute right-1 top-1 h-10 bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              if (searchTerm) {
                console.log("Searching for:", searchTerm);
                // Will implement actual search later
              }
            }}
          >
            <Music className="h-4 w-4" />
          </Button>
        </div>

        {showSuggestions && filteredSongs.length > 0 && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-sm border border-purple-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredSongs.map((song, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-purple-50 focus:bg-purple-50 focus:outline-none border-b border-gray-100 last:border-b-0 transition-colors"
                onClick={() => {
                  setSearchTerm(song);
                  setShowSuggestions(false);
                  console.log("Selected song:", song);
                  // Will implement navigation to song page later
                }}
              >
                <div className="flex items-center">
                  <Music className="h-4 w-4 text-purple-600 mr-3" />
                  <span className="text-gray-900">{song}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
