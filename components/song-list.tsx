import Link from "next/link";
import { Song } from "@/types";

export function SongList({ songs }: { songs: Song[] }) {
  return (
    <div className="grid gap-4">
      {songs.map((song) => (
        <Link
          key={song.id}
          href={`/songs/${song.slug}`}
          className="p-4 rounded-lg border hover:border-primary transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{song.song}</h3>
              {song.artist && (
                <p className="text-sm text-muted-foreground">
                  By {song.artist}
                </p>
              )}
            </div>
            {song.debut && (
              <div className="text-sm text-muted-foreground">
                Debuted: {new Date(song.debut).toLocaleDateString()}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
