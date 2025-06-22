import { createSetlist } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSongs } from "@/lib/api";

export default async function NewSetlistPage() {
  const songs = await getSongs();

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Setlist</h1>

        <form action={createSetlist} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g., MSG New Year's Eve 2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" name="date" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue">Venue</Label>
            <Input
              id="venue"
              name="venue"
              placeholder="e.g., Madison Square Garden"
            />
          </div>

          <div className="space-y-2">
            <Label>Songs</Label>
            <div className="border rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                {songs.map((song) => (
                  <div key={song.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`song-${song.id}`}
                      name="songIds[]"
                      value={song.id}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label htmlFor={`song-${song.id}`} className="text-sm">
                      {song.title}
                    </label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select songs in the order they were played
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Create Setlist</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
