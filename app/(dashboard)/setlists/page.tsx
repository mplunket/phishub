import { getSetlists } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function SetlistsPage() {
  const setlists = await getSetlists();

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold sm:text-3xl">Setlists</h1>
        <Button asChild>
          <Link href="/setlists/new">Create Setlist</Link>
        </Button>
      </div>

      {setlists.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No setlists found</p>
          <Button asChild>
            <Link href="/setlists/new">Create Your First Setlist</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y overflow-hidden rounded-lg border">
          {setlists.map((setlist) => (
            <Link
              key={setlist.id}
              href={`/setlists/${setlist.id}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-accent"
            >
              <div className="min-w-0">
                <h3 className="truncate font-medium leading-tight">
                  {setlist.name}
                </h3>
                {setlist.venue && (
                  <p className="truncate text-xs text-muted-foreground">
                    {setlist.venue}
                  </p>
                )}
              </div>
              {setlist.date && (
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(setlist.date).toLocaleDateString()}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
