"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { VideoEmbed } from "@/components/video-embed";
import { Badge } from "@/components/ui/badge";
import type { RecentVideo } from "@/lib/api";
import { fetchVideosPage } from "@/app/(dashboard)/videos/actions";

export function VideosInfinite({
  initialVideos,
  total,
  pageSize,
}: {
  initialVideos: RecentVideo[];
  total: number;
  pageSize: number;
}) {
  const [videos, setVideos] = useState<RecentVideo[]>(initialVideos);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasMore = videos.length < total;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const next = page + 1;
      const { videos: more } = await fetchVideosPage(next, pageSize);
      setVideos((prev) => [...prev, ...more]);
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="space-y-2">
            <VideoEmbed
              platform={video.platform}
              videoId={video.video_id}
              title={video.name}
            />
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{video.name}</p>
              <Badge variant="secondary">{video.type}</Badge>
            </div>
            <Link
              href={`/songs/${video.song.slug}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {video.song.song}
            </Link>
          </div>
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
