import { createTab } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSongById } from "@/lib/api";

export default async function NewTabPage({
  params,
}: {
  params: { id: string };
}) {
  const song = await getSongById(params.id);

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Tab for {song.title}</h1>
        <p className="text-muted-foreground mb-8">
          Share your knowledge by adding a tab, chord chart, or sheet music.
        </p>

        <form action={createTab} className="space-y-6">
          <input type="hidden" name="songId" value={song.id} />

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" required>
              <SelectTrigger>
                <SelectValue placeholder="Select tab type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tab">Guitar Tab</SelectItem>
                <SelectItem value="chord_chart">Chord Chart</SelectItem>
                <SelectItem value="sheet_music">Sheet Music</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              required
              placeholder="Enter your tab notation here..."
              rows={20}
              className="font-mono"
            />
            <p className="text-sm text-muted-foreground">
              Use ASCII tab notation for guitar tabs. For chord charts, list
              chords with their corresponding lyrics.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Submit Tab</Button>
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
