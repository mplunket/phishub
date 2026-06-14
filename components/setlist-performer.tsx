"use client";
import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TabViewer } from "@/components/tab-viewer";
import { cn } from "@/lib/utils";
import type { PerformSong } from "@/lib/api";

const LYRICS_KEY = "__lyrics__";

function contentFor(
  song: PerformSong,
  key: string
): { content: string; type: string } | undefined {
  if (key === LYRICS_KEY) {
    return song.lyrics
      ? { content: song.lyrics, type: "lyrics" }
      : undefined;
  }
  const tab = song.tabs.find((t) => t.id === key);
  return tab ? { content: tab.content, type: tab.type } : undefined;
}

function defaultKey(song: PerformSong): string | undefined {
  if (song.tabs.length > 0) return song.tabs[0].id;
  if (song.lyrics) return LYRICS_KEY;
  return undefined;
}

export function SetlistPerformer({
  name,
  songs,
  backHref,
}: {
  name: string;
  songs: PerformSong[];
  backHref: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [choices, setChoices] = React.useState<Record<string, string>>({});
  const touchStart = React.useRef<{ x: number; y: number } | null>(null);

  const go = React.useCallback(
    (next: number) => {
      setIndex((i) => Math.max(0, Math.min(songs.length - 1, next)));
    },
    [songs.length]
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  if (songs.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background p-6 text-center">
        <p className="text-muted-foreground">This setlist has no songs yet.</p>
        <Button asChild>
          <Link href={backHref}>Back to setlist</Link>
        </Button>
      </div>
    );
  }

  const song = songs[index];
  const options = [
    ...song.tabs.map((t) => ({
      key: t.id,
      label: `${t.type} · ${t.username}`,
    })),
    ...(song.lyrics ? [{ key: LYRICS_KEY, label: "lyrics" }] : []),
  ];
  const activeKey = choices[song.id] ?? defaultKey(song);
  const active = activeKey ? contentFor(song, activeKey) : undefined;

  function setChoice(key: string) {
    setChoices((c) => ({ ...c, [song.id]: key }));
  }

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Horizontal swipe that isn't mostly vertical scrolling.
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx < 0) go(index + 1);
      else go(index - 1);
    }
    touchStart.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-background"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <header className="flex items-center gap-2 border-b px-3 py-2">
        <Button asChild variant="ghost" size="icon" className="h-9 w-9 shrink-0">
          <Link href={backHref} aria-label="Exit performance mode">
            <X className="h-5 w-5" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-tight">
            {song.song}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {name} · {index + 1} of {songs.length}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Previous song"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Next song"
            disabled={index === songs.length - 1}
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {options.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto border-b px-3 py-2">
          {options.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setChoice(o.key)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                activeKey === o.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-hidden p-3">
        {active ? (
          <TabViewer key={`${song.id}:${activeKey}`} tab={active} fill />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <p className="text-muted-foreground">
              No tab, chords, or lyrics available for this song.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/songs/${song.slug}`}>Open song page</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
