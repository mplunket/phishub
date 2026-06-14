import { getVideosPage } from "@/lib/api";
import { VideosInfinite } from "@/components/videos-infinite";

const PAGE_SIZE = 24;

export default async function VideosPage() {
  const { videos, total } = await getVideosPage(1, PAGE_SIZE);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Videos</h1>

      {videos.length === 0 ? (
        <p className="text-muted-foreground">No videos have been added yet.</p>
      ) : (
        <VideosInfinite
          initialVideos={videos}
          total={total}
          pageSize={PAGE_SIZE}
        />
      )}
    </div>
  );
}
