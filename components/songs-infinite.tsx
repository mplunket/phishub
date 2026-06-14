"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { SongList } from "@/components/song-list";
import type { SongCard } from "@/lib/api";
import { fetchSongsPage } from "@/app/(dashboard)/songs/actions";

export function SongsInfinite({
  initialSongs,
  total,
  pageSize,
}: {
  initialSongs: SongCard[];
  total: number;
  pageSize: number;
}) {
  const [songs, setSongs] = useState<SongCard[]>(initialSongs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = songs.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const { songs: more } = await fetchSongsPage(next, pageSize);
      setSongs((prev) => [...prev, ...more]);
      setPage(next);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <SongList songs={songs} />
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
