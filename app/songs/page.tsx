import { getSongs } from "@/lib/api";
import { SongList } from "@/components/song-list";

export default async function SongsPage() {
  const songs = await getSongs();

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Songs</h1>
        <div className="flex gap-4">
          <form className="flex gap-2">
            <input
              type="search"
              placeholder="Search songs..."
              className="px-3 py-1 border rounded-lg"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      <SongList songs={songs} />
    </div>
  );
}
