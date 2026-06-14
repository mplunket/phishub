import Link from "next/link";
import { BookOpen, Video, FileText } from "lucide-react";
import { SongCard } from "@/lib/api";

export function SongList({ songs }: { songs: SongCard[] }) {
  return (
    <div className="divide-y overflow-hidden rounded-lg border">
      {songs.map((song) => (
        <Link
          key={song.id}
          href={`/songs/${song.slug}`}
          className="flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-accent"
        >
          <div className="min-w-0">
            <h3 className="truncate font-medium leading-tight">{song.song}</h3>
            {song.artist && (
              <p className="truncate text-xs text-muted-foreground">
                {song.artist}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2.5 text-muted-foreground">
            {song.hasTabs && (
              <BookOpen
                className="h-4 w-4 text-purple-600"
                aria-label="Has tabs"
              />
            )}
            {song.hasVideos && (
              <Video
                className="h-4 w-4 text-orange-500"
                aria-label="Has videos"
              />
            )}
            {song.hasLyrics && (
              <FileText className="h-4 w-4" aria-label="Has lyrics" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
