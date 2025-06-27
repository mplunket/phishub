import { createTab } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSongBySlug } from "@/lib/api";

export default async function NewTabPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Add Tab for {song.song}</h1>
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
          </div>
        </form>
      </div>
    </div>
  );
}
