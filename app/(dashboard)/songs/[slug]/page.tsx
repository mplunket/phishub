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
import { Discussion } from "@/components/discussion";
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
          {isAuthed && (
            <div className="flex justify-end mb-4">
              <AddTabDialog songId={song.id} slug={slug} />
            </div>
          )}
          <TabSection
            tabs={tabs}
            userFavoriteTabIds={userFavoriteTabIds}
            canFavorite={isAuthed}
            revalidate={revalidatePath}
          />
        </TabsContent>
        <TabsContent value="videos">
          <h2 className="text-2xl font-semibold mb-4">Videos</h2>
          {videos.length === 0 && (
            <p className="text-muted-foreground">No videos yet.</p>
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
