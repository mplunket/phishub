import { createSetlist } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetlistBuilder } from "@/components/setlist-builder";
import { getSongs } from "@/lib/api";
import Link from "next/link";

export default async function NewSetlistPage() {
  const songs = await getSongs();
  const options = songs.map((s) => ({ id: s.id, song: s.song }));

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Create a setlist</h1>
        <p className="text-muted-foreground mb-8">
          Build an ordered set you can play hands-free in performance mode.
        </p>

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

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div className="space-y-2">
            <Label>Songs</Label>
            <SetlistBuilder songs={options} />
          </div>

          <div className="flex gap-4">
            <Button type="submit">Create setlist</Button>
            <Button asChild type="button" variant="outline">
              <Link href="/setlists">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
