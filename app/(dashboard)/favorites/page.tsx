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
        <div className="grid gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={`/songs/${tab.song.slug}`}
              className="p-4 rounded-lg border hover:border-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{tab.song.song}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {tab.user?.username ?? "Unknown"}
                  </p>
                </div>
                <Badge variant="secondary">{tab.type}</Badge>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
