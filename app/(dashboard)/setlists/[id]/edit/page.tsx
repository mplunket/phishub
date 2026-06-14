import { getSetlistById } from "@/lib/api";
import { SetlistEditor } from "@/components/setlist-editor";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditSetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const setlist = await getSetlistById(id);
  // Only the creator can edit. Send everyone else to the read-only view.
  if (user.id !== setlist.creator_id) redirect(`/setlists/${id}`);

  const initialSongs = setlist.setlist_songs.map((entry) => ({
    songId: entry.songs.id,
    song: entry.songs.song,
    slug: entry.songs.slug,
  }));

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={`/setlists/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to setlist
          </Link>
        </Button>

        <h1 className="mb-6 text-3xl font-bold">Edit setlist</h1>

        <SetlistEditor
          setlist={{
            id: setlist.id,
            name: setlist.name,
            venue: setlist.venue,
            date: setlist.date,
          }}
          initialSongs={initialSongs}
        />
      </div>
    </div>
  );
}
