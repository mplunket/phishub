import { getSetlistById } from "@/lib/api";
import { DeleteSetlistButton } from "@/components/delete-setlist-button";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
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

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{setlist.name}</h1>
            {setlist.venue && (
              <p className="text-muted-foreground">{setlist.venue}</p>
            )}
            {setlist.date && (
              <p className="text-sm text-muted-foreground">
                {new Date(setlist.date).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/setlists">Back</Link>
            </Button>
            {isOwner && <DeleteSetlistButton setlistId={setlist.id} />}
          </div>
        </div>

        {setlist.setlist_songs.length === 0 ? (
          <p className="text-muted-foreground">This setlist has no songs.</p>
        ) : (
          <ol className="space-y-2">
            {setlist.setlist_songs.map((entry, index) => (
              <li
                key={entry.songs.id}
                className="flex items-center gap-3 p-3 rounded-lg border"
              >
                <span className="text-sm text-muted-foreground w-6">
                  {index + 1}.
                </span>
                <Link
                  href={`/songs/${entry.songs.slug}`}
                  className="hover:underline"
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
