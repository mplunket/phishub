import { createSong } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function NewSongPage() {
  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Song</h1>

        <form action={createSong} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Enter song title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="composers">Composers</Label>
            <Input
              id="composers"
              name="composers"
              placeholder="Enter composers (comma-separated)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="debutDate">Debut Date</Label>
            <Input id="debutDate" name="debutDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">History</Label>
            <Textarea
              id="history"
              name="history"
              placeholder="Enter song history"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea
              id="lyrics"
              name="lyrics"
              placeholder="Enter song lyrics"
              rows={10}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">Create Song</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
