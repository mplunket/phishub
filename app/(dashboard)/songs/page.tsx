import { getSongsPage, searchSongs } from "@/lib/api";
import { SongList } from "@/components/song-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 50;

export default async function SongsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam) || 1);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Songs</h1>

      <form action="/songs" className="flex gap-2 mb-8 max-w-md">
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

      {query ? (
        <SearchResults query={query} />
      ) : (
        <BrowseSongs page={page} />
      )}
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

async function BrowseSongs({ page }: { page: number }) {
  const { songs, total } = await getSongsPage(page, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <SongList songs={songs} />
      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-8">
          <Button
            asChild={page > 1}
            variant="outline"
            size="sm"
            disabled={page <= 1}
          >
            {page > 1 ? (
              <Link href={`/songs?page=${page - 1}`}>Previous</Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            asChild={page < totalPages}
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
          >
            {page < totalPages ? (
              <Link href={`/songs?page=${page + 1}`}>Next</Link>
            ) : (
              <span>Next</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
