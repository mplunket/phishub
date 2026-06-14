import { getSongsPage, searchSongs } from "@/lib/api";
import { SongList } from "@/components/song-list";
import { SongsInfinite } from "@/components/songs-infinite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 50;

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4 sm:text-3xl">Songs</h1>

      <form action="/songs" className="flex gap-2 mb-6 max-w-md">
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search songs by title or lyrics..."
        />
        <Button type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {query ? <SearchResults query={query} /> : <BrowseSongs />}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const songs = await searchSongs(query);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {songs.length} result{songs.length === 1 ? "" : "s"} for &ldquo;
          {query}&rdquo;
        </p>
        <Button asChild variant="ghost" size="sm">
          <Link href="/songs">Clear search</Link>
        </Button>
      </div>
      {songs.length > 0 ? (
        <SongList songs={songs} />
      ) : (
        <p className="text-center text-muted-foreground py-12">
          No songs match your search.
        </p>
      )}
    </div>
  );
}

async function BrowseSongs() {
  const { songs, total } = await getSongsPage(1, PAGE_SIZE);

  return (
    <SongsInfinite initialSongs={songs} total={total} pageSize={PAGE_SIZE} />
  );
}
