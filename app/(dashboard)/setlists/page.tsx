import { getSetlists } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SetlistsPage() {
  const setlists = await getSetlists();

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Setlists</h1>
        <Button asChild>
          <Link href="/setlists/new">Create Setlist</Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {setlists.map((setlist) => (
          <Link
            key={setlist.id}
            href={`/setlists/${setlist.id}`}
            className="block p-6 rounded-lg border hover:border-primary transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{setlist.name}</h2>
                {setlist.venue && (
                  <p className="text-muted-foreground">{setlist.venue}</p>
                )}
              </div>
              {setlist.date && (
                <div className="text-sm text-muted-foreground">
                  {new Date(setlist.date).toLocaleDateString()}
                </div>
              )}
            </div>
          </Link>
        ))}

        {setlists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No setlists found</p>
            <Button asChild>
              <Link href="/setlists/new">Create Your First Setlist</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
