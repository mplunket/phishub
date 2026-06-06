import { getRecentTabs } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function TabsPage() {
  const tabs = await getRecentTabs();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Tabs</h1>

      {tabs.length === 0 ? (
        <p className="text-muted-foreground">No tabs have been added yet.</p>
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
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{tab.type}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(tab.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
