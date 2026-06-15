import { getFavoriteTabsForUser } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <p className="text-muted-foreground">
          Sign in to see your favorite tabs.
        </p>
      </div>
    );
  }

  const tabs = await getFavoriteTabsForUser();

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4 sm:text-3xl">Favorites</h1>

      {tabs.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t favorited any tabs yet.
        </p>
      ) : (
        <div className="divide-y overflow-hidden rounded-lg border">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/songs/${tab.song.slug}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-accent"
            >
              <div className="min-w-0">
                <h3 className="truncate font-medium leading-tight">
                  {tab.song.song}
                </h3>
                <p className="truncate text-xs text-muted-foreground">
                  by {tab.user?.username ?? "Unknown"}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0 capitalize">
                {tab.type}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
