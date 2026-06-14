import {
  getSongBySlug,
  getTabsBySongId,
  getCommentsBySongId,
  getVideosBySongId,
  getUserFavoriteTabIds,
} from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabSection } from "@/components/tab-section";
import { AddTabDialog } from "@/components/add-tab-dialog";
import { AddVideoDialog } from "@/components/add-video-dialog";
import { DeleteVideoButton } from "@/components/delete-video-button";
import { VideoEmbed } from "@/components/video-embed";
import { Discussion } from "@/components/discussion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isAuthed = !!user;

  const userFavoriteTabIds = isAuthed
    ? await getUserFavoriteTabIds(tabs.map((t) => t.id))
    : [];

  const revalidatePath = `/songs/${slug}`;

  return (
    <div className="container pt-3 pb-7">
      {/* Song header */}
      <Button asChild variant="ghost" size="sm" className="mb-2 -ml-2">
        <Link href="/songs">
          <ArrowLeft className="mr-1 h-4 w-4" /> Songs
        </Link>
      </Button>
      <div className="mb-4">
        <h1 className="text-3xl font-bold sm:text-4xl">{song.song}</h1>
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
          {isAuthed && (
            <div className="flex justify-end mb-4">
              <AddTabDialog songId={song.id} slug={slug} />
            </div>
          )}
          <TabSection
            tabs={tabs}
            userFavoriteTabIds={userFavoriteTabIds}
            canFavorite={isAuthed}
            currentUserId={user?.id}
            revalidate={revalidatePath}
          />
        </TabsContent>
        <TabsContent value="videos">
          {isAuthed && (
            <div className="flex justify-end mb-4">
              <AddVideoDialog songId={song.id} slug={slug} />
            </div>
          )}
          {videos.length === 0 ? (
            <p className="text-muted-foreground">No videos yet.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {videos.map((video) => (
                <div key={video.id} className="space-y-2">
                  <VideoEmbed
                    platform={video.platform}
                    videoId={video.video_id}
                    title={video.name}
                  />
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-medium">{video.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        {video.type}
                      </Badge>
                    </div>
                    {user && video.created_by === user.id && (
                      <DeleteVideoButton
                        videoId={video.id}
                        revalidate={revalidatePath}
                      />
                    )}
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground">
                      {video.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="lyrics">
          <div className="prose max-w-none whitespace-pre-line">
            {song.lyrics || "No lyrics available for this song."}
          </div>
        </TabsContent>
        <TabsContent value="discussion">
          <Discussion
            comments={comments}
            songId={song.id}
            slug={slug}
            canComment={isAuthed}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
