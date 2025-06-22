import { getTabsBySongId, getSongById } from "@/lib/api";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function SongTabsPage({
  params,
}: {
  params: { id: string };
}) {
  const [song, tabs] = await Promise.all([
    getSongById(params.id).catch(() => null),
    getTabsBySongId(params.id),
  ]);

  if (!song) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{song.title} - Tabs</h1>
          <p className="text-muted-foreground">
            Add or view tabs for this song
          </p>
        </div>

        {/* Tab types */}
        <div className="grid gap-8 mb-12">
          <section>
            <h2 className="text-xl font-semibold mb-4">Guitar Tabs</h2>
            {tabs
              .filter((t) => t.type === "tab")
              .map((tab) => (
                <div key={tab.id} className="p-4 border rounded-lg mb-4">
                  <pre className="overflow-x-auto p-4 bg-muted rounded">
                    {tab.content}
                  </pre>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Added {new Date(tab.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Chord Charts</h2>
            {tabs
              .filter((t) => t.type === "chord_chart")
              .map((tab) => (
                <div key={tab.id} className="p-4 border rounded-lg mb-4">
                  <pre className="overflow-x-auto p-4 bg-muted rounded">
                    {tab.content}
                  </pre>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Added {new Date(tab.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Sheet Music</h2>
            {tabs
              .filter((t) => t.type === "sheet_music")
              .map((tab) => (
                <div key={tab.id} className="p-4 border rounded-lg mb-4">
                  <pre className="overflow-x-auto p-4 bg-muted rounded">
                    {tab.content}
                  </pre>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Added {new Date(tab.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </section>
        </div>

        {/* Add new tab button */}
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <a href={`/songs/${song.id}/tabs/new`}>Add New Tab</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
