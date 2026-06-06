import { getRecentVideos } from "@/lib/api";
import { VideoEmbed } from "@/components/video-embed";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function VideosPage() {
  const videos = await getRecentVideos();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>

      {videos.length === 0 ? (
        <p className="text-muted-foreground">No videos have been added yet.</p>
      ) : (
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
      )}
    </div>
  );
}
