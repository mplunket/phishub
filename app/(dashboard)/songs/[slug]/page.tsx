import {
  getSongBySlug,
  getTabsBySongId,
  getCommentsBySongId,
  getVideosBySongId,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SongPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const song = await getSongBySlug(slug);
  const [tabs, comments, videos] = await Promise.all([
    getTabsBySongId(song.id),
    getCommentsBySongId(song.id),
    getVideosBySongId(song.id),
  ]);

  return (
    <div className="container pt-3 pb-7">
      {/* Song header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{song.song}</h1>
        {song.artist && (
          <p className="text-lg text-muted-foreground">By {song.artist}</p>
        )}
        {song.debut && (
          <p className="text-sm text-muted-foreground mt-2">
            First played on {new Date(song.debut).toLocaleDateString()}
          </p>
        )}
        {song.times_played && (
          <p className="text-sm text-muted-foreground mt-2">
            Played {song.times_played} time
            {song.times_played !== 1 ? "s" : ""}
          </p>
        )}
        {song.last_played && (
          <p className="text-sm text-muted-foreground mt-2">
            Last played on {new Date(song.last_played).toLocaleDateString()}
          </p>
        )}
        {song.debut_permalink && (
          <p className="text-sm mt-2">
            <a
              href={song.debut_permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              View debut setlist
            </a>
          </p>
        )}
        {song.last_permalink && (
          <p className="text-sm mt-2">
            <a
              href={song.last_permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              View last played setlist
            </a>
          </p>
        )}
      </div>

      {/* Song sections */}
      <div className="grid gap-8">
        {/* Videos section */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Videos</h2>
            <div className="grid gap-6">
              {videos.map((video) => (
                <div key={video.id} className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">{video.name}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    {video.description}
                  </p>
                  {video.platform === "youtube" ? (
                    <div className="aspect-video">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${video.video_id}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : video.platform === "vimeo" ? (
                    <div className="aspect-video">
                      <iframe
                        src={`https://player.vimeo.com/video/${video.video_id}`}
                        width="100%"
                        height="315"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={video.name}
                      ></iframe>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lyrics section */}
        {song.lyrics && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Lyrics</h2>
            <div className="prose max-w-none whitespace-pre-line">
              {song.lyrics}
            </div>
          </section>
        )}

        {/* Tabs section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Tabs</h2>
            <Button asChild>
              <Link href={`/songs/${song.slug}/tabs/new`}>Add Tab</Link>
            </Button>
          </div>
          {tabs.length > 0 ? (
            <div className="grid gap-4">
              {tabs.map((tab) => (
                <Link
                  key={tab.id}
                  href={`/tabs/${tab.id}`}
                  className="p-4 rounded-lg border hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {song.song} - {tab.type}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(tab.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No tabs available yet. Be the first to add one!
            </p>
          )}
        </section>

        {/* Comments section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Discussion</h2>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 rounded-lg border">
                  <p className="mb-2">{comment.content}</p>
                  <p className="text-sm text-muted-foreground">
                    Posted on {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No comments yet. Start the discussion!
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
