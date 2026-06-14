"use client";
import * as React from "react";
import { Plus, X, ChevronUp, ChevronDown, Search, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Option = { id: string; song: string };

export function SetlistBuilder({ songs }: { songs: Option[] }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<Option[]>([]);

  const selectedIds = React.useMemo(
    () => new Set(selected.map((s) => s.id)),
    [selected]
  );

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return songs
      .filter((s) => !selectedIds.has(s.id) && s.song.toLowerCase().includes(q))
      .slice(0, 25);
  }, [query, songs, selectedIds]);

  function add(option: Option) {
    setSelected((prev) => [...prev, option]);
    setQuery("");
  }
  function remove(id: string) {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  }
  function move(index: number, dir: -1 | 1) {
    setSelected((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {selected.map((s) => (
        <input key={s.id} type="hidden" name="songIds[]" value={s.id} />
      ))}

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs to add..."
          className="pl-9"
        />
        {results.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-md border bg-popover shadow-md">
            {results.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => add(s)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
                {s.song}
              </button>
            ))}
          </div>
        )}
      </div>

      {selected.length === 0 ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          No songs added yet. Search above to build your set in order.
        </div>
      ) : (
        <ol className="space-y-2">
          {selected.map((s, i) => (
            <li
              key={s.id}
              className="flex items-center gap-2 rounded-lg border bg-card p-2 pl-3"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="w-6 shrink-0 text-sm tabular-nums text-muted-foreground">
                {i + 1}.
              </span>
              <span className="flex-1 truncate text-sm">{s.song}</span>
              <div className="flex shrink-0 items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Move up"
                  disabled={i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Move down"
                  disabled={i === selected.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                  onClick={() => remove(s.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
      <p className="text-xs text-muted-foreground">
        {selected.length} song{selected.length === 1 ? "" : "s"} · drag-free
        reordering with the arrows
      </p>
    </div>
  );
}
