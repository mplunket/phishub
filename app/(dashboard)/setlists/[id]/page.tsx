import { getSetlistById } from "@/lib/api";
import { DeleteSetlistButton } from "@/components/delete-setlist-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft, Music, Play } from "lucide-react";
import Link from "next/link";

export default async function SetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const setlist = await getSetlistById(id);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === setlist.creator_id;
  const songCount = setlist.setlist_songs.length;

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href="/setlists">
            <ArrowLeft className="mr-1 h-4 w-4" /> All setlists
          </Link>
        </Button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{setlist.name}</h1>
            {setlist.venue && (
              <p className="text-muted-foreground">{setlist.venue}</p>
            )}
            <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              {setlist.date && (
                <span>{new Date(setlist.date).toLocaleDateString()}</span>
              )}
              <span className="flex items-center gap-1">
                <Music className="h-3.5 w-3.5" />
                {songCount} song{songCount === 1 ? "" : "s"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            {songCount > 0 && (
              <Button asChild>
                <Link href={`/setlists/${id}/perform`}>
                  <Play className="mr-1 h-4 w-4" /> Perform
                </Link>
              </Button>
            )}
            {isOwner && <DeleteSetlistButton setlistId={setlist.id} />}
          </div>
        </div>

        {songCount === 0 ? (
          <p className="text-muted-foreground">This setlist has no songs.</p>
        ) : (
          <ol className="space-y-2">
            {setlist.setlist_songs.map((entry, index) => (
              <li
                key={entry.songs.id}
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary"
              >
                <span className="w-6 text-sm tabular-nums text-muted-foreground">
                  {index + 1}.
                </span>
                <Link
                  href={`/songs/${entry.songs.slug}`}
                  className="font-medium hover:underline"
                >
                  {entry.songs.song}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
