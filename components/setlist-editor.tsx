"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSetlist, updateSetlistSongs } from "@/app/actions";

type SongItem = { songId: string; song: string; slug: string };

// Owner-only editor for a setlist: edit the details (name/venue/date) and
// reorder or remove songs. Reordering is done client-side with up/down controls
// (touch-friendly, no drag library) and persisted in one call on save.
export function SetlistEditor({
  setlist,
  initialSongs,
}: {
  setlist: { id: string; name: string; venue: string | null; date: string | null };
  initialSongs: SongItem[];
}) {
  const router = useRouter();

  const [songs, setSongs] = React.useState<SongItem[]>(initialSongs);
  const [savingDetails, setSavingDetails] = React.useState(false);
  const [detailsSaved, setDetailsSaved] = React.useState(false);
  const [savingOrder, setSavingOrder] = React.useState(false);
  const [orderSaved, setOrderSaved] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const dirty = React.useMemo(
    () =>
      songs.length !== initialSongs.length ||
      songs.some((s, i) => s.songId !== initialSongs[i]?.songId),
    [songs, initialSongs]
  );

  function move(index: number, dir: -1 | 1) {
    setSongs((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setOrderSaved(false);
  }

  function remove(index: number) {
    setSongs((prev) => prev.filter((_, i) => i !== index));
    setOrderSaved(false);
  }

  async function saveDetails(formData: FormData) {
    setSavingDetails(true);
    setError(null);
    try {
      await updateSetlist(formData);
      setDetailsSaved(true);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Could not save details");
    } finally {
      setSavingDetails(false);
    }
  }

  async function saveOrder() {
    setSavingOrder(true);
    setError(null);
    try {
      await updateSetlistSongs(
        setlist.id,
        songs.map((s) => s.songId)
      );
      setOrderSaved(true);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Could not save song order");
    } finally {
      setSavingOrder(false);
    }
  }

  return (
    <div className="space-y-10">
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Details */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Details</h2>
        <form action={saveDetails} className="space-y-4">
          <input type="hidden" name="id" value={setlist.id} />
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={setlist.name}
              onChange={() => setDetailsSaved(false)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Input
                id="venue"
                name="venue"
                defaultValue={setlist.venue ?? ""}
                onChange={() => setDetailsSaved(false)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={setlist.date ?? ""}
                onChange={() => setDetailsSaved(false)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button type="submit" disabled={savingDetails}>
              {savingDetails ? "Saving…" : "Save details"}
            </Button>
            {detailsSaved && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </form>
      </section>

      {/* Songs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Songs</h2>
          <div className="flex items-center gap-3">
            {orderSaved && !dirty && (
              <span className="inline-flex items-center gap-1 text-sm text-emerald-600">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
            <Button
              type="button"
              onClick={saveOrder}
              disabled={savingOrder || !dirty}
            >
              {savingOrder ? "Saving…" : "Save order"}
            </Button>
          </div>
        </div>

        {songs.length === 0 ? (
          <p className="text-muted-foreground">
            No songs in this setlist. Removed songs are gone once you save.
          </p>
        ) : (
          <ol className="space-y-2">
            {songs.map((s, index) => (
              <li
                key={`${s.songId}-${index}`}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <span className="w-6 text-sm tabular-nums text-muted-foreground">
                  {index + 1}.
                </span>
                <span className="flex-1 font-medium">{s.song}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Move up"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Move down"
                    disabled={index === songs.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    aria-label="Remove from setlist"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
