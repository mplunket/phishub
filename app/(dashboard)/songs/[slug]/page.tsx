import {
  getSongBySlug,
  getTabsBySongId,
  getCommentsBySongId,
  getVideosBySongId,
} from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSection } from "@/components/tab-section";
import * as React from "react";
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

  // Simulate user favorite tab IDs (replace with real user data)
  const userFavoriteTabIds: string[] = [];

  return (
    <div className="container pt-3 pb-7">
      {/* Song header */}
      <div className="mb-2">
        <h1 className="text-4xl font-bold">{song.song}</h1>
        {song.artist && (
          <p className="text-lg text-muted-foreground">By {song.artist}</p>
        )}
      </div>

      <Tabs defaultValue="tabs" className="w-full">
        <TabsList>
          <TabsTrigger value="tabs">Tabs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
          <TabsTrigger value="discussion">Discussion</TabsTrigger>
        </TabsList>
        <TabsContent value="tabs">
          <TabSection
            tabs={tabs.map((t) => ({
              id: t.id,
              type: t.type,
              favorites: t.favorites || 0,
              user: {
                username: t.user?.username || "Unknown",
                avatar_url: t.user?.avatar_url,
              },
              content: t.content,
            }))}
            userFavoriteTabIds={userFavoriteTabIds}
          />
        </TabsContent>
        <TabsContent value="videos">Change your password here.</TabsContent>
        <TabsContent value="lyrics">
          <div className="prose max-w-none whitespace-pre-line">
            {song.lyrics || "No lyrics available for this song."}
          </div>
        </TabsContent>
        <TabsContent value="discussion">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
