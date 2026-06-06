import { VideoPlatform } from "@/types";

export function VideoEmbed({
  platform,
  videoId,
  title,
}: {
  platform: VideoPlatform;
  videoId: string;
  title: string;
}) {
  const src =
    platform === "youtube"
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://player.vimeo.com/video/${videoId}`;

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
